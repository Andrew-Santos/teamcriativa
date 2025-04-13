tsParticles.load("particles-js", {
    fullScreen: { enable: false },
    particles: {
      number: { value: 80 },
      color: { value: "#ffffff" },
      shape: { type: "circle" },
      opacity: { value: 0.1 },
      size: { value: 3, random: true },
      move: {
        enable: true,
        speed: 0.5,
        direction: "none",
        outModes: "out"
      }
    },
    interactivity: {
      events: {
        onhover: { enable: true, mode: "repulse" }
      },
      modes: {
        repulse: { distance: 100, duration: 0.4 }
      }
    },
    detectRetina: true
  });
  