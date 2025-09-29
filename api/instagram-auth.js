// No topo do arquivo, adicione:
import FormData from 'form-data';

// OU mude a função exchangeCodeForToken para:
async function exchangeCodeForToken(code, config) {
    // Use URLSearchParams em vez de FormData
    const params = new URLSearchParams();
    params.append('client_id', config.clientId);
    params.append('client_secret', config.clientSecret);
    params.append('grant_type', 'authorization_code');
    params.append('redirect_uri', config.redirectUri);
    params.append('code', code);

    console.log('📤 Enviando para Instagram API...');

    const response = await fetch('https://api.instagram.com/oauth/access_token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString()
    });

    // resto do código continua igual...
}
