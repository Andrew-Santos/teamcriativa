const PASSWORD = "9260";

function checkPassword() {
    const input = document.getElementById("password").value;
    const error = document.getElementById("error-message");
    if (input === PASSWORD) {
        document.getElementById("password-container").classList.add("hidden");
        document.getElementById("qr-container").classList.remove("hidden");
        error.textContent = "";
    } else {
        error.textContent = "Senha incorreta. Tente novamente.";
    }
}

document.getElementById("password").addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkPassword();
});

document.getElementById("url").addEventListener("keypress", (e) => {
    if (e.key === "Enter") generateQRCode();
});

let qr;
function generateQRCode() {
  const url = document.getElementById("url").value;
  if (!url) return alert("Por favor, insira um link válido.");

  // Exibição opcional do QR Code na tela (não obrigatório para download)
  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = ""; // Limpa antes de adicionar
  const qr = new QRious({
    value: url,
    size: 200,
  });
  qrContainer.appendChild(qr.image); // Apenas visual, não afeta o PDF

  // Gera e baixa automaticamente o PDF vetorizado
  downloadPDF(url);
}


function downloadPDF(url) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  if (!url) return alert("URL inválida");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const qrSize = 175;
  const x = (pageWidth - qrSize) / 2;

  // Título
  pdf.setFontSize(20);

  // URL abaixo do QR
  pdf.setFontSize(12);

  // Gera QR vetorial com qrcode-generator
  const qr = qrcode(0, 'H');
  qr.addData(url);
  qr.make();

  const cellSize = qrSize / qr.getModuleCount();
  const y = 40;

  for (let row = 0; row < qr.getModuleCount(); row++) {
    for (let col = 0; col < qr.getModuleCount(); col++) {
      if (qr.isDark(row, col)) {
        pdf.rect(
          x + col * cellSize,
          y + row * cellSize,
          cellSize,
          cellSize,
          'F'
        );
      }
    }
  }

  pdf.save("qr_code.pdf");
}

