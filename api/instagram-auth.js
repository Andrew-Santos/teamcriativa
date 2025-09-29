// callback/api/instagram-auth.js - Backend seguro para Vercel
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    // Configurar CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

    // Responder OPTIONS (preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Só aceita POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido. Use POST.' });
    }

    console.log('🚀 Instagram Auth API iniciada');
    console.log('📝 Method:', req.method);
    
    // Log de ambiente (debug)
    console.log('🔍 Node version:', process.version);
    console.log('🔍 Env check:', {
        hasSupabaseUrl: !!process.env.SUPABASE_URL,
        hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY,
        hasInstagramId: !!process.env.INSTAGRAM_CLIENT_ID,
        hasInstagramSecret: !!process.env.INSTAGRAM_CLIENT_SECRET,
        hasRedirectUri: !!process.env.REDIRECT_URI
    });

    try {
        const { code, state } = req.body;

        // Validações básicas
        if (!code) {
            console.error('❌ Código ausente');
            return res.status(400).json({ error: 'Código de autorização obrigatório' });
        }

        console.log('✅ Código recebido:', code.substring(0, 20) + '...');

        // ✅ CONFIGURAÇÕES SEGURAS NO BACKEND
        const CONFIG = {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_SERVICE_KEY,
            clientId: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
            redirectUri: process.env.REDIRECT_URI || 'https://teamcriativa.com/callback'
        };

        // Verifica variáveis de ambiente
        const missingVars = [];
        Object.entries(CONFIG).forEach(([key, value]) => {
            if (!value) {
                missingVars.push(key);
                console.error(`❌ Variável ausente: ${key}`);
            }
        });

        if (missingVars.length > 0) {
            return res.status(500).json({ 
                error: 'Configuração incompleta no servidor',
                missing: missingVars,
                hint: 'Configure as variáveis de ambiente na Vercel'
            });
        }

        console.log('✅ Todas as variáveis configuradas');
        console.log('📍 Redirect URI:', CONFIG.redirectUri);

        // 1. TROCA CÓDIGO POR TOKEN
        console.log('🔄 Trocando código por token...');
        const tokenData = await exchangeCodeForToken(code, CONFIG);
        console.log('✅ Token obtido com sucesso');

        // 2. OBTÉM DADOS DO USUÁRIO
        console.log('🔄 Obtendo dados do usuário...');
        const userData = await getUserData(tokenData.access_token);
        console.log('✅ Dados do usuário:', userData.username);

        // 3. SALVA NO SUPABASE
        console.log('🔄 Salvando no Supabase...');
        const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
        
        // Tenta obter foto do perfil
        let profilePhoto = null;
        try {
            console.log('📸 Tentando obter foto do perfil...');
            const mediaResponse = await fetch(
                `https://graph.instagram.com/me/media?fields=media_url,media_type&limit=1&access_token=${tokenData.access_token}`
            );
            const mediaData = await mediaResponse.json();
            
            if (mediaData.data && mediaData.data.length > 0) {
                // Pega a primeira mídia que for imagem
                const imageMedia = mediaData.data.find(m => m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM');
                if (imageMedia) {
                    profilePhoto = imageMedia.media_url;
                    console.log('✅ Foto do perfil obtida');
                }
            }
        } catch (e) {
            console.log('⚠️ Foto do perfil não disponível:', e.message);
        }

        // Upsert no banco
        const { data: dbResult, error: dbError } = await supabase
            .from('client')
            .upsert({
                users: userData.username,
                profile_photo: profilePhoto,
                id_instagram: userData.id,
                access_token: tokenData.access_token,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'id_instagram',
                ignoreDuplicates: false
            })
            .select();

        if (dbError) {
            console.error('❌ Erro no Supabase:', dbError);
            return res.status(500).json({ 
                error: 'Erro ao salvar no banco de dados',
                details: dbError.message 
            });
        }

        console.log('✅ Usuário salvo com sucesso!');

        // ✅ SUCESSO
        return res.status(200).json({
            success: true,
            message: 'Autorização processada com sucesso',
            userData: {
                id: userData.id,
                username: userData.username,
                account_type: userData.account_type,
                media_count: userData.media_count
            },
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error('❌ Erro na API:', error);
        console.error('❌ Stack:', error.stack);
        console.error('❌ Message:', error.message);
        
        // Retorna erro detalhado
        return res.status(500).json({
            error: 'Erro interno do servidor',
            message: error.message,
            type: error.name,
            // Em produção, você pode querer remover o stack
            stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
        });
    }
}

// Trocar código por token
async function exchangeCodeForToken(code, config) {
    const formData = new FormData();
    formData.append('client_id', config.clientId);
    formData.append('client_secret', config.clientSecret);
    formData.append('grant_type', 'authorization_code');
    formData.append('redirect_uri', config.redirectUri);
    formData.append('code', code);

    console.log('📤 Enviando para Instagram API...');

    const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        body: formData
    });

    const responseText = await response.text();
    console.log('📥 Response status:', response.status);

    if (!response.ok) {
        console.error('❌ Erro na resposta:', responseText);
        let errorData;
        try {
            errorData = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Instagram API Error: ${response.status} - ${responseText}`);
        }
        throw new Error(`Instagram API: ${errorData.error_message || errorData.error || responseText}`);
    }

    const data = JSON.parse(responseText);
    
    if (!data.access_token) {
        throw new Error('Token de acesso não recebido do Instagram');
    }

    return data;
}

// Obter dados do usuário
async function getUserData(accessToken) {
    const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );
    
    const responseText = await response.text();
    
    if (!response.ok) {
        console.error('❌ Erro ao obter dados:', responseText);
        let errorData;
        try {
            errorData = JSON.parse(responseText);
        } catch (e) {
            throw new Error(`Erro ao obter dados do usuário: ${response.status}`);
        }
        throw new Error(`Erro: ${errorData.error?.message || responseText}`);
    }

    const data = JSON.parse(responseText);
    
    if (!data.id || !data.username) {
        throw new Error('Dados do usuário incompletos');
    }

    return data;
}
