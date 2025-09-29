export default async function handler(req, res) {
    return res.status(200).json({
        success: true,
        message: 'API funcionando',
        env: {
            hasClientId: !!process.env.INSTAGRAM_CLIENT_ID,
            hasClientSecret: !!process.env.INSTAGRAM_CLIENT_SECRET,
            hasSupabaseUrl: !!process.env.SUPABASE_URL,
            hasSupabaseKey: !!process.env.SUPABASE_SERVICE_KEY
        }
    });
}
