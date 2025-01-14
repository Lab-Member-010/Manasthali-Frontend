import React, { useState } from "react";
import axios from "axios";

const Varifyotp = ({ email, onClose }) => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/users/verify-otp", { email, otp });
      setMessage(response.data.message);
      setError("");
      onClose(); // Close popup on success
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Invalid OTP.");
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="otp-popup">
      <div className="popup-content">
        <h2>Verify OTP</h2>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} readOnly />
          </div>
          <div className="form-group">
            <label>OTP:</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit">Verify OTP</button>
        </form>
        <button onClick={onClose} className="close-btn">
          Close
        </button>
      </div>
    </div>
  );
};

export default Varifyotp;
