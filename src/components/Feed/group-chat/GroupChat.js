import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import './GroupChat.css'; // Assuming you have a separate CSS file

const GroupChat = () => {
  const [groupList, setGroupList] = useState([]); // Group list state
  const [messages, setMessages] = useState([]); // Messages for the selected group
  const [message, setMessage] = useState(''); // Message input
  const [selectedGroup, setSelectedGroup] = useState(null); // Selected group for chat
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const socket = useRef(null); // For socket.io reference

  // Fetch Group list
  useEffect(() => {
    const fetchGroupList = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/groups/view`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupList(response.data); // Set group list from API response
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroupList();
  }, [userId, token]);

  // Setup Socket.IO connection for group chat
  useEffect(() => {
    if (userId) {
      socket.current = io('http://localhost:3001'); // Ensure this matches your server's socket URL
      socket.current.emit('join_group', userId); // Join the socket room for user

      // Listen for new messages in the selected group
      socket.current.on('new_group_message', (newMessage) => {
        if (selectedGroup && newMessage.groupId === selectedGroup._id) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      });

      // Cleanup socket connection on unmount
      return () => {
        socket.current.disconnect();
      };
    }
  }, [userId, selectedGroup]);

  // Fetch messages for the selected group
  useEffect(() => {
    if (selectedGroup) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`http://localhost:3001/groupchat/${selectedGroup._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Error fetching group messages:", err);
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
      const response = await axios.post('http://localhost:3001/groupchat/send', {
        groupId: selectedGroup._id, // Ensure you're using _id
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Emit the message via socket after it's stored in DB
      socket.current.emit('send_group_message', response.data.newMessage);

      // Add the message to the local state for immediate UI update
      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.newMessage,
      ]);
      setMessage(''); // Clear the message input
    } catch (err) {
      console.error('Error sending group message:', err);
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
          <h2>Groups</h2>
        </div>
        <div className="group-list">
          {groupList.map((group) => (
            <div
              className="group-item"
              key={group._id}
              onClick={() => handleSelectGroup(group)} // Set selected group on click
            >
              <img
                src={group.groupImage ? `http://localhost:3001/${group.groupImage}` : '/user.png'}
                alt={group.groupName}
                className="group-img"
              />
              <div className="group-info">
                <p className="group-name">{group.groupName}</p>
                <p className="last-message">Last message preview...</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="chat-panel">
        {selectedGroup ? (
          <div className="chat-box">
            <div className="chat-header">
              <img
                src={selectedGroup.groupImage ? `http://localhost:3001/${selectedGroup.groupImage}` : '/user.png'}
                alt={selectedGroup.groupName}
                className="chat-group-img"
              />
              <h3>{selectedGroup.groupName}</h3>
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
            <p>Please select a group to start chatting.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupChat;
