const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const messageRoutes = require("./routes/messageRoutes");
const socketIo = require("socket.io");
const Message = require("./models/Message");

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = socketIo(server, {
  cors: { origin: "*" },
});

// 🟢 Maintain online users
const onlineUsers = new Set();

io.on("connection", (socket) => {
  console.log("📡 A client connected");

  socket.on("joinRoom", ({ room, username }) => {
    socket.join(room);
    if (username) {
      onlineUsers.add(username);
      io.emit("updateOnlineUsers", Array.from(onlineUsers)); // broadcast list
    }
  });

  socket.on("sendMessage", async ({ room, message }) => {
    io.to(room).emit("receiveMessage", message);
    await Message.create(message);
  });

  socket.on("logout", (username) => {
    if (username) {
      onlineUsers.delete(username);
      io.emit("updateOnlineUsers", Array.from(onlineUsers));
    }
  });
  socket.on("typing", ({ room, username }) => {
  socket.to(room).emit("showTyping", `${username} is typing...`);
});

socket.on("stopTyping", ({ room }) => {
  socket.to(room).emit("showTyping", ``);
});

  socket.on("disconnecting", () => {
    // optional cleanup if needed
  });

  socket.on("disconnect", () => {
    console.log("❌ A client disconnected");
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
