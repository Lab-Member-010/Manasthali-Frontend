import React, { useState } from "react";
import { useParams } from "react-router-dom";  // useParams import karna hoga
import axios from "axios";

const UpdateContact = () => {
  const { id } = useParams();  // id ko URL se fetch kiya

  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate contact number
    console.log("Contact:", contact); // Check if this value is correct

    if (!contact || contact.length !== 10 || isNaN(contact)) {
      setMessage("Please enter a valid 10-digit contact number.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3001/users/${id}/contact`, // id ko pass kiya
        { contact }
      );
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Failed to update contact. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Update Contact</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Contact:</label>
          <input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </div>
        <button type="submit">Update Contact</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UpdateContact;
