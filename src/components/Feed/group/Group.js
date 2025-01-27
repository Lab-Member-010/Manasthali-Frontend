import React, { useState } from 'react';
import axios from 'axios';
import "./Group.css";

const Group = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [members, setMembers] = useState('');
  const [groupIcon, setGroupIcon] = useState(''); // For group icon (optional)
  const [communityId, setCommunityId] = useState(''); // For community ID (optional)
  const [message, setMessage] = useState(''); // For initial group message (optional)
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Convert members from comma-separated string to an array of IDs
    const memberArray = members.split(',').map((id) => id.trim()).filter((id) => id);

    // Prepare the data to send
    const groupData = {
      name,
      description,
      members: memberArray,
      groupIcon, // Include only if provided
      communityId, // Include only if provided
      message, // Include only if provided
    };

    try {
      const response = await axios.post('http://localhost:3001/groups/create', groupData);
      setSuccess('Group created successfully!');
      setError(''); // Reset error if successful
      setName('');
      setDescription('');
      setMembers('');
      setGroupIcon('');
      setCommunityId('');
      setMessage('');
      console.log(response.data); // Log response to see details
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating group');
      setSuccess(''); // Reset success if there was an error
    }
  };

  return (
    <div className="create-group">
      <h2>Create New Group</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Group Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <label>Members (comma-separated user IDs):</label>
          <input
            type="text"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            placeholder="user1_id, user2_id"
          />
        </div>
        <div>
          <label>Group Icon (optional):</label>
          <input
            type="text"
            value={groupIcon}
            onChange={(e) => setGroupIcon(e.target.value)}
            placeholder="URL of group icon"
          />
        </div>
        <div>
          <label>Community ID (optional):</label>
          <input
            type="text"
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            placeholder="Optional Community ID"
          />
        </div>
        <div>
          <label>Initial Message (optional):</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Welcome to the new group!"
          ></textarea>
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default Group;
