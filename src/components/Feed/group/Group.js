
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './Group.module.css';
import { useSelector } from 'react-redux';
import { debounce } from 'lodash';
import Api from '../../../apis/Api';

const Group = () => {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const userId = useSelector((state) => state.user?.user?._id);
  const token = useSelector((state) => state.user?.token);
  const personalityType = useSelector((state) => state.user?.user?.personality_type); // Fetch user's personality type

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        // Fetch groups based on the user's personality type (e.g., INFJ)
        const response = await axios.get(`https://manasthali-backend.onrender.com/groups/get-groups/${personalityType}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch user's joined groups
        const joinedResponse = await axios.get(Api.JOINED_LIST, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const joinedIds = new Set(joinedResponse.data.map(group => group._id));

        const groupsWithJoinStatus = response.data.map((group) => ({
          ...group,
          isJoined: joinedIds.has(group._id),
        }));
        setGroups(groupsWithJoinStatus);
        setFilteredGroups(groupsWithJoinStatus);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch groups');
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, [userId, token, personalityType]); // Make sure personalityType is part of the dependency array

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    debouncedSearch(e.target.value);
  };

  const debouncedSearch = debounce((searchTerm) => {
    filterGroups(searchTerm);
  }, 500);

  const filterGroups = (searchTerm) => {
    if (searchTerm.trim() === '') {
      setFilteredGroups(groups);
    } else {
      setFilteredGroups(groups.filter(group =>
        group.name.toLowerCase().includes(searchTerm.toLowerCase())
      ));
    }
  };

  const handleJoinLeaveToggle = async (groupId, isCurrentlyJoined) => {
    try {
      const url = `${Api.SERVER_URL}/groups/${groupId}/${isCurrentlyJoined ? 'leave' : 'join'}`;
      await axios.post(
        url,
        { userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setGroups(prevGroups =>
        prevGroups.map(group =>
          group._id === groupId ? { ...group, isJoined: !isCurrentlyJoined } : group
        )
      );
      setFilteredGroups(prevFilteredGroups =>
        prevFilteredGroups.map(group =>
          group._id === groupId ? { ...group, isJoined: !isCurrentlyJoined } : group
        )
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Action failed. Please try again.');
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.FindGroupContainer}>
      <h2>{personalityType} Community - Find Groups</h2>
      <div className={styles.SearchBarContainer}>
        <input
          type="text"
          placeholder="Search by group name"
          value={searchTerm}
          onChange={handleSearchChange}
          className={styles.SearchInput}
        />
      </div>
      {filteredGroups.length === 0 ? (
        <p>No groups found</p>
      ) : (
        <table className={styles.Table}>
          <thead className={styles.tHead}>
            <tr>
              <th>Group Name</th>
              <th>Description</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className={styles.tBody}>
            {filteredGroups.map((group) => (
              <tr key={group._id}>
                <td>{group.name}</td>
                <td>{group.description}</td>
                <td>
                  <button
                    onClick={() => handleJoinLeaveToggle(group._id, group.isJoined)}
                    className={styles.JoinLeaveButton}
                  >
                    {group.isJoined ? 'Leave Group' : 'Join Group'}
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

export default Group;
