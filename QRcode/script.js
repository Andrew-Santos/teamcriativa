// Espera o carregamento do DOM para ativar o botão
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-abrir-gerador");
  if (btn) {
    btn.addEventListener("click", abrirGerador);
  }
});

// Cria o modal com input e botão para gerar QR
function abrirGerador() {
  const modal = document.createElement("div");
  modal.classList.add("qr-modal");

  modal.innerHTML = `
    <div class="qr-content">
      <span class="qr-fechar" title="Fechar" onclick="this.closest('.qr-modal').remove()">✕</span>
      <h2>Gerar QR Code</h2>
      <input type="text" id="url" placeholder="Digite a URL">
      <button id="btn-gerar">Gerar QR Code</button>
      <div id="qrcode"></div>
    </div>
  `;

  document.body.appendChild(modal);

  // Ativa a animação de entrada
  setTimeout(() => {
    modal.classList.add("ativo");
  }, 50);

  // Aciona geração ao apertar Enter
  document.getElementById("url").addEventListener("keypress", (e) => {
    if (e.key === "Enter") generateQRCode();
  });

  // Aciona ao clicar no botão
  document.getElementById("btn-gerar").addEventListener("click", generateQRCode);
}

function generateQRCode() {
  const input = document.getElementById("url");
  const qrContainer = document.getElementById("qrcode");
  const url = input.value.trim();

  if (!url) return alert("Por favor, insira um link válido.");

  // Limpa o QR anterior
  qrContainer.innerHTML = "";

  // Cria novo QR com QRious
  const qr = new QRious({
    value: url,
    size: 200,
  });

  // Adiciona imagem
  qrContainer.appendChild(qr.image);
  qrContainer.style.opacity = 0;

  // Animação suave
  setTimeout(() => {
    qrContainer.style.opacity = 1;
    qrContainer.style.transition = "opacity 0.5s ease-in-out";
  }, 50);

  // Mensagem de sucesso
  const message = document.createElement("p");
  message.innerText = "QR Code gerado com sucesso!";
  message.style.color = "#CD533B";
  message.style.fontWeight = "600";
  message.style.marginTop = "15px";
  message.style.fontFamily = "Poppins, sans-serif";
  qrContainer.appendChild(message);

  // PDF automático
  downloadPDF(url);
}

function downloadPDF(url) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const pageWidth = pdf.internal.pageSize.getWidth();
  const qrSize = 175;
  const x = (pageWidth - qrSize) / 2;
  const y = 40;

  // Título
  pdf.setFontSize(20);
  pdf.text("QR Code Gerado", pageWidth / 2, 20, { align: "center" });

  // QR Code vetorial com qrcode-generator
  const qr = qrcode(0, 'H');
  qr.addData(url);
  qr.make();

  const cellSize = qrSize / qr.getModuleCount();

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

  // URL abaixo
  pdf.setFontSize(12);
  pdf.text(url, pageWidth / 2, y + qrSize + 10, { align: "center" });

  pdf.save("qr_code.pdf");
}
