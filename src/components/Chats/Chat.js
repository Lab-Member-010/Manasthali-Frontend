import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import axios from "axios";

// Initialize socket.io client with the backend URL
const socket = io("http://localhost:3001");

const Chat = ({ user, token }) => {
  const [receiverId, setReceiverId] = useState(""); // Receiver user ID
  const [message, setMessage] = useState(""); // Message content
  const [messages, setMessages] = useState([]); // Chat history

  useEffect(() => {
    // Authenticate the socket connection
    socket.emit("authenticate", { token });

    // Listen for incoming messages
    socket.on("receive-message", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      socket.disconnect(); // Cleanup on component unmount
    };
  }, [token]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3001/messages/${receiverId}`, // Replace with the receiver ID
        {
          headers: { Authorization: token },
        }
      );
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const sendMessage = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/messages/send",
        { receiverId, message },
        { headers: { Authorization: token } }
      );

      const newMessage = response.data.newMessage;
      socket.emit("send-message", { ...newMessage, receiverId });
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      setMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div>
      <h1>Chat</h1>
      <div>
        <label>
          Receiver ID:
          <input
            type="text"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
        </label>
      </div>
      <button onClick={fetchMessages}>Fetch Messages</button>
      <div>
        <h2>Messages</h2>
        <ul>
          {messages.map((msg) => (
            <li key={msg._id}>
              <strong>{msg.sender === user._id ? "You" : "Them"}:</strong> {msg.message}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <textarea
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
