import React, { useState } from "react";
import axios from "axios";

const UpdateGender = ({ id }) => {
  const [gender, setGender] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!gender) {
      setMessage("Gender is required.");
      return;
    }

    try {
      console.log(id)
      const response = await axios.put(
        `http://localhost:3001/users/${id}/gender`, 
        { gender }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to update gender. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Update Gender</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Gender:</label>
          <select
            value={gender}
            onChange={(e) => setGender(e.target.value)}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
        <button type="submit">Update Gender</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateGender;
