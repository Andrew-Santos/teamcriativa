document.addEventListener("DOMContentLoaded", () => {
    const footer = document.getElementById("footer");
  
    footer.innerHTML = `
  
        <div class="footer-grid">
  
            <div data-aos="fade-up" data-aos-delay="100" id="divlogo">
                <a href="https://www.teamcriativa.com/"><div class="logo-container" id="logo"> <img src="../images/logo.svg" alt="Agência Criativa" id="logo"></div></a>
            </div>
    
            <div data-aos="fade-up" data-aos-delay="200">
                <h3>Serviços</h3>
                <a href="#">Estratégia Marketing</a><br/>
                <a href="#">Performance & Tráfego Pago</a><br/>
                <a href="#">Branding & Posicionamento</a><br/>
                <a href="#">Conteúdo & Engajamento</a><br/>
                <a href="#">Desenvolvimento Digital</a>                
            </div>
    
            <div data-aos="fade-up" data-aos-delay="300">
                <h3>Contato</h3>
                <a href="https://wa.me/5575988119006" target="_blank">WhatsApp: +55 75 98811-9006</a><br/>
                <a href="https://instagram.com/mkt.agenciacriativa" target="_blank" aria-label="Instagram"> Instagram: mkt.agenciacriativa</a>
                <a href="mailto:contato@teamcriativa.com">atendimento@teamcriativa.com</a>
                
            </div>
    
            <div data-aos="fade-up" data-aos-delay="400">
                <h3>Dicas Rápidas</h3>
                <ul class="quick-tips">
                    <li><strong>🧠 Engajamento:</strong> Use Reels + Stories para crescer rápido.</li>
                    <li><strong>🎯 Tráfego:</strong> Invista em anúncios com segmentação local.</li>
                    <li><strong>📲 Tendência:</strong> Interações via WhatsApp estão em alta.</li>
                </ul>
            </div>
    
        </div>
    
        <div class="footer-bottom">
            © ${new Date().getFullYear()} Agência Criativa — Todos os direitos reservados.
        </div>
    `;
    AOS.refresh();

  });