import React, { useState } from "react";
import axios from "axios";

const UpdateDOB = ({ userId }) => {
  const [dob, setDob] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dob) {
      setMessage("Date of Birth is required.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/users/${userId}/dob`, 
        { dob }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to update DOB. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Update Date of Birth</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
          />
        </div>
        <button type="submit">Update DOB</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateDOB;
