import React, { useState } from "react";
import axios from "axios";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    contact: "",
    dob: "",
    gender: "",
  });
  
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isOtpPopupVisible, setOtpPopupVisible] = useState(false);
  const [otp, setOtp] = useState("");
  const [verificationMessage, setVerificationMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = "Email is required.";
    if (!formData.password) newErrors.password = "Password is required.";
    if (!formData.username) newErrors.username = "Username is required.";
    if (!formData.contact) newErrors.contact = "Contact is required.";
    if (!formData.dob) newErrors.dob = "Date of Birth is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("Data is filled successfully");
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:3001/users/register", formData);
      setSuccessMessage(response.data.message);
      setOtpPopupVisible(true); // Show OTP popup after successful sign up
    } catch (err) {
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.error || "Something went wrong.");
      } else {
        setErrorMessage("Unable to connect to the server.");
      }
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/users/verify-otp", {
        email: formData.email,
        otp: otp,
      });
      setVerificationMessage(response.data.message); // Display success message
    } catch (err) {
      setVerificationMessage("Invalid OTP. Please try again.");
    }
  };

  return (
    <div className="signup-container">
      <h2>Sign Up</h2>
      {successMessage && <p className="success-message">{successMessage}</p>}
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <form onSubmit={handleSubmit} method="post">
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <p className="error">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && <p className="error">{errors.password}</p>}
        </div>

        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
          />
          {errors.username && <p className="error">{errors.username}</p>}
        </div>

        <div className="form-group">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
          />
          {errors.contact && <p className="error">{errors.contact}</p>}
        </div>

        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
          />
          {errors.dob && <p className="error">{errors.dob}</p>}
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <button type="submit">Sign Up</button>
      </form>

      {/* OTP Popup */}
      {isOtpPopupVisible && (
        <div className="otp-popup">
          <div className="otp-popup-content">
            <h3>Verify OTP</h3>
            <form onSubmit={handleVerifyOtp}>
              <div className="form-group">
                <label>Email:</label>
                <input type="email" value={formData.email} readOnly />
              </div>
              <div className="form-group">
                <label>OTP:</label>
                <input
                  type="text"
                  value={otp}
                  onChange={handleOtpChange}
                  required
                />
              </div>
              <button type="submit">Verify OTP</button>
            </form>
            {verificationMessage && (
              <p className={verificationMessage.includes("Invalid") ? "error" : "success"}>
                {verificationMessage}
              </p>
            )}
            <button onClick={() => setOtpPopupVisible(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SignUp;
