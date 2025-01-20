import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css"; // Ensure your CSS file path is correct
import Api from "../../apis/Api";

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
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
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(Api.SIGN_UP, formData);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div className="sign">
      <div className="signup-container">
        <div className="signup-box">
          <h2>Sign Up</h2>
          {successMessage && (
            <p className="alert alert-success">{successMessage}</p>
          )}
          {errorMessage && (
            <p className="alert alert-danger">{errorMessage}</p>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
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
                required
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
                required
              />
              {errors.username && (
                <p className="error-text">{errors.username}</p>
              )}
            </div>
            <button type="submit" className="btn btn-primary signup-button">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;