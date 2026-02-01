// Fake Google username
document.getElementById("userName").innerText = "Shivada";

// Kick bağlama simülasyonu
document.getElementById("kickBtn").onclick = () => {
  document.getElementById("loginScreen").classList.add("hidden");
  document.getElementById("gameScreen").classList.remove("hidden");
};

// Canvas çizim sistemi
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 700;
canvas.height = 450;

let drawing = false;
let color = "black";
let size = 4;
let opacity = 1;

function setColor(c) { color = c; }
function setSize(s) { size = s; }
function setOpacity(o) { opacity = o; }

canvas.addEventListener("mousedown", () => drawing = true);
canvas.addEventListener("mouseup", () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener("mousemove", draw);

function draw(e) {
  if (!drawing) return;

  ctx.lineWidth = size;
  ctx.lineCap = "round";
  ctx.strokeStyle = color;
  ctx.globalAlpha = opacity;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
