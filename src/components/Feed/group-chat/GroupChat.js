import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import './GroupChat.css'; // Assuming you have a separate CSS file for styling

const GroupChat = () => {
  const [joinedGroups, setJoinedGroups] = useState([]); // List of groups user has joined
  const [messages, setMessages] = useState([]); // Messages for selected group
  const [message, setMessage] = useState(''); // New message input
  const [selectedGroup, setSelectedGroup] = useState(null); // Selected group for chat
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const socket = useRef(null); // For socket.io reference

  // Fetch the list of groups the user has joined
  useEffect(() => {
    const fetchJoinedGroups = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/groups/view/joinedList`, {
          headers: {
            Authorization: `Bearer ${token}`
          },
        });
        setJoinedGroups(response.data); // Set the state with the list of groups
        setLoading(false); // Stop the loading spinner
      } catch (err) {
        setError('Failed to fetch groups. Please try again later.');
        setLoading(false);
      }
    };
    fetchJoinedGroups();
  }, []);

  // Setup Socket.IO for group chat
  useEffect(() => {
    socket.current = io('http://localhost:3001'); // Ensure this matches your server's socket URL
    socket.current.emit('join', userId); // Join the socket room (with userId)

    // Listen for new messages in the group
    socket.current.on('new_group_message', (newMessage) => {
      if (selectedGroup && newMessage.group === selectedGroup._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId, selectedGroup]);

  // Fetch messages for the selected group
  useEffect(() => {
    if (selectedGroup) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/groupchat/${selectedGroup._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(response.data.messages); // Set the messages for the selected group
        } catch (err) {
          console.error('Error fetching messages:', err);
        }
      };
      fetchMessages();
    }
  }, [selectedGroup, token]);

  // Handle selecting a group for chat
  const handleSelectGroup = (group) => {
    setSelectedGroup(group); // Set selected group
  };

  // Handle sending a message
  const handleSendMessage = async () => {
    if (!selectedGroup || !message.trim()) {
      alert('Please select a group and enter a message.');
      return;
    }

    try {
      // Send the message to the server
      const response = await axios.post(
        `http://localhost:3001/groupchat/send`,
        { message },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Emit the message via socket after it's stored in DB
      socket.current.emit('send_group_message', response.data.newMessage);

      // Add the message to the local state for immediate UI update
      setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
      setMessage(''); // Clear the message input
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  // Handle message input change
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="group-chat-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <h2>Your Groups</h2>
        </div>
        <div className="group-list">
          {joinedGroups.map((group) => (
            <div
              className="group-item"
              key={group._id}
              onClick={() => handleSelectGroup(group)} // Set selected group on click
            >
              <h3>{group.name}</h3>
              <p>{group.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-panel">
        {selectedGroup ? (
          <div className="chat-box">
            <div className="chat-header">
              <h3>{selectedGroup.name}</h3>
            </div>
            <div className="chat-body">
              {messages.length === 0 ? (
                <p>No messages yet. Start the conversation!</p>
              ) : (
                <div className="message-list">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`message ${msg.sender === userId ? 'sent' : 'received'}`}
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
              <button className="send-button" onClick={handleSendMessage}>
                Send
              </button>
            </div>
          </div>
        ) : (
          <div className="no-group-selected">
            <p>Please select a group to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
