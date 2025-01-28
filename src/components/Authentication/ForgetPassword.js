 
import React, { useState } from "react";
import axios from "axios";
import Api from "../../apis/Api";
import backgroundGif from "../../images/spore.gif"; // Import the image

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;
    if (!emailRegex.test(value)) {
      setValidationError("Invalid email format. Email must include '@' and end with '.com'.");
    } else {
      setValidationError("");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (validationError || !email) {
      setValidationError("Please provide a valid email.");
      return;
    }

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
    <div
      style={{
        backgroundImage: `url(${backgroundGif})`, 
        backgroundSize: "cover",
        height: "100vh", 
        display: "flex", 
        alignItems: "center",
        justifyContent: "center",
        
       
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "transparent",
          boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)"
      
        }}
      >
        <h2>Forget Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div style={{ marginBottom: "15px" }}>
            <label>Email:</label>
            <input
              type="email"
              placeholder="enter the email"
              value={email}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "5px",
                backgroundColor: "transparent",
                border: validationError ? "1px solid red" : "1px solid #ccc",
              }}
            />
            {validationError && (
              <p style={{ color: "red", fontSize: "0.9rem", marginTop: "5px" }}>{validationError}</p>
            )}
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
            
              borderRadius: "5px",
              cursor: "pointer",
              
              color: "black",
              backgroundColor: "transparent",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "1px solid black",
            }}
          >
            Send Reset Token
          </button>
        </form>
        {message && <p style={{ color: "green", marginTop: "15px" }}>{message}</p>}
        {error && <p style={{ color: "red", marginTop: "15px" }}>{error}</p>}
      </div>
    </div>
  );
};

export default ForgetPassword;