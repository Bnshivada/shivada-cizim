// Kick login simülasyonu
document.getElementById("kickBtn").onclick = () => {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
};

// Rastgele kelime sistemi
const words = ["pasta", "karpuz", "araba", "kedi", "telefon", "uçak", "pizza", "gitar"];
document.getElementById("word").innerText = words[Math.floor(Math.random() * words.length)];

// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 900;   // daha büyük çizim alanı
canvas.height = 550;

let drawing = false;
let color = "#000";
let size = 5;
let opacity = 1;
let tool = "pen";
let history = [];

// Renk seçici
document.getElementById("colorPicker").addEventListener("input", (e) => {
  color = e.target.value;
});

function setColor(c) { color = c; }
function setSize(s) { size = s; }
function setOpacity(o) { opacity = o; }
function setTool(t) { tool = t; }

canvas.addEventListener("mousedown", () => {
  drawing = true;
  history.push(canvas.toDataURL());
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});

canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.globalAlpha = opacity;

  if (tool === "eraser") {
    ctx.strokeStyle = "white";
  } else {
    ctx.strokeStyle = color;
  }

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function undo() {
  if (history.length === 0) return;
  const img = new Image();
  img.src
