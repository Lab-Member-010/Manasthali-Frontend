import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Api from '../../../apis/Api';
import { useSelector } from 'react-redux';
import './GroupChat.css'; 

const GroupChat=()=>{
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [currentGroup, setCurrentGroup] = useState(null);
    const { user } = useSelector((state) => state.user);
  
    useEffect(() => {
      const newSocket = io(Api.SERVER_URL);
  
      newSocket.on('connect', () => {
        console.log('Connected to server');
      });
  
      newSocket.on('disconnect', () => {
        console.log('Disconnected from server');
      });
  
      newSocket.on('receive-group-message', (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });
  
      setSocket(newSocket);
  
      return () => {
        newSocket.disconnect();
      };
    }, []);
  
    useEffect(() => {
      if (currentGroup && socket) {
        socket.emit('join-group', currentGroup);
      }
    }, [currentGroup, socket]);
  
    const sendMessage = (message) => {
      if (socket) {
        socket.emit('send-group-message', {
          sender: user._id,
          group: currentGroup,
          message,
        });
      }
    };

    return (
      <div className="chat-container">
        <div className="chat-messages">
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg.message}</li>
            ))}
          </ul>
        </div>
  
        <div className="chat-input">
          <input
            type="text"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                sendMessage(e.target.value);
                e.target.value = '';
              }
            }}
          />
          <button
            onClick={() => {
              const inputElement = document.querySelector('.chat-input input');
              if (inputElement.value) {
                sendMessage(inputElement.value);
                inputElement.value = '';
              }
            }}
          >
            Send
          </button>
        </div>
      </div>
    );
  };
  
  export default GroupChat;