import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Retrieve email from state

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3001/users/verify-otp", { email, otp });
      setMessage(response.data.message);
      setError("");
      navigate("/signin"); // Navigate to Sign-In on success
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP.");
    }
  };

  return (
    <div className="otp-popup">
      <form onSubmit={handleSubmit}>
        <h2>Verify OTP</h2>
        <input
          type="text"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter OTP"
          required
        />
        <button type="submit">Verify OTP</button>
        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}
      </form>
    </div>
  );
};

export default Verifyotp;
