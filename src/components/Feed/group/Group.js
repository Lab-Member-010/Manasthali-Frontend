import React, { useState } from 'react';
import axios from 'axios';

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
    <div className="container-fluid border">
  <div className="row justify-content-center">
    <div className="col-md-8">
      <h2>Create New Group</h2>
      <form className="form-group" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label text-dark">Group Name:</label>
          <input
            type="text"
            className="form-control text-dark"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label text-dark">Description:</label>
          <textarea
            className="form-control text-dark"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label text-dark">Members (comma-separated user IDs):</label>
          <input
            type="text"
            className="form-control text-dark"
            value={members}
            onChange={(e) => setMembers(e.target.value)}
            placeholder="user1_id, user2_id"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label text-dark">Group Icon (optional):</label>
          <input
            type="text"
            className="form-control text-dark"
            value={groupIcon}
            onChange={(e) => setGroupIcon(e.target.value)}
            placeholder="URL of group icon"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label text-dark">Community ID (optional):</label>
          <input
            type="text"
            className="form-control text-dark"
            value={communityId}
            onChange={(e) => setCommunityId(e.target.value)}
            placeholder="Optional Community ID"
          />
        </div>
        
        <div className="form-group">
          <label className="form-label text-dark">Initial Message (optional):</label>
          <textarea
            className="form-control text-dark"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Welcome to the new group!"
          />
        </div>

        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        <div className="form-group">
          <button type="submit" className="btn btn-primary btn-block">Create Group</button>
        </div>
      </form>
    </div>
  </div>
</div>

  );
};

export default Group;
