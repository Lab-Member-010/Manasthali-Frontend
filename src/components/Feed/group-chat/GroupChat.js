import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import EmojiPicker from 'emoji-picker-react';
import io from 'socket.io-client'; 
import './GroupChat.module.css';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import Api from '../../../apis/Api';

const GroupChat = () => {
  const [groupList, setGroupList] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const socket = useRef(null);

  useEffect(() => {
    const fetchGroupList = async () => {
      try {
        const response = await axios.get(`https://manasthali-backend.onrender.com/groups`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setGroupList(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };
    fetchGroupList();
  }, [token]);

  useEffect(() => {
    socket.current = io(Api.SERVER_URL);
    if (selectedGroup) {
      socket.current.emit('join_group', selectedGroup._id);
    }

    socket.current.on('new_group_message', (newMessage) => {
      if (selectedGroup && newMessage.groupId === selectedGroup._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    return () => {
      socket.current.disconnect();
    };
  }, [selectedGroup]);

  useEffect(() => {
    if (selectedGroup) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get(`https://manasthali-backend.onrender.com/messages/${selectedGroup._id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setMessages(response.data.messages);
        } catch (err) {
          console.error("Error fetching messages:", err);
        }
      };
      fetchMessages();
    }
  }, [selectedGroup, token]);

  const handleSelectGroup = (group) => {
    setSelectedGroup(group);
  };

  const handleSendMessage = async () => {
    if (!selectedGroup || !message.trim()) {
      alert('Please select a group and enter a message.');
      return;
    }

    try {
      const response = await axios.post('https://manasthali-backend.onrender.com/messages/send', {
        groupId: selectedGroup._id,
        message,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      socket.current.emit('send_group_message', response.data.newMessage);
      setMessages((prevMessages) => [...prevMessages, response.data.newMessage]);
      setMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
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
            <h2>Groups</h2>
          </div>
          <div className="group-list">
            {groupList.map((group) => (
              <div
                className="group-item"
                key={group._id}
                onClick={() => handleSelectGroup(group)}
              >
                <p className="group-name">{group.name}</p>
              </div>
            ))}
          </div>
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
                    <div key={msg._id} className={`message ${msg.sender === userId ? 'sent' : 'received'}`}>
                      <p>{msg.message}</p>
                      <span>{new Date(msg.createdAt).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="newMessage">
              <button className="emoji-button" onClick={toggleEmojiPicker}>
                <EmojiEmotionsOutlinedIcon/>
              </button>
              <textarea
                value={message}
                onChange={handleMessageChange}
                placeholder="Type your message..."
                className="textArea"
              />
              {emojiPickerVisible && (
                <div className="emoji-picker-container">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
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
