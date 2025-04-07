document.getElementById("url").addEventListener("keypress", (e) => {
  if (e.key === "Enter") generateQRCode();
});

function generateQRCode() {
  const input = document.getElementById("url");
  const qrContainer = document.getElementById("qrcode");
  const url = input.value.trim();

  if (!url) return alert("Por favor, insira um link válido.");

  // Limpa container
  qrContainer.innerHTML = "";

  // Cria novo QRious
  const qr = new QRious({
    value: url,
    size: 200,
  });

  // Adiciona o canvas do QR ao container
  qrContainer.appendChild(qr.image);
  qrContainer.style.opacity = 0;

  // Transição suave de entrada
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

  if (!url) return alert("URL inválida");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const qrSize = 175;
  const x = (pageWidth - qrSize) / 2;
  const y = 40;

  // Título (opcional)
  pdf.setFontSize(20);
  pdf.text("QR Code Gerado", pageWidth / 2, 20, { align: "center" });

  // QR Code vetorial
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

  // URL abaixo do código
  pdf.setFontSize(12);
  pdf.text(url, pageWidth / 2, y + qrSize + 10, { align: "center" });

  pdf.save("qr_code.pdf");
}
