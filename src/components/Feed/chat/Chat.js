import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import io from 'socket.io-client';
import './Chat.css';

const MessageComponent = () => {
  const [followers, setFollowers] = useState([]);
  // const [following, setFollowing] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const socket = useRef(null); // To hold the socket reference

  // Fetch followers and following lists
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/${userId}/followers`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { followers } = response.data;
        // const { following } = response.data;
        setFollowers(followers);
        // setFollowing(following);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch followers and following');
      } finally {
        setLoading(false);
      }
    };
    

    fetchUserData();
  }, [userId, token]);

  // Setup Socket.IO connection
  useEffect(() => {
    // Initialize socket connection when component mounts
    socket.current = io('http://localhost:3001'); // Make sure this URL matches your server's
    socket.current.emit('join', userId); // Join the socket room (with userId)
    
    // Listen for new messages
    socket.current.on('new_message', (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    return () => {
      // Cleanup on component unmount
      socket.current.disconnect();
    };
  }, [userId]);

  // Handle sending a message
  const handleSendMessage = () => {
    if (!selectedUser || !message.trim()) {
      alert('Please select a user and enter a message.');
      return;
    }

    // Send the message via socket
    socket.current.emit('send_message', {
      senderId: userId,
      receiverId: selectedUser._id,
      message,
    });

    // Add the message to the local state for immediate UI update
    setMessages((prevMessages) => [
      ...prevMessages,
      { sender: userId, message, receiver: selectedUser._id, createdAt: new Date() },
    ]);
    setMessage(''); // Clear the message input
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="ChatContainer">
      <h2>Direct Messages</h2>

      {/* Following List */}
      {/* <div className="userList">
        <h3>Your Following</h3>
        <ul>
          {following.map((user) => (
            <li key={user._id} onClick={() => setSelectedUser(user)}>
              <img
                src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : '/user.png'}
                alt={user.username}
                className="ProfilePicture"
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      </div> */}

      Followers List
       <div className="userList">
        <ul>
          {followers.map((user) => (
            <li key={user._id} onClick={() => setSelectedUser(user)}>
              <img
                src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : '/user.png'}
                alt={user.username}
                className="ProfilePicture"
              />
              <span>{user.username}</span>
            </li>
          ))}
        </ul>
      </div>  

      {/* Messages */}
      {selectedUser && (
        <div className="messages">
          <h3>Chat with {selectedUser.username}</h3>
          <div className="messageList">
            {messages
              .filter((msg) => (msg.sender === userId && msg.receiver === selectedUser._id) || (msg.receiver === userId && msg.sender === selectedUser._id))
              .map((msg, idx) => (
                <div key={idx} className={`message ${msg.sender === userId ? 'sent' : 'received'}`}>
                  <p>{msg.message}</p>
                  <span>{new Date(msg.createdAt).toLocaleString()}</span>
                </div>
              ))}
          </div>

          {/* Send Message */}
          <div className="newMessage">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button onClick={handleSendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageComponent;
