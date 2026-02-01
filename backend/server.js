const WebSocket = require("ws");
const express = require("express");

const app = express();
app.use(express.json());

let codes = {}; // { code: username }
let currentWord = "pasta";

// Kick chat websocket (Kick internal)
const ws = new WebSocket("wss://chatroom.kick.com/socket.io/?EIO=4&transport=websocket");

ws.on("open", () => {
  console.log("Kick chat dinleniyor...");
});

ws.on("message", (data) => {
  const msg = data.toString();

  // mesaj içeriği
  const contentMatch = msg.match(/"content":"(.*?)"/);
  const userMatch = msg.match(/"username":"(.*?)"/);

  if (!contentMatch || !userMatch) return;

  const content = contentMatch[1].toLowerCase();
  const username = userMatch[1];

  // EŞLEŞTİRME
  const codeMatch = content.match(/!eşle\s+([A-Z0-9]{6})/i);
  if (codeMatch) {
    const code = codeMatch[1];
    codes[code] = username;
    console.log(`EŞLEŞTİ: ${code} -> ${username}`);
  }

  // TAHMİN SİSTEMİ
  if (content === currentWord) {
    console.log(`DOĞRU TAHMİN: ${username}`);
  }
});

// Frontend API
app.post("/check-code", (req, res) => {
  const { code } = req.body;
  res.json({ user: codes[code] || null });
});

app.listen(3000, () => console.log("Backend hazır :3000"));
