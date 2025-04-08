// Aguarda o carregamento completo do DOM antes de executar o script
document.addEventListener("DOMContentLoaded", function () {
  
  // Faz uma requisição para buscar o arquivo "logo.svg" dentro da pasta "images"
  fetch("images/logo.svg")
    
    // Quando a resposta chega, converte o conteúdo do arquivo para texto (string)
    .then(response => response.text())

    // Quando o SVG em formato de texto estiver disponível, executa essa função
    .then(svg => {
      
      // Insere o código SVG dentro da div com id "logo-container"
      document.getElementById("logo-principal").innerHTML = svg;
    })

    // Captura e exibe erros no console caso ocorra algum problema ao carregar o SVG
    .catch(error => console.error("Erro ao carregar o SVG:", error));
});
