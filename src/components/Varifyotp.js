import React, { useState } from "react";
import axios from "axios";

const VerifyOtp = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/users/verify-otp", { email, otp });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.error || "Something went wrong.");
      } else {
        setError("Unable to connect to the server.");
      }
    }
  };

  return (
    <div className="verify-otp-container">
      <h2>Verify OTP</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
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
    </div>
  );
};

export default VerifyOtp;
