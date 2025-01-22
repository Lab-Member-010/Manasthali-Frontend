import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const UpdateContact = () => {
  const user = useSelector((state) => state.UserSlice?.user); // Redux से user डाटा प्राप्त करें
  const userId = user ? user._id : null; // userId प्राप्त करें

  const [contact, setContact] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!contact || contact.length !== 10 || isNaN(contact)) {
      setMessage('Please enter a valid 10-digit contact number.');
      return;
    }

    if (!userId) {
      setMessage('User ID not found. Please log in again.');
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/users/${userId}/contact`,
        { contact },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        setMessage(response.data.message);
      } else {
        setMessage('Failed to update contact. Please try again.');
      }
    } catch (error) {
      console.error("API Error:", error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.message || 'Failed to update contact. Please try again.';
      setMessage(errorMessage);
    }
  };

  return (
    <div>
      <h2>Contact Update</h2>
      <form onSubmit={handleSubmit}>
        <label>Contact:</label>
        <input
          type="text"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
        />
        <button type="submit">Update Contact</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateContact;
