import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import { useSelector } from 'react-redux';
import './GroupChat.css'; 

const GroupChat = ({ groupId }) => {
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useSelector((state) => state.user); // Assuming user data is stored in Redux

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(`http://localhost:3001`); // Use environment variable for URL
    
    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    newSocket.on('receive-group-message', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]); // Add new message to state
    });

    setSocket(newSocket);
    
    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Join the group upon selecting a group
  useEffect(() => {
    if (groupId && socket) {
      socket.emit('join-group', groupId);
    }
  }, [groupId, socket]);

  // Fetch initial messages for the group
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/groupmessages/${groupId}`);
        setMessages(response.data.data); // Set fetched messages
      } catch (err) {
        setError("Couldn't fetch messages");
      }
    };

    if (groupId) {
      fetchMessages();
    }
  }, [groupId]);

  // Handle sending messages
  const handleSendMessage = (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      return;
    }

    if (socket) {
      const newMessage = {
        sender: user._id,
        group: groupId,
        message,
      };
      socket.emit('send-group-message', newMessage); // Emit message to server
      setMessage('');
      setSuccess('Message sent');
    }
  };

  return (
    <div className="chat-container">
      <h2>Group Chat</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <div className="chat-messages">
        <ul>
          {messages.map((msg) => (
            <li key={msg._id}>
              <strong>{msg.sender.name}</strong>: {msg.message}
              <span>{new Date(msg.createdAt).toLocaleTimeString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSendMessage(e);
            }
          }}
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default GroupChat;
