import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

const ChatRoomPage = () => {
  const [message, setMessage] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [roomName, setRoomName] = useState("Global");
  const chatBoxRef = useRef(null);
  const navigate = useNavigate();
  const username = sessionStorage.getItem("username");

  useEffect(() => {
    if (!username) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/messages")
      .then((res) => {
        const filtered = res.data.filter((msg) => msg.chatRoom === roomName);
        setChatMessages(filtered);
      });

    socket.on("receiveMessage", (msg) => {
      if (msg.chatRoom === roomName) {
        setChatMessages((prev) => [...prev, msg]);
      }
    });

    socket.on("updateOnlineUsers", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("receiveMessage");
      socket.off("updateOnlineUsers");
    };
  }, [username, navigate, roomName]);

  useEffect(() => {
    if (!username) return;
    socket.emit("joinRoom", { room: roomName, username });
  }, [roomName, username]);

  useEffect(() => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgObj = {
      user: username,
      text: message,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      chatRoom: roomName,
    };

    socket.emit("sendMessage", { room: roomName, message: msgObj });
    setMessage("");
  };

  const handleLogout = async () => {
    socket.emit("logout", username);
    await axios.post("http://localhost:5000/api/auth/logout", { username });
    sessionStorage.removeItem("username");
    navigate("/");
  };

  return (
    <div className="container py-4">
      <div className="row">
        {/* Chat Section */}
        <div className="col-md-9">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0">Room: {roomName}</h5>
              </div>
              <div className="d-flex align-items-center">
                <select
                  className="form-select me-3"
                  style={{ width: "150px" }}
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                >
                  {["Global", "Tech", "Fun", "Random"].map((room) => (
                    <option key={room} value={room}>
                      {room}
                    </option>
                  ))}
                </select>
                <button className="btn btn-danger btn-sm" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>

            <div className="card-body" style={{ height: "60vh", overflowY: "auto", backgroundColor: "#f0f2f5" }}>
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`mb-2 ${msg.user === username ? "text-end" : "text-start"}`}>
                  <div className={`d-inline-block p-2 rounded ${msg.user === username ? "bg-success text-white" : "bg-light"}`}>
                    <strong>{msg.user}</strong>: {msg.text}
                    <div style={{ fontSize: "0.7rem" }}>{msg.time}</div>
                  </div>
                </div>
              ))}
              <div ref={chatBoxRef} />
            </div>

            <div className="card-footer d-flex">
              <input
                className="form-control me-2"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button className="btn btn-primary" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar Online Users */}
        <div className="col-md-3">
          <div className="card bg-light shadow-sm">
            <div className="card-header bg-secondary text-white">Online Users</div>
            <ul className="list-group list-group-flush">
              {onlineUsers.map((user, index) => (
                <li
                  key={index}
                  className={`list-group-item ${user === username ? "fw-bold text-success" : ""}`}
                >
                  {user}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomPage;
