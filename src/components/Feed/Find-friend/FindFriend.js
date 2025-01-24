import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FindFriend.css';
import { useSelector } from 'react-redux';

const FindFriend = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/users/get-all-users-except/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log('API Response:', response.data);
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
      } catch (err) {
        console.error('Fetch Error:', err.response?.data || err.message);
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, token]);

  const handleFollow = async (userIdToFollow) => {
    console.log("User ID to follow:", userIdToFollow);
    console.log("Authorization token:", token); 
  
    if (!token) {
      alert('Authentication token is missing. Please log in.');
      return;
    }
  
    try {
      const response = await axios.post(
        `http://localhost:3001/users/follow/${userIdToFollow}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      console.log("API Response:", response.data); // Log API response
      if (response.status === 200) {
        alert(response.data.message || 'Followed successfully!');
        setUsers(users.filter((user) => user._id !== userIdToFollow)); // Remove user from list
      }
    } catch (err) {
      console.error("Error:", err.response || err.message); // Log error response
      alert(err.response?.data?.message || 'Failed to follow. Please try again.');
    }
  };
  
  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="FindFriendContainer">
      <h2>Find Friends</h2>
      {users.length === 0 ? (
        <p>No other users are available to follow.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Profile Picture</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.profile_picture ? `http://localhost:3001/${user.profile_picture}` : '/user.png'}
                    alt={user.username}
                    className="ProfilePicture"
                    onError={(e) => {
                      e.target.src = '/user.png';
                    }}
                  />
                </td>
                <td>{user.username}</td>
                <td>
                  <button onClick={() => handleFollow(user._id)}>Follow</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FindFriend;