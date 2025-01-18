import React, { useState } from "react";
import axios from "axios";
import Api from "../../apis/Api";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(Api.FORGOT_PASSWORD, { email });
      setMessage(response.data.message);
      setError(""); 
    } catch (err) {
        console.log(err);
        
      setError(err.response?.data?.error || "Something went wrong.");
      setMessage("");
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <div style={{ marginBottom: "15px" }}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: "100%", padding: "8px", marginTop: "5px", borderRadius: "5px", border: "1px solid #ccc" }}
          />
        </div>
        <button type="submit" style={{ width: "100%", padding: "10px", background: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" }}>
          Send Reset Token
        </button>
      </form>
      {message && <p style={{ color: "green", marginTop: "15px" }}>{message}</p>}
      {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
    </div>
  );
};

export default ForgetPassword;
