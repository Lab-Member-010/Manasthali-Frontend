
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './FindFriend.css';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';

const FindFriend = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
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
        setUsers(Array.isArray(response.data.users) ? response.data.users : []);
        setFilteredUsers(response.data.users); // Initially, show all users
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, token]);

  // Debounced search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    debouncedSearch(value);
  };

  const debouncedSearch = debounce((searchTerm) => {
    filterUsers(searchTerm);
  }, 500); // Delay of 500ms before the search is triggered

  // Filter users based on search term
  const filterUsers = (searchTerm) => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter((user) =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user._id.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    } else {
      setFilteredUsers(users);
    }
  }, [searchTerm, users]);

  const handleFollow = async (userIdToFollow) => {
    if (!token) {
      alert('Authentication token is missing. Please log in.');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:3001/users/follow`,
        { userId, userIdToFollow },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert(response.data.message || 'Followed successfully!');
      // Remove the followed user from the list
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userIdToFollow));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to follow. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="FindFriendContainer">
      <h2>Find Friends</h2>

      {/* Search bar to filter users */}
      <div className="SearchBarContainer">
        <input
          type="text"
          placeholder="Search by username or user ID"
          value={searchTerm}
          onChange={handleSearchChange}
          className="SearchInput"
        />
      </div>

      {/* Display filtered users */}
      {filteredUsers.length === 0 ? (
        <p>No users found</p>
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
            {filteredUsers.map((user) => (
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
                  <button className="FollowUnfollow" onClick={() => handleFollow(user._id)}>Follow</button>
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
