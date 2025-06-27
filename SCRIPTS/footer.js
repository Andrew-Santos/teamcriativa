document.addEventListener("DOMContentLoaded", () => {
  const style = document.createElement("style");
  style.innerHTML = `
    #footer {
        background-color: #f4f4f4;
        font-family: 'Inter', sans-serif;
        padding: 30px;
        box-shadow: 0px -2px 8px rgba(192, 172, 172, 0.788);
        border-radius: 10px;
    }

    #footer .footer-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 40px;
    }

    #footer #divlogo {
        display: flex;
        align-items: center;
    }

    #footer .logo-footer {
        color: #cd533b;
        width: 180px;
    }

    #footer .logo-footer:hover {
        color: #8f3a29;
    }

    #footer .logo-footer:active {
        width: 190px;
    }

    #footer .h3footer {
        font-family: 'Poppins', sans-serif;
        font-size: 20px;
        color: #cd533b;
        margin-bottom: 10px;
    }

    #footer .pfooter,
    #footer .afooter {
        font-size: 14px;
        color: #596475;
        text-decoration: none;
        line-height: 1.7;
        transition: color 0.3s ease;
        display: block;
        margin: 0;
    }

    #footer .afooter:hover {
        font-weight: bold;
    }

    #footer .footer-bottom {
        text-align: center;
        font-size: 13px;
        color: #999;
        margin-top: 50px;
    }

    #footer .quick-tips {
        list-style: none;
        padding: 0;
        margin: 0;
    }

    #footer .quick-tips li {
        margin-bottom: 10px;
        font-size: 14px;
        color: #596475;
    }

    #footer .quick-tips li strong {
        color: #1d1d1d;
    }

    @media (max-width: 768px) {
        #footer .footer-grid {
            text-align: center;
        }
        #footer #divlogo {
            justify-content: center;
        }
    }
  `;
  document.head.appendChild(style);

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
