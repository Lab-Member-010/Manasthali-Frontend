// ChatApp.js
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

// Connect to the backend server (replace with your actual backend URL if different)
const socket = io("http://localhost:3001");

const ChatApp = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(""); 

  useEffect(() => {
    socket.on("receive-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data.message]);
    });

    return () => {
      socket.off("receive-message");
    };
  }, []);

  const handleSendMessage = () => {
    if (message.trim() === "") return;

    // Emit the message to the backend with the receiverId
    socket.emit("send-message", { receiverId, message });

    // Optionally update the UI immediately after sending the message
    setMessages((prevMessages) => [...prevMessages, message]);

    // Clear the message input
    setMessage("");
  };

  return (
    <div>
      <h1>Real-Time Chat</h1>
      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
      <div>
        <h2>Messages</h2>
        {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
    </div>
  );
};

export default ChatApp;
 