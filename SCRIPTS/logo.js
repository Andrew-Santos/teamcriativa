document.addEventListener("DOMContentLoaded", function () {
  // Caminho da logo SVG
  const caminhoLogo = "IMAGES/logo.svg";

  // Seleciona o elemento com id="logo"
  const logoContainer = document.getElementById("logo");

  // Verifica se o elemento existe
  if (logoContainer) {
    fetch(caminhoLogo)
      .then(response => {
        if (!response.ok) {
          throw new Error("Logo não encontrada em " + caminhoLogo);
        }
        return response.text();
      })
      .then(svg => {
        logoContainer.innerHTML = svg;
      })
      .catch(error => console.error("Erro ao carregar a logo:", error));
  } else {
    console.warn('Elemento com id="logo" não encontrado.');
  }
});
