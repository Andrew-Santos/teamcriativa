window.addEventListener("load", () => {
    setTimeout(() => {
        document.getElementById("splash").style.display = "none";
        document.querySelector(".content").style.display = "block";
    }, 2000);
});

let loadedImage;
let selectedFrame = '';
let selectedFrameSize = '1920'; // Tamanho padrão inicial
let offsetX = 0, offsetY = 0;
let scale = 1;
let isDragging = false;
let lastMouseX, lastMouseY;
let lastTouchDistance = 0;
let lastTouchX, lastTouchY; // Para rastrear a posição do toque

function selectFrame(frame, size) {
    selectedFrame = frame;
    selectedFrameSize = size; // Atualiza o tamanho baseado na moldura selecionada
    const frames = document.querySelectorAll('.frame');
    frames.forEach(img => img.classList.remove('selected'));
    const selectedElement = document.querySelector(`img[src="${frame}"]`);
    if (selectedElement) selectedElement.classList.add('selected');
    
    // Atualiza o tamanho do canvas para 1080x1350 se a moldura for 1350
    const canvas = document.getElementById('canvas');
    if (size === '1350') {
        canvas.width = 1080;
        canvas.height = 1350;
    } else {
        canvas.width = 1080;
        canvas.height = 1920;
    }

    drawImage();
}

function loadPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            loadedImage = new Image();
            loadedImage.src = e.target.result;
            loadedImage.onload = drawImage;
        }
        reader.readAsDataURL(file);
    }
}

function drawImage() {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha a imagem carregada se existir
    if (loadedImage) {
// Calcular largura e altura da imagem redimensionada
const imgWidth = loadedImage.width * scale;
const imgHeight = loadedImage.height * scale;

// Verifica se a imagem redimensionada está menor que o canvas
if (imgWidth < canvas.width) {
    scale = canvas.width / loadedImage.width; // Ajusta a escala para preencher a largura do canvas
}
if (imgHeight < canvas.height) {
    scale = canvas.height / loadedImage.height; // Ajusta a escala para preencher a altura do canvas
}

// Recalcula a largura e altura da imagem após os ajustes
const adjustedImgWidth = loadedImage.width * scale;
const adjustedImgHeight = loadedImage.height * scale;

// Centraliza a imagem no canvas
const x = (canvas.width / 2) - (adjustedImgWidth / 2) + offsetX;
const y = (canvas.height / 2) - (adjustedImgHeight / 2) + offsetY;

// Desenha a imagem no canvas
ctx.drawImage(loadedImage, x, y, adjustedImgWidth, adjustedImgHeight);

// Desenha a moldura selecionada
const frameImage = new Image();
frameImage.src = selectedFrame;
frameImage.onload = () => {
    ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
};
}

// Desenha a moldura selecionada se existir
    if (selectedFrame) {
        const frameImage = new Image();
        frameImage.src = selectedFrame;
        frameImage.onload = () => {
            ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);
        };
}
}

function sharePhoto() {
    const canvas = document.getElementById('canvas');
    canvas.toBlob(function(blob) {
        const file = new File([blob], "my-photo.png", { type: "image/png" });
        
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            navigator.share({
                files: [file],
                title: 'Minha Foto',
                text: 'Dê uma olhada nesta foto que criei!',
            })
            .then(() => console.log('Compartilhado com sucesso!'))
            .catch((error) => console.error('Erro ao compartilhar', error));
        } else {
            alert('Compartilhamento não suportado neste dispositivo.');
        }
    }, 'image/png');
}


// Funções para manipulação do mouse
canvas.addEventListener('mousedown', function(e) {
    isDragging = true;
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
});

canvas.addEventListener('mouseup', function() {
    isDragging = false;
});

canvas.addEventListener('mousemove', function(e) {
    if (isDragging) {
        const dx = e.clientX - lastMouseX;
        const dy = e.clientY - lastMouseY;
        offsetX += dx;
        offsetY += dy;
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
        drawImage();
    }
});

// Funções para manipulação de toque (pinça do dedo)
canvas.addEventListener('touchstart', function(e) {
    if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
    } else if (e.touches.length === 1) { // Inicia o arraste
        isDragging = true;
        lastTouchX = e.touches[0].clientX;
        lastTouchY = e.touches[0].clientY;
    }
});

canvas.addEventListener('touchmove', function(e) {
    if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const newTouchDistance = Math.sqrt(dx * dx + dy * dy);
        scale *= newTouchDistance / lastTouchDistance; // Atualiza a escala com base na distância
        lastTouchDistance = newTouchDistance;
        drawImage();
    } else if (e.touches.length === 1 && isDragging) { // Movimento com um único toque
        const touchX = e.touches[0].clientX;
        const touchY = e.touches[0].clientY;
        const dx = touchX - lastTouchX;
        const dy = touchY - lastTouchY;
        offsetX += dx; // Ajuste na posição horizontal
        offsetY += dy; // Ajuste na posição vertical
        lastTouchX = touchX; // Atualiza a posição do toque
        lastTouchY = touchY; // Atualiza a posição do toque
        drawImage();
    }
    e.preventDefault(); // Previne o comportamento padrão de rolagem da página
});

canvas.addEventListener('touchend', function(e) {
    if (e.touches.length < 2) {
        lastTouchDistance = 0; // Reseta a distância ao soltar os dedos
        isDragging = false; // Para o arraste
    }
});