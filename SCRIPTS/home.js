// Scroll suave nos links internos
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const destino = document.querySelector(link.getAttribute('href'));
    destino.scrollIntoView({ behavior: 'smooth' });
  });
});

// Animações ao rolar a página
const elementosAnimar = document.querySelectorAll('.card, .sobre p, .portfolio img, .contato form');

const animarAoRolar = () => {
  const topoJanela = window.scrollY + window.innerHeight * 0.85;

  elementosAnimar.forEach(el => {
    if (el.getBoundingClientRect().top + window.scrollY < topoJanela) {
      el.style.opacity = 1;
      el.style.transform = 'translateY(0)';
    }
  });
};

window.addEventListener('scroll', animarAoRolar);

// Aplica estilo inicial nos elementos a animar
elementosAnimar.forEach(el => {
  el.style.opacity = 0;
  el.style.transform = 'translateY(40px)';
  el.style.transition = 'all 0.8s ease-out';
});

// Texto digitando automaticamente no hero
const frases = [
  "Marketing Digital de Alto Impacto",
  "Sites e Landing Pages Criativas",
  "Campanhas que Convertem",
  "Sua Marca no Topo"
];

let i = 0, j = 0;
let currentPhrase = [];
let isDeleting = false;
const h1 = document.querySelector(".hero h1");

function loop() {
  h1.innerHTML = currentPhrase.join('');

  if (i < frases.length) {
    if (!isDeleting && j <= frases[i].length) {
      currentPhrase.push(frases[i][j]);
      j++;
    }

    if (isDeleting && j > 0) {
      currentPhrase.pop();
      j--;
    }

    if (j === frases[i].length) {
      isDeleting = true;
      setTimeout(loop, 1500);
      return;
    }

    if (j === 0 && isDeleting) {
      isDeleting = false;
      i = (i + 1) % frases.length;
    }
  }

  const velocidade = isDeleting ? 50 : 100;
  setTimeout(loop, velocidade);
}

loop();

// Efeito neon no botão do hero
const botao = document.querySelector('.btn-primary');
botao.classList.add('neon-anim');

const estiloNeon = document.createElement('style');
estiloNeon.textContent = `
  .neon-anim {
    box-shadow: 0 0 10px #cd533b, 0 0 20px #cd533b, 0 0 30px #cd533b;
    animation: pulsar 1.5s infinite alternate;
  }

  @keyframes pulsar {
    from {
      box-shadow: 0 0 10px #cd533b, 0 0 20px #cd533b, 0 0 30px #cd533b;
    }
    to {
      box-shadow: 0 0 20px #cd533b, 0 0 30px #cd533b, 0 0 50px #cd533b;
    }
  }
`;
document.head.appendChild(estiloNeon);

// Parallax no vídeo de fundo
const video = document.querySelector('.hero-video');
window.addEventListener('scroll', () => {
  let value = window.scrollY * 0.4;
  video.style.transform = `translateY(${value}px)`;
});

// Loader inicial com fade-in
window.addEventListener("load", () => {
  document.body.style.opacity = 0;
  document.body.style.transition = "opacity 1s ease-in";
  setTimeout(() => {
    document.body.style.opacity = 1;
  }, 100);
});


// Partículas animadas no fundo
tsParticles.load("tsparticles", {
  fullScreen: { enable: true, zIndex: -1 },
  particles: {
    number: { value: 80 },
    color: { value: "#cd533b" },
    shape: { type: "circle" },
    opacity: { value: 0.3 },
    size: { value: 3 },
    move: {
      enable: true,
      speed: 2,
      direction: "none",
      outModes: { default: "bounce" }
    }
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "repulse" },
      onClick: { enable: true, mode: "push" }
    },
    modes: {
      repulse: { distance: 100 },
      push: { quantity: 4 }
    }
  },
  background: { color: "#000000" }
});

// Efeito de digitação no H1
const typewriter = (element, text, speed = 50) => {
  let i = 0;
  const type = () => {
    if (i < text.length) {
      element.innerHTML += text.charAt(i);
      i++;
      setTimeout(type, speed);
    }
  };
  element.innerHTML = ""; // limpa texto
  type();
};

window.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".hero-content h1");
  if (title) {
    typewriter(title, "Marketing Digital de Alto Impacto", 75);
  }

  // Scroll suave para navegação
  document.querySelectorAll("a[href^='#']").forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Efeito on scroll (fade-in)
  const reveal = () => {
    const reveals = document.querySelectorAll("section, .card, .galeria img");
    for (let el of reveals) {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const revealPoint = 100;
      if (elementTop < windowHeight - revealPoint) {
        el.classList.add("reveal-active");
      }
    }
  };

  window.addEventListener("scroll", reveal);
  reveal();
});
