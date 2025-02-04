import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './FindFriend.module.css';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import Api from "../../../apis/Api";

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
        const response = await axios.get(`${Api.GET_COMMUNITY_USERS}/${userId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const followingResponse = await axios.get(`http://localhost:3001/users/${userId}/following`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        const followingIds = new Set(followingResponse.data.following.map(user => user._id));

        const usersWithFollowStatus = response.data.users.map((user) => ({
          ...user,
          isFollowing: followingIds.has(user._id),
        }));
        setUsers(usersWithFollowStatus);
        setFilteredUsers(usersWithFollowStatus);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [userId, token]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = debounce((searchTerm) => {
    filterUsers(searchTerm);
  }, 500);

  const filterUsers = (searchTerm) => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(users.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };

  const handleFollowToggle = async (targetUserId, isCurrentlyFollowing) => {
    try {
        const url = `http://localhost:3001/users/${isCurrentlyFollowing ? 'unfollow' : 'follow'}`;
        await axios.post(
            url,
            { userId, userIdToUnfollow: targetUserId, userIdToFollow: targetUserId }, // Corrected field names
            { headers: { Authorization: `Bearer ${token}` } }
        );

        setUsers(prevUsers =>
            prevUsers.map(user =>
                user._id === targetUserId ? { ...user, isFollowing: !isCurrentlyFollowing } : user
            )
        );
        setFilteredUsers(prevFilteredUsers =>
            prevFilteredUsers.map(user =>
                user._id === targetUserId ? { ...user, isFollowing: !isCurrentlyFollowing } : user
            )
        );
    } catch (err) {
        alert(err.response?.data?.message || 'Action failed. Please try again.');
    }
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.FindFriendContainer}>
      <h2>Find Friends</h2>
      <div className={styles.SearchBarContainer}>
        <input
          type="text"
          placeholder="Search by username"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.SearchInput}
        />
      </div>
      {filteredUsers.length === 0 ? (
        <p>No users found</p>
      ) : (
        <table className={styles.Table}>
          <thead className={styles.tHead}>
            <tr>
              <th>Profile Picture</th>
              <th>Username</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tBody}>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <img
                    src={user.profile_picture ? user.profile_picture : '/user.png'}
                    alt={user.username}
                    className={styles.ProfilePicture}
                    onError={(e) => { e.target.src = '/user.png'; }}
                  />
                </td>
                <td>{user.username}</td>
                <td>
                  <button
                    onClick={() => handleFollowToggle(user._id, user.isFollowing)}
                    className={styles.FollowUnfollow}
                  >
                    {user.isFollowing ? 'Unfollow' : 'Follow'}
                  </button>
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
