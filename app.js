
// RANDOM KOD
function generateCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  return Array.from({length:6}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
}

const myCode = generateCode();
document.getElementById("codeBox").innerText = myCode;
document.getElementById("codeBox2").innerText = myCode;

// Kelime
const words = ["pasta","karpuz","araba","kedi","telefon","uçak","pizza"];
document.getElementById("word").innerText = words[Math.floor(Math.random()*words.length)];

// Backend'e kod sor
let linkedUser = null;

setInterval(async () => {
  const res = await fetch("http://localhost:3000/check-code", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({code: myCode})
  });

  const data = await res.json();

  if (data.user && data.user !== linkedUser) {
    linkedUser = data.user;

    document.getElementById("loginScreen").classList.add("hidden");
    document.getElementById("gameScreen").classList.remove("hidden");

    document.getElementById("chatFrame").src =
      `https://kick.com/${linkedUser}/chatroom`;
  }
}, 2000);

// CANVAS
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1200;
canvas.height = 700;

let drawing=false, color="#000", size=6, opacity=1, tool="pen", history=[];

document.getElementById("colorPicker").addEventListener("input", e => color=e.target.value);

function setTool(t){tool=t;}
function setSize(s){size=s;}
function setOpacity(o){opacity=o;}

canvas.addEventListener("mousedown", ()=>{drawing=true; history.push(canvas.toDataURL());});
canvas.addEventListener("mouseup", ()=>{drawing=false; ctx.beginPath();});
canvas.addEventListener("mousemove", draw);

function draw(e){
  if(!drawing)return;
  ctx.lineWidth=size;
  ctx.lineCap="round";
  ctx.globalAlpha=opacity;
  ctx.strokeStyle=(tool==="eraser"?"white":color);
  ctx.lineTo(e.offsetX,e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX,e.offsetY);
}

function clearCanvas(){ctx.clearRect(0,0,canvas.width,canvas.height);}
function undo(){
  if(!history.length)return;
  const img=new Image();
  img.src=history.pop();
  img.onload=()=>ctx.drawImage(img,0,0);
}
