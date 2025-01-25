import React, { useState, useEffect } from 'react';
import axios from 'axios';

const MessageComponent = ({ receiverId }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch messages on component mount or when receiverId changes
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${receiverId}`);
        setMessages(response.data.messages);
      } catch (err) {
        setError(err.response?.data?.error || 'Error fetching messages');
      }
    };
    

    fetchMessages();
  }, [receiverId]);

  // Handle sending a new message
  const handleSendMessage = async () => {
    try {
      if (!newMessage.trim()) {
        setError('Message cannot be empty');
        return;
      }

      const response = await axios.post('/api/messages/send', {
        receiverId,
        message: newMessage,
      });

      setMessages([...messages, response.data.newMessage]);
      setNewMessage('');
      setSuccess('Message sent successfully');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending message');
    }
  };

  // Handle marking a message as read
  const handleMarkAsRead = async (messageId) => {
    try {
      await axios.put('/api/messages/mark-as-read', { messageId });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
      setSuccess('Message marked as read');
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Error marking message as read');
    }
  };

  return (
    <div className="message-component">
      <h2>Messages</h2>

      {/* Display success or error message */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}

      {/* Message list */}
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg._id} className={`message ${msg.read ? 'read' : 'unread'}`}>
            <p><strong>{msg.sender === receiverId ? 'Them' : 'You'}:</strong> {msg.message}</p>
            <p><em>{new Date(msg.createdAt).toLocaleString()}</em></p> 
            {!msg.read && msg.sender !== receiverId && (
              <button onClick={() => handleMarkAsRead(msg._id)}>Mark as Read</button>
            )}
          </div>
        ))}
      </div>

      {/* Send new message */}
      <div className="new-message">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message here"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default MessageComponent;