document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("btn-abrir-gerador");
  if (btn) btn.addEventListener("click", abrirGerador);
});

function abrirGerador() {
  const modal = document.createElement("div");
  modal.classList.add("qr-modal");

  modal.innerHTML = `
    <div class="qr-content">
      <span class="qr-fechar" title="Fechar" onclick="this.closest('.qr-modal').remove()">✕</span>
      <img src="../IMAGES/logo.svg" alt="Logo" class="qr-logo" >
      <h2>Gerar QR Code</h2>
      <div id="qr-type-select" style="display: flex; gap: 10px; justify-content: center; margin-bottom: 20px;">
        <button class="qr-type-btn ativo" data-type="url" title="URL">
          <svg width="24" height="24" fill="#ffffff" viewBox="0 0 24 24"><path d="M3.9,12c0-1.7,1.4-3.1,3.1-3.1h4V7H7C4.2,7,2,9.2,2,12s2.2,5,5,5h4v-1.9H7C5.3,15.1,3.9,13.7,3.9,12z M8.1,13.1h7.8v-2.2H8.1V13.1z M17,7h-4v1.9h4c1.7,0,3.1,1.4,3.1,3.1s-1.4,3.1-3.1,3.1h-4V17h4c2.8,0,5-2.2,5-5S19.8,7,17,7z"/></svg>
        </button>
        <button class="qr-type-btn" data-type="wifi" title="Wi-Fi">
          <svg width="24" height="24" fill="#ffffff" viewBox="0 0 24 24"><path d="M12,18c-0.8,0-1.5,0.7-1.5,1.5S11.2,21,12,21s1.5-0.7,1.5-1.5S12.8,18,12,18z M4.9,9.9l1.4,1.4C8.4,9.2,10.2,8.5,12,8.5 s3.6,0.7,5.7,2.8l1.4-1.4C16.7,7.5,14.4,6.5,12,6.5S7.3,7.5,4.9,9.9z M7.8,12.8l1.4,1.4c0.8-0.8,1.7-1.2,2.8-1.2s2,0.4,2.8,1.2l1.4-1.4 C14.9,11.3,13.5,10.5,12,10.5S9.1,11.3,7.8,12.8z"/></svg>
        </button>
      </div>
      <div id="formulario-dinamico"></div>
      <button id="btn-gerar">Gerar QR Code</button>
      <div id="qrcode"></div>
    </div>
  `;

  document.body.appendChild(modal);
  setTimeout(() => modal.classList.add("ativo"), 50);

  const tipoBtns = modal.querySelectorAll(".qr-type-btn");
  let tipoSelecionado = "url";
  atualizarFormulario(tipoSelecionado);

  tipoBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      tipoSelecionado = btn.dataset.type;
      tipoBtns.forEach(b => b.classList.remove("ativo"));
      btn.classList.add("ativo");
      atualizarFormulario(tipoSelecionado);
    });
  });

  modal.querySelector("#btn-gerar").addEventListener("click", () => {
    generateQRCode(tipoSelecionado);
  });
}


function atualizarFormulario(tipo) {
  const container = document.getElementById("formulario-dinamico");
  container.innerHTML = "";

  if (tipo === "url") {
    container.innerHTML = `<input type="text" id="qr-input" placeholder="Digite a URL">`;
  } else if (tipo === "wifi") {
    container.innerHTML = `
      <input type="text" id="ssid" placeholder="Nome da rede (SSID)">
      <input type="password" id="password" placeholder="Senha da rede">
    `;
  }
} 

function generateQRCode(tipo) {
  let valor = "";
  if (tipo === "url") {
    valor = document.getElementById("qr-input").value.trim();
    if (!valor) return alert("Por favor, insira uma URL.");
  } else if (tipo === "wifi") {
    const ssid = document.getElementById("ssid").value.trim();
    const senha = document.getElementById("password").value.trim();
    if (!ssid || !senha) return alert("Preencha o nome da rede e a senha.");
    valor = `WIFI:S:${ssid};T:WPA;P:${senha};;`;
  }

  const qrContainer = document.getElementById("qrcode");
  qrContainer.innerHTML = "";

  const qr = new QRious({ value: valor, size: 200 });
  qrContainer.appendChild(qr.image);
  qrContainer.style.opacity = 0;

  setTimeout(() => {
    qrContainer.style.opacity = 1;
    qrContainer.style.transition = "opacity 0.5s ease-in-out";
  }, 50);

  const msg = document.createElement("p");
  msg.innerText = "QR Code gerado com sucesso!";
  msg.style.color = "#CD533B";
  msg.style.fontWeight = "600";
  msg.style.marginTop = "15px";
  msg.style.fontFamily = "Poppins, sans-serif";
  qrContainer.appendChild(msg);

  downloadPDF(valor);
}

function downloadPDF(valor) {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();

  const pageWidth = pdf.internal.pageSize.getWidth();
  const qrSize = 175;
  const x = (pageWidth - qrSize) / 2;
  const y = 40;

  pdf.setFontSize(20);

  const qr = qrcode(0, 'H');
  qr.addData(valor);
  qr.make();

  const cellSize = qrSize / qr.getModuleCount();
  for (let row = 0; row < qr.getModuleCount(); row++) {
    for (let col = 0; col < qr.getModuleCount(); col++) {
      if (qr.isDark(row, col)) {
        pdf.rect(x + col * cellSize, y + row * cellSize, cellSize, cellSize, 'F');
      }
    }
  }

  pdf.setFontSize(12);
  pdf.text(valor, pageWidth / 2, y + qrSize + 10, { align: "center" });

  pdf.save("qr_code.pdf");
}
