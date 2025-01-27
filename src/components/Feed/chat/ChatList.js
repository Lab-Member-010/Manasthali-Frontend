import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import './ChatList.css'; // Assuming you have a separate CSS file

const MessageComponent = () => {
  const [dmList, setDmList] = useState([]); // DM list state
  const [messages, setMessages] = useState([]); // Messages for selected user
  const [message, setMessage] = useState(''); // Message input
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const socket = useRef(null); // For socket.io reference

  // Fetch DM list (combined followers and following)
  useEffect(() => {
    const fetchDMList = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/dmlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDmList(response.data); // Set DM list from API response
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch DM list');
      } finally {
        setLoading(false);
      }
    };
    fetchDMList();
  }, [userId, token]);

  // Setup Socket.IO connection
  useEffect(() => {
    socket.current = io('http://localhost:3001'); // Ensure this matches your server's socket URL
    socket.current.emit('join', userId); // Join the socket room (with userId)

    // Listen for new messages from other users
    socket.current.on('new_message', (newMessage) => {
      if (selectedUser && (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id)) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    // Cleanup socket connection on unmount
    return () => {
      socket.current.disconnect();
    };
  }, [userId, selectedUser]);

  // Fetch messages for the selected user
  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/message/${selectedUser._id}`, {
            headers: { Authorization: `Bearer ${token}`},
          });
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, token]);

  // Handle selecting a user for chat
  const handleSelectUser = (user) => {
    setSelectedUser(user); // Set selected user
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) {
      alert('Please select a user and enter a message.');
      return;
    }

    try {
      // Send the message to the server
      const response = await axios.post('http://localhost:3001/message/send', {
        receiverId: selectedUser._id, // Ensure you're using _id instead of id
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Emit the message via socket after it's stored in DB
      socket.current.emit('send_message', response.data.newMessage);

      // Add the message to the local state for immediate UI update
      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.newMessage,
      ]);
      setMessage(''); // Clear the message input
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Mark a message as read
  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await axios.post('http://localhost:3001/message/read', {
        messageId,
      }, {
        headers: { Authorization:` Bearer ${token}` },
      });

      // Update the message in the state as read
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );

      console.log(response.data.message); // Log success
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Chats</h2>
        </div>
        <div className="user-list">
          {dmList.map((user) => (
            <div
              className="user-item"
              key={user._id}
              onClick={() => handleSelectUser(user)} // Set selected user on click
            >
              <img
                src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : '/user.png'}
                alt={"../../"}
                className="user-img"
              />
              <div className="user-info">
                <p className="username">{user.username}</p>
                <p className="last-message">Last message preview...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-panel">
        {selectedUser ? (
          <div className="chat-box">
            <div className="chat-header">
              <img
                src={selectedUser.profile_picture ? `http://localhost:3001/${selectedUser.profile_picture}` : '/user.png'}
                alt={selectedUser.username}
                className="chat-user-img"
              />
              <h3>{selectedUser.username}</h3>
            </div>
            <div className="chat-body">
              {messages.length === 0 ? (
                <p>No messages yet. Start the conversation!</p>
              ) : (
                <div className="message-list">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message ${msg.sender === userId ? 'sent' : 'received'} ${msg.read ? 'read' : 'unread'}`}
                      onClick={() => !msg.read && handleMarkAsRead(msg._id)}
                    >
                      <p>{msg.message}</p>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="newMessage">
              <textarea
                value={message}
                onChange={handleMessageChange} // Handle message input change
                placeholder="Type your message..."
              />
              <button className="sentbutton" onClick={handleSendMessage}>Send</button>
            </div>
          </div>
        ) : (
          <div className="no-chat-selected">
            <p>Please select a user to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageComponent;