document.addEventListener("DOMContentLoaded", () => {
    const footer = document.getElementById("footer");
  
    footer.innerHTML = `
  
        <div class="footer-grid">
  
            <div data-aos="fade-up" data-aos-delay="100" id="divlogo">
                <a href="https://www.teamcriativa.com/" id="link-insta-footer">
                    <div class="logo-footer"> 
                        <img id="logo">
                    </div>
                </a>
            </div>
    
            <div data-aos="fade-up" data-aos-delay="200">
                <h3 class="h3footer">Serviços</h3>
                    <p class="pfooter">Estratégia Marketing</p>
                    <p class="pfooter">Performance & Tráfego Pago</p>
                    <p class="pfooter">Branding & Posicionamento</p>
                    <p class="pfooter">Conteúdo & Engajamento</p>
                    <p class="pfooter">Desenvolvimento Digital</p>
            </div>
    
            <div data-aos="fade-up" data-aos-delay="300">
                <h3 class="h3footer">Contato</h3>
                <a class="afooter" href="https://wa.me/5575988119006" target="_blank"><p class="pfooter">WhatsApp: +55 75 98811-9006</p></a>
                <a class="afooter" href="https://instagram.com/mkt.agenciacriativa" target="_blank" aria-label="Instagram"><p class="pfooter">Instagram: mkt.agenciacriativa</p></a>
                <a class="afooter" href="mailto:contato@teamcriativa.com"><p class="pfooter">Mail: atendimento@teamcriativa.com</p></a>
                
            </div>
    
            <div data-aos="fade-up" data-aos-delay="400">
                <h3 class="h3footer">Dicas Rápidas</h3>
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
    

  });