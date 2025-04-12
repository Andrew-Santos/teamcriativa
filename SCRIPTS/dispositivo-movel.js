// Verifica se o dispositivo NÃO é móvel
if (!/Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    document.body.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:center;height:100vh;text-align:center;padding:2rem;font-family:sans-serif;">
            <div>
                <header id="logo-principal">
                    <a id="logo-instagram" href="https://www.instagram.com/mkt.agenciacriativa/"><img id="logo"></a>
                </header>
                
                <h1>Este site está disponível apenas para dispositivos móveis 📱</h1>
                <p>Por favor, acesse usando um smartphone.</p>

            </div>
        </div>
    `;
}