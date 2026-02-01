const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const FILE = "./rooms.json";
let rooms = fs.existsSync(FILE) ? JSON.parse(fs.readFileSync(FILE)) : {};

// aktif kelime (oyundan gelecek)
let currentWord = "pasta";

// kayıt
function saveRooms() {
  fs.writeFileSync(FILE, JSON.stringify(rooms, null, 2));
}

// API - kod üret
app.get("/api/code", (req, res) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }

  rooms[code] = { username: null, guessedBy: [] };
  saveRooms();

  res.json({ code });
});

// API - oda bilgisi
app.get("/api/room/:code", (req, res) => {
  const room = rooms[req.params.code];
  if (!room) return res.status(404).json({ error: "Kod yok" });
  res.json(room);
});

// API - kelime güncelle (frontend çağırır)
app.post("/api/word", (req, res) => {
  currentWord = req.body.word.toLowerCase();
  console.log("🎯 Yeni kelime:", currentWord);
  res.json({ ok: true });
});

app.listen(3000, () => console.log("✅ Backend başladı: http://localhost:3000"));

/* ============================
   KICK CHAT BOT
============================ */

// Kick websocket
const ws = new WebSocket("wss://chatroom.kick.com/socket.io/?EIO=4&transport=websocket");

ws.on("open", () => {
  console.log("🤖 Kick bot bağlandı");
});

ws.on("message", (data) => {
  const msg = data.toString();

  // mesaj içeriği
  const contentMatch = msg.match(/"content":"(.*?)"/);
  const userMatch = msg.match(/"username":"(.*?)"/);

  if (!contentMatch || !userMatch) return;

  const content = contentMatch[1].toLowerCase();
  const username = userMatch[1];

  /* ============================
     1) !eşle SİSTEMİ
  ============================ */

  const match = content.match(/!eşle\s+([a-z0-9]{6})/i);
  if (match) {
    const code = match[1].toUpperCase();

    if (rooms[code]) {
      rooms[code].username = username;
      saveRooms();
      console.log(`🔗 EŞLEŞTİ: ${code} -> ${username}`);
    }
  }

  /* ============================
     2) TAHMİN SİSTEMİ
  ============================ */

  if (content === currentWord) {
    console.log(`🎉 DOĞRU TAHMİN: ${username}`);

    // hangi kodda olduğunu bul
    for (const code in rooms) {
      if (rooms[code].username) {
        if (!rooms[code].guessedBy.includes(username)) {
          rooms[code].guessedBy.push(username);
          saveRooms();
          console.log(`⭐ ${username} puan aldı (${code})`);
        }
      }
    }
  }
});
