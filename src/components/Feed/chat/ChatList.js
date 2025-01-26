// import React, { useState, useEffect, useRef } from 'react';
// import axios from 'axios';
// import { useSelector } from 'react-redux';
// import io from 'socket.io-client';
// import './Chat.css';

// const MessageComponent = () => {
//   const [dmList, setDmList] = useState([]); // Initialize DM list state
//   const [messages, setMessages] = useState([]);
//   const [message, setMessage] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedUser, setSelectedUser] = useState(null);
//   const userId = useSelector((state) => state.user?.user?._id);
//   const token = useSelector((state) => state.user?.token);
//   const socket = useRef(null); // To hold the socket reference

//   // Fetch DM list (combined followers and following)
//   useEffect(() => {
//     const fetchDMList = async () => {
//       try {
//         const response = await axios.get(`http://localhost:3001/users/dmlist/${userId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setDmList(response.data); // Set DM list with combined followers and following
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch DM list');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchDMList();
//   }, [userId, token]);

//   // Setup Socket.IO connection
//   useEffect(() => {
//     socket.current = io('http://localhost:3001'); // Ensure this matches your server's socket URL
//     socket.current.emit('join', userId); // Join the socket room (with userId)

//     // Listen for new messages
//     socket.current.on('new_message', (newMessage) => {
//       setMessages((prevMessages) => [...prevMessages, newMessage]);
//     });

//     return () => {
//       // Cleanup on component unmount
//       socket.current.disconnect();
//     };
//   }, [userId]);

//   // Handle sending a message
//   const handleSendMessage = async () => {
//     if (!selectedUser || !message.trim()) {
//       alert('Please select a user and enter a message.');
//       return;
//     }

//     try {
//       // Send message to database through API
//       await axios.post('http://localhost:3001/messages/send', {
//         senderId: userId,
//         receiverId: selectedUser._id,
//         message,
//       }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       // Emit the message via socket after it's stored
//       socket.current.emit('send_message', {
//         senderId: userId,
//         receiverId: selectedUser._id,
//         message,
//       });

//       // Add the message to the local state for immediate UI update
//       setMessages((prevMessages) => [
//         ...prevMessages,
//         { sender: userId, message, receiver: selectedUser._id, createdAt: new Date() },
//       ]);
//       setMessage(''); // Clear the message input
//     } catch (err) {
//       console.error('Error sending message:', err);
//     }
//   };

//   if (loading) return <div>Loading...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="ChatContainer">
//       <h3>Direct Messages</h3>

//       {/* DM List */}
//       <div className="userList">
//         <ul>
//           {dmList.map((user) => (
//             <li key={user._id} onClick={() => setSelectedUser(user)}>
//               <img
//                 src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : '/user.png'}
//                 alt={user.username}
//                 className="ProfilePicture"
//               />
//               <span>{user.username}</span>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Messages */}
//       {selectedUser && (
//         <div className="messages">
//           <h4>{selectedUser.username}</h4>
//           <div className="messageList">
//             {messages
//               .filter((msg) =>
//                 (msg.sender === userId && msg.receiver === selectedUser._id) ||
//                 (msg.receiver === userId && msg.sender === selectedUser._id)
//               )
//               .map((msg, idx) => (
//                 <div key={idx} className={`message ${msg.sender === userId ? 'sent' : 'received'}`}>
//                   <p>{msg.message}</p>
//                   <span>{new Date(msg.createdAt).toLocaleString()}</span>
//                 </div>
//               ))}
//           </div>

//           {/* Send Message */}
//           <div className="newMessage">
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               placeholder="Type your message..."
//             />
//             <button onClick={handleSendMessage}>Send</button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default MessageComponent;

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import './Chat.css'; // Assuming you have a separate CSS file

const MessageComponent = () => {
  const [dmList, setDmList] = useState([]); // DM list state
  const [selectedUser, setSelectedUser] = useState(null); // Selected user for chat
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
        console.error('Error fetching DM list:', err.response?.data?.message || 'Failed to fetch DM list');
      }
    };
    fetchDMList();
  }, [userId, token]);

  // Setup Socket.IO connection
  useEffect(() => {
    socket.current = io('http://localhost:3001'); // Ensure this matches your server's socket URL
    socket.current.emit('join', userId); // Join the socket room (with userId)

    // Listen for new messages
    socket.current.on('new_message', (newMessage) => {
      console.log(newMessage);
    });

    return () => {
      socket.current.disconnect();
    };
  }, [userId]);

  // Handle the selection of a user for chat
  const handleSelectUser = (user) => {
    setSelectedUser(user); // Set selected user
  };

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
                alt={user.username}
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
              <p>Select a user to start chatting!</p>
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
