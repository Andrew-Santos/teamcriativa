document.addEventListener("DOMContentLoaded", () => {
  // Adiciona o link das fontes Google
  const fontLink = document.createElement("link");
  fontLink.rel = "stylesheet";
  fontLink.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Poppins:wght@400;500;600;700&display=swap";
  document.head.appendChild(fontLink);

  // Adiciona o CSS global
  const style = document.createElement("style");
  style.innerHTML = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        list-style-type: none;
        text-decoration: none;
        color: inherit;
    }
  `;
  document.head.appendChild(style);
});
