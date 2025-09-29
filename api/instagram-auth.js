import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
    const startTime = Date.now();
    const requestId = Math.random().toString(36).substring(7);
    
    console.log(`[${requestId}] ========== REQUEST START ==========`);
    console.log(`[${requestId}] Method: ${req.method}`);
    console.log(`[${requestId}] URL: ${req.url}`);
    
    // CORS
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        console.log(`[${requestId}] OPTIONS request - returning 200`);
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        console.log(`[${requestId}] Invalid method: ${req.method}`);
        return res.status(405).json({ error: 'Método não permitido' });
    }

    try {
        const { code, state } = req.body;
        
        console.log(`[${requestId}] Body received:`, {
            hasCode: !!code,
            codeLength: code?.length,
            hasState: !!state
        });

        if (!code) {
            console.log(`[${requestId}] ERROR: Missing code`);
            return res.status(400).json({ error: 'Código de autorização obrigatório' });
        }

        // Configuração
        const CONFIG = {
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseKey: process.env.SUPABASE_ANON_KEY,
            clientId: process.env.INSTAGRAM_CLIENT_ID,
            clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
            redirectUri: process.env.REDIRECT_URI || 'https://teamcriativa.com/callback'
        };

        console.log(`[${requestId}] Environment check:`, {
            supabaseUrl: !!CONFIG.supabaseUrl,
            supabaseKey: !!CONFIG.supabaseKey,
            clientId: !!CONFIG.clientId,
            clientSecret: !!CONFIG.clientSecret,
            redirectUri: CONFIG.redirectUri
        });

        // Verifica variáveis
        const missing = Object.entries(CONFIG)
            .filter(([k, v]) => !v)
            .map(([k]) => k);

        if (missing.length > 0) {
            console.log(`[${requestId}] ERROR: Missing env vars:`, missing);
            return res.status(500).json({ 
                error: 'Configuração incompleta',
                missing: missing
            });
        }

        // 1. Troca código por token
        console.log(`[${requestId}] Step 1: Exchange code for token`);
        const tokenData = await exchangeCodeForToken(code, CONFIG, requestId);
        console.log(`[${requestId}] Token obtained successfully`);

        // 2. Obtém dados do usuário
        console.log(`[${requestId}] Step 2: Get user data`);
        const userData = await getUserData(tokenData.access_token, requestId);
        console.log(`[${requestId}] User data obtained:`, {
            id: userData.id,
            username: userData.username,
            accountType: userData.account_type
        });

        // 3. Salva no Supabase
        console.log(`[${requestId}] Step 3: Save to Supabase`);
        const supabase = createClient(CONFIG.supabaseUrl, CONFIG.supabaseKey);
        
        // Foto do perfil
        let profilePhoto = null;
        try {
            const mediaResponse = await fetch(
                `https://graph.instagram.com/me/media?fields=media_url,media_type&limit=1&access_token=${tokenData.access_token}`
            );
            if (mediaResponse.ok) {
                const mediaData = await mediaResponse.json();
                const imageMedia = mediaData.data?.find(m => 
                    m.media_type === 'IMAGE' || m.media_type === 'CAROUSEL_ALBUM'
                );
                profilePhoto = imageMedia?.media_url || null;
            }
        } catch (e) {
            console.log(`[${requestId}] Profile photo unavailable:`, e.message);
        }

        // Upsert
        const { data: dbResult, error: dbError } = await supabase
            .from('client')
            .upsert({
                users: userData.username,
                profile_photo: profilePhoto,
                id_instagram: userData.id,
                access_token: tokenData.access_token
            }, {
                onConflict: 'id_instagram'
            })
            .select();

        if (dbError) {
            console.log(`[${requestId}] ERROR: Supabase error:`, dbError);
            return res.status(500).json({ 
                error: 'Erro ao salvar no banco',
                details: dbError.message 
            });
        }

        const duration = Date.now() - startTime;
        console.log(`[${requestId}] SUCCESS - Duration: ${duration}ms`);
        console.log(`[${requestId}] ========== REQUEST END ==========`);

        return res.status(200).json({
            success: true,
            message: 'Autorização processada com sucesso',
            userData: {
                id: userData.id,
                username: userData.username,
                account_type: userData.account_type,
                media_count: userData.media_count
            }
        });

    } catch (error) {
        const duration = Date.now() - startTime;
        console.log(`[${requestId}] ERROR after ${duration}ms:`, error.message);
        console.log(`[${requestId}] Stack:`, error.stack);
        
        return res.status(500).json({
            error: 'Erro interno',
            message: error.message
        });
    }
}

async function exchangeCodeForToken(code, config, requestId) {
    const params = new URLSearchParams({
        client_id: config.clientId,
        client_secret: config.clientSecret,
        grant_type: 'authorization_code',
        redirect_uri: config.redirectUri,
        code: code
    });

    console.log(`[${requestId}] Calling Instagram token endpoint...`);

    const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
    });

    const responseText = await response.text();
    console.log(`[${requestId}] Instagram response status: ${response.status}`);

    if (!response.ok) {
        console.log(`[${requestId}] Instagram error response:`, responseText);
        throw new Error(`Instagram API: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    if (!data.access_token) {
        throw new Error('Token não recebido');
    }

    return data;
}

async function getUserData(accessToken, requestId) {
    console.log(`[${requestId}] Calling Instagram user endpoint...`);
    
    const response = await fetch(
        `https://graph.instagram.com/me?fields=id,username,account_type,media_count&access_token=${accessToken}`
    );
    
    const responseText = await response.text();
    console.log(`[${requestId}] User data response status: ${response.status}`);
    
    if (!response.ok) {
        console.log(`[${requestId}] User data error:`, responseText);
        throw new Error(`Erro ao obter dados: ${responseText}`);
    }

    const data = JSON.parse(responseText);
    
    if (!data.id || !data.username) {
        throw new Error('Dados incompletos');
    }

    return data;
}