import React, { useState } from 'react';
import axios from 'axios';
import "./Group.css";


const Group = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [communityId, setCommunityId] = useState('');
  const [members, setMembers] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/groups/create', {
        name,
        description,
        communityId,
        members,
      });
      setSuccess('Group created successfully!');
      setName('');
      setDescription('');
      setCommunityId('');
      setMembers([]);
    } catch (err) {
      setError(err.response.data.message || 'Error creating group');
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
          <label>Community ID (optional):</label>
          <input
            type="text"
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
          />
        </div>
        <div>
          <label>Members (comma-separated user IDs):</label>
          <input
            type="text"
            value={members}
            onChange={(e) => setMembers(e.target.value.split(','))}
          />
        </div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <button type="submit">Create Group</button>
      </form>
    </div>
  );
};

export default Group;
