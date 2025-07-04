 document.addEventListener("DOMContentLoaded", () => {
  const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  // Cria e injeta o CSS (compartilhado)
  const style = document.createElement("style");
  style.innerHTML = `
    .preloader {
      position: fixed;
      z-index: 9999;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: #f4f4f4;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }

    /* === MOBILE === */
    #logo-wrapper {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 30px;
    }

    #logo-wrapper svg,
    #logo-wrapper #logo {
      width: 250px;
      height: auto;
      animation: fadeIn 1s ease-in-out;
      color: rgb(24, 24, 24);
    }

    #loading-dots {
      display: flex;
      gap: 8px;
      justify-content: center;
      align-items: center;
    }

    #loading-dots .dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background-color: rgb(68, 68, 68);
      animation: bounce 0.6s infinite ease-in-out;
    }

    #loading-dots .dot:nth-child(2) {
      animation-delay: 0.2s;
    }

    #loading-dots .dot:nth-child(3) {
      animation-delay: 0.4s;
    }

    /* === DESKTOP === */
    #desktop-preloader h1 {
      font-family: 'Poppins', sans-serif;
      font-size: 24px;
      color: #333;
      margin-bottom: 20px;
    }

    #desktop-loading-bar {
      width: 120px;
      height: 6px;
      background: #e0e0e0;
      border-radius: 10px;
      overflow: hidden;
      position: relative;
    }

    #desktop-loading-bar::before {
      content: '';
      position: absolute;
      height: 100%;
      width: 50%;
      background: #cd533b;
      animation: loadingBar 1.5s infinite ease-in-out;
    }

    @keyframes loadingBar {
      0% { left: -50%; }
      50% { left: 100%; }
      100% { left: 100%; }
    }

    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0.8);
        opacity: 0.6;
      }
      40% {
        transform: scale(1.4);
        opacity: 1;
      }
    }

    @keyframes fadeIn {
      from { opacity: 0; transform: scale(0.8); }
      to { opacity: 1; transform: scale(1); }
    }

    body.hidden-content {
      overflow: hidden;
    }
  `;
  document.head.appendChild(style);

  // Oculta conteúdo principal
  document.body.classList.add("hidden-content");

  // Define qual preloader usar
  const preloader = document.createElement("div");
  preloader.classList.add("preloader");

  if (isMobile) {
    // PRELOADER Y (Mobile)
    preloader.id = "mobile-preloader";
    preloader.innerHTML = `
      <div id="logo-wrapper">
        <img id="logo" class="logo" alt="Logo" />
      </div>
      <div id="loading-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    `;
  } else {
    // PRELOADER X (Desktop)
    preloader.id = "desktop-preloader";
    preloader.innerHTML = `
      <div id="logo-wrapper">
        <img id="logo" class="logo" alt="Logo" />
      </div>
      <div id="desktop-loading-bar"></div>
    `;
  }

  document.body.prepend(preloader);

  // Remove o preloader após 3s
  setTimeout(() => {
    document.body.classList.remove("hidden-content");
    preloader.remove();
  }, 3000);
});
