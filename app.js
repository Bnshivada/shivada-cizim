/********************
  RANDOM CODE (backend’den)
*********************/
let currentCode = null;
let linkedUser = null;

// backend’den kod al
async function getCode() {
  const res = await fetch("http://localhost:3000/api/code");
  const data = await res.json();
  currentCode = data.code;

  document.getElementById("codeBox").innerText = currentCode;
}

getCode();

/********************
  KELİME SİSTEMİ
*********************/
const words = ["pasta","karpuz","araba","kedi","telefon","uçak","pizza"];

const currentWord = words[Math.floor(Math.random() * words.length)];
document.getElementById("word").innerText = currentWord;

// kelimeyi backend’e gönder
async function sendWord(word) {
  await fetch("http://localhost:3000/api/word", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ word })
  });
}

sendWord(currentWord);

/********************
  KICK EŞLEŞME KONTROLÜ
*********************/
async function checkRoom() {
  if (!currentCode) return;

  const res = await fetch(`http://localhost:3000/api/room/${currentCode}`);
  const data = await res.json();

  if (data.username && data.username !== linkedUser) {
    linkedUser = data.username;

    // login ekranını kapat, oyunu aç
    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");

    // chat iframe değiştir
    document.getElementById("chatFrame").src =
      `https://kick.com/${linkedUser}/chatroom`;

    console.log("✅ Kick hesabı bağlandı:", linkedUser);
  }

  setTimeout(checkRoom, 2000);
}

checkRoom();

/********************
  CANVAS (ÇİZİM SİSTEMİ)
*********************/
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// responsive canvas
function resizeCanvas() {
  canvas.width = 1200;
  canvas.height = 700;
}
resizeCanvas();

let drawing = false;
let color = "#000000";
let size = 6;
let opacity = 1;
let tool = "pen";
let history = [];

// renk seçici
document.getElementById("colorPicker").addEventListener("input", e => {
  color = e.target.value;
});

function setTool(t) { tool = t; }
function setSize(s) { size = s; }
function setOpacity(o) { opacity = o; }

// mouse events
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

  ctx.strokeStyle = (tool === "eraser") ? "white" : color;

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

// temizle
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// geri al
function undo() {
  if (!history.length) return;
  const img = new Image();
  img.src = history.pop();
  img.onload = () => ctx.drawImage(img, 0, 0);
}
