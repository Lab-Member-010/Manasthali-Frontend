import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Signup.module.css";
import Api from "../../apis/Api";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // Manage password visibility
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

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={styles.signupContainer}>
      <div className={`${styles.signupBox} container text-center mt-5`}>
        <div className="row justify-content-center">
          <div className={styles.signupLogo}></div>
          <h1>Sign Up</h1>
          {successMessage && (
            <p className="alert alert-success">{successMessage}</p>
          )}
          {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className={`form-group ${styles.inputContainer}`}>
              <label className={formData.email ? "active" : ""}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${styles.inputField}`}
                placeholder="Enter your email"
                autoComplete="off"
                required
              />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>
            <div className={`form-group ${styles.inputContainer}`}>
              <label className={formData.username ? "active" : ""}>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-control ${styles.inputField}`}
                placeholder="Enter your username"
                autoComplete="off"
                required
              />
              {errors.username && <p className={styles.errorText}>{errors.username}</p>}
            </div>
            <div className={`form-group ${styles.inputContainer}`}>
              <label className={formData.password ? "active" : ""}>Password:</label>
              <div className={styles.passwordFieldContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${styles.inputField}`}
                  placeholder="Enter your Password"
                  autoComplete="off"
                  required
                />
                <span
                  className={styles.togglePassword}
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {passwordVisible ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
              {errors.password && <p className={styles.errorText}>{errors.password}</p>}
            </div>
            <button type="submit" className={`btn custom-btn ${styles.upBtnOutline}`}>
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
