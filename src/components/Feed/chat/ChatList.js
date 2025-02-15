import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client'; 
import './ChatList.css';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import Api from '../../../apis/Api';

const MessageComponent = () => {
  const [dmList, setDmList] = useState([]); 
  const [messages, setMessages] = useState([]); 
  const [message, setMessage] = useState(''); 
  const [selectedUser, setSelectedUser] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false); 
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const socket = useRef(null); 

  useEffect(() => {
    const fetchDMList = async () => {
      try {
        const response = await axios.get(`${Api.SERVER_URL}/users/dmlist/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setDmList(response.data); 
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch DM list');
      } finally {
        setLoading(false);
      }
    };
    fetchDMList();
  }, [userId, token]);

  useEffect(() => {
    socket.current = io(Api.SERVER_URL);
    socket.current.emit('join', userId); 

    socket.current.on('new_message', (newMessage) => {
      if (selectedUser && (newMessage.sender === selectedUser._id || newMessage.receiver === selectedUser._id)) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId, selectedUser]);

  useEffect(() => {
    if (selectedUser) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`${Api.SERVER_URL}/message/${selectedUser._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [selectedUser, token]);

  const handleSelectUser = (user) => {
    setSelectedUser(user); 
  };

  const handleSendMessage = async () => {
    if (!selectedUser || !message.trim()) {
      alert('Please select a user and enter a message.');
      return;
    }

    try {
      const response = await axios.post(Api.SEND_MESSAGE, {
        receiverId: selectedUser._id,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.current.emit('send_message', response.data.newMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        response.data.newMessage,
      ]);
      setMessage(''); 
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await axios.post(Api.READ_MESSAGE, {
        messageId,
      }, {
        headers: { Authorization:` Bearer ${token}` },
      });

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId ? { ...msg, read: true } : msg
        )
      );
      console.log(response.data.message); 
    } catch (err) {
      console.error("Error marking message as read:", err);
    }
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleEmojiClick = (emojiData) => {
    setMessage((prevMessage) => prevMessage + emojiData.emoji); 
    setEmojiPickerVisible(false); 
  };

  const toggleEmojiPicker = () => {
    setEmojiPickerVisible((prev) => !prev);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="chat-container">
      <div className="sidebar">
        <div className="sidebar-wrapper">
          <div className="sidebar-header">
            <h2>Chats</h2>
          </div>

          <div className="user-list">
            {dmList.map((user) => (
              <div
                className="user-item"
                key={user._id}
                onClick={() => handleSelectUser(user)} 
              >
                <img
                  src={user.profile_picture ? `${user.profile_picture}` : '/user.png'}
                  alt="user"
                  className="user-img"
                />
                <div className="user-info">
                  <p className="username">{user.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="chat-panel">
        {selectedUser ? (
          <div className="chat-box">
            <div className="chat-header">
              <img style={{width:"70px", height:"70px"}}
                src={selectedUser.profile_picture ? `${selectedUser.profile_picture}` : '/user.png' }
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
                      <p>{msg.message}</p><br/>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="newMessage">
              {/* Emoji Button */}
              <button className="emoji-button" onClick={toggleEmojiPicker}>
                <EmojiEmotionsOutlinedIcon/>
              </button>

              {/* Message Textarea */}
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="textArea"
              />
              
              {/* Emoji Picker */}
              {emojiPickerVisible && (
                <div className="emoji-picker-container">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              {/* Send Button */}
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
