import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css"
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
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    if (!validateForm()) return;

    try {
      const response = await axios.post("http://localhost:3001/users/register", formData);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      navigate("/verify-otp", { state: { email: formData.email } }); // Pass email to VerifyOtp
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    // <div className="signup-container">
    //   <h2>Sign Up</h2>
    //   {successMessage && <p className="success-message">{successMessage}</p>}
    //   {errorMessage && <p className="error-message">{errorMessage}</p>}
    //   <form onSubmit={handleSubmit}>
    //     <div>
    //       <label>Email:</label>
    //       <input
    //         type="email"
    //         name="email"
    //         value={formData.email}
    //         onChange={handleChange}
    //       />
    //       {errors.email && <p className="error-text">{errors.email}</p>}
    //     </div>
    //     <div>
    //       <label>Password:</label>
    //       <input
    //         type="password"
    //         name="password"
    //         value={formData.password}
    //         onChange={handleChange}
    //       />
    //       {errors.password && <p className="error-text">{errors.password}</p>}
    //     </div>
    //     <div>
    //       <label>Username:</label>
    //       <input
    //         type="text"
    //         name="username"
    //         value={formData.username}
    //         onChange={handleChange}
    //       />
    //       {errors.username && <p className="error-text">{errors.username}</p>}
    //     </div>
    //     <div>
    //       <label>Contact:</label>
    //       <input
    //         type="text"
    //         name="contact"
    //         value={formData.contact}
    //         onChange={handleChange}
    //       />
    //       {errors.contact && <p className="error-text">{errors.contact}</p>}
    //     </div>
    //     <div>
    //       <label>Date of Birth:</label>
    //       <input
    //         type="date"
    //         name="dob"
    //         value={formData.dob}
    //         onChange={handleChange}
    //       />
    //       {errors.dob && <p className="error-text">{errors.dob}</p>}
    //     </div>
    //     <div>
    //       <label>Gender:</label>
    //       <select name="gender" value={formData.gender} onChange={handleChange}>
    //         <option value="">Select Gender</option>
    //         <option value="male">Male</option>
    //         <option value="female">Female</option>
    //         <option value="other">Other</option>
    //       </select>
    //       {errors.gender && <p className="error-text">{errors.gender}</p>}
    //     </div>
    //     <button type="submit">Sign Up</button>
    //   </form>
    // </div>
    <div className="signup-container container d-flex justify-content-center">
    <div className="row justify-content-center">
      <h2 className="text-center mt-4">Sign Up</h2>
      {successMessage && <p className="alert alert-success">{successMessage}</p>}
      {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-control"
          />
          {errors.email && <p className="error-text">{errors.email}</p>}
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-control"
          />
          {errors.password && <p className="error-text">{errors.password}</p>}
        </div>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="form-control"
          />
          {errors.username && <p className="error-text">{errors.username}</p>}
        </div>
        <div className="form-group">
          <label>Contact:</label>
          <input
            type="text"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            className="form-control"
          />
          {errors.contact && <p className="error-text">{errors.contact}</p>}
        </div>
        <div className="form-group">
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            className="form-control"
          />
          {errors.dob && <p className="error-text">{errors.dob}</p>}
        </div>
        <div className="form-group">
          <label>Gender:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="form-control"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
          {errors.gender && <p className="error-text">{errors.gender}</p>}
        </div>
        <button type="submit" className="btn btn-primary btn-block">Sign Up</button>
      </form>
    </div>
  </div>
  );
};

export default SignUp;