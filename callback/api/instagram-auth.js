// /api/instagram-auth.js - Backend seguro para Vercel
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Só aceita POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { code, state } = req.body;

        // Validações básicas
        if (!code) {
            return res.status(400).json({ error: 'Código de autorização obrigatório' });
        }

        // ✅ CONFIGURAÇÕES SEGURAS NO BACKEND
        const CONFIG = {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_SERVICE_KEY, // Service key para escrita
            clientId: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET, // ✅ SEGURO aqui!
            redirectUri: process.env.REDIRECT_URI
        };

        // Verifica se todas as variáveis estão configuradas
        const missingVars = [];
        Object.entries(CONFIG).forEach(([key, value]) => {
            if (!value) missingVars.push(key);
        });

        if (missingVars.length > 0) {
            return res.status(500).json({ 
                error: 'Configuração incompleta no servidor',
                missing: missingVars 
            });
        }

        // 1. ✅ TROCA CÓDIGO POR TOKEN (seguro no backend)
        console.log('🔄 Trocando código por token...');
        const tokenData = await exchangeCodeForToken(code, CONFIG);

        // 2. ✅ OBTÉM DADOS DO USUÁRIO
        console.log('🔄 Obtendo dados do usuário...');
        const userData = await getUserData(tokenData.access_token);

        // 3. ✅ SALVA NO SUPABASE
        console.log('🔄 Salvando no Supabase...');
        const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
        
        // Tenta obter foto do perfil
        let profilePhoto = null;
        try {
            const mediaResponse = await fetch(`https://graph.instagram.com/me/media?fields=media_url&limit=1&access_token=${tokenData.access_token}`);
            const mediaData = await mediaResponse.json();
            if (mediaData.data && mediaData.data.length > 0) {
                profilePhoto = mediaData.data[0].media_url;
            }
        } catch (e) {
            console.log('Foto do perfil não disponível');
        }

        // Upsert no banco (insere ou atualiza)
        const { data: dbResult, error: dbError } = await supabase
            .from('client')
            .upsert({
                users: userData.username,
                profile_photo: profilePhoto,
                id_instagram: userData.id,
                access_token: tokenData.access_token
            }, {
                onConflict: 'id_instagram',
                ignoreDuplicates: false
            })
            .select();

        if (dbError) {
            console.error('Erro no Supabase:', dbError);
            return res.status(500).json({ 
                error: 'Erro ao salvar no banco de dados',
                details: dbError.message 
            });
        }

        // ✅ SUCESSO!
        console.log('✅ Usuário salvo com sucesso:', userData.username);

        return res.status(200).json({
            success: true,
            message: 'Autorização processada com sucesso',
            userData: {
                id: userData.id,
                username: userData.username,
                account_type: userData.account_type,
                media_count: userData.media_count
            },
            // NÃO retorna o access_token para o frontend (segurança)
        });

    } catch (error) {
        console.error('Erro na API:', error);
        
        return res.status(500).json({
            error: 'Erro interno do servidor',
            message: error.message,
            // Em produção, remova/limite essas informações
            details: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// ✅ FUNÇÃO SEGURA: Trocar código por token
async function exchangeCodeForToken(code, config) {
    const formData = new FormData();
    formData.append('client_id', config.clientId);
    formData.append('client_secret', config.clientSecret); // ✅ Seguro no backend
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', config.redirectUri);
    formData.append('code', code);

    const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Instagram API Error: ${errorData.error_message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.access_token) {
        throw new Error('Token de acesso não recebido do Instagram');
    }

    return data;
}

// ✅ FUNÇÃO SEGURA: Obter dados do usuário
async function getUserData(accessToken) {
    const response = await fetch(`https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`);
    
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao obter dados do usuário: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.id || !data.username) {
        throw new Error('Dados do usuário incompletos');
    }

    return data;
}