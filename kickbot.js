import WebSocket from "ws";

const CHANNEL = "aurynis";
const SERVER_URL = "wss://chat.kick.com/socket.io/?EIO=4&transport=websocket";

let currentWord = "pasta"; // backend’den de alabiliriz

const ws = new WebSocket(SERVER_URL);

ws.on("open", () => {
  console.log("✅ Kick chat bot bağlandı");

  ws.send("40/chat,"); // join chat namespace
  ws.send(`42/chat,["join","${CHANNEL}"]`);
});

ws.on("message", (data) => {
  const msg = data.toString();

  if (!msg.startsWith("42/chat")) return;

  try {
    const json = JSON.parse(msg.replace("42/chat,", ""));
    const payload = json[1];

    if (payload?.content && payload?.sender?.username) {
      const text = payload.content.toLowerCase();
      const user = payload.sender.username;

      console.log(`💬 ${user}: ${text}`);

      if (text === currentWord.toLowerCase()) {
        console.log("🎉 KELİME BULUNDU:", user);

        // backend’e bildir
        fetch("http://localhost:3000/api/found", {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify({ user })
        });
      }
    }
  } catch (e) {}
});
