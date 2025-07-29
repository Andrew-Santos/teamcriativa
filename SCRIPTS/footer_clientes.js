(function () {
  const style = document.createElement("style");
  style.innerHTML = `
    html, body {
      margin: 0;
      padding: 0;
      height: 100%;
    }

    #page-wrapper {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }

    #ac-footer {
      background: linear-gradient(to right, #fdfdfd, #f4f4f4);
      color: #444;
      text-align: center;
      padding: 18px 16px;
      font-family: 'Poppins', sans-serif;
      font-size: clamp(12px, 2vw, 14px);
      font-weight: 400;
      border-top: 1px solid #e2e2e2;
      width: 100%;
      box-shadow: 0 -1px 4px rgba(0,0,0,0.05);
      margin-top: auto;
    }

    #ac-footer .ac-footer-container {
      max-width: 100%;
      width: 100%;
      line-height: 1.4;
      word-break: break-word;
      overflow-wrap: break-word;
      text-wrap: balance;
    }

    #ac-footer .ac-footer-container a {
      color: #cd533b;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s ease-in-out;
    }

    #ac-footer .ac-footer-container a:hover {
      color: #a9321e;
    }
  `;
  document.head.appendChild(style);

  // Envolve todo o conteúdo existente
  const wrapper = document.createElement("div");
  wrapper.id = "page-wrapper";

  // Move tudo dentro do body pra dentro do wrapper
  while (document.body.firstChild) {
    wrapper.appendChild(document.body.firstChild);
  }

  // Adiciona o wrapper de volta ao body
  document.body.appendChild(wrapper);

  // Cria e adiciona o footer no final do wrapper
  const footer = document.createElement("footer");
  footer.id = "ac-footer";
  footer.innerHTML = `
    <div class="ac-footer-container">
      © ${new Date().getFullYear()} 
      <a href="https://www.teamcriativa.com/" target="_blank" rel="noopener noreferrer">
        Agência Criativa
      </a> — Soluções para o seu negócio.
    </div>
  `;
  wrapper.appendChild(footer);
})();
