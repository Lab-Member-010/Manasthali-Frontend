import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./Signup.module.css";
import Api from "../../apis/Api";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons
import { Link } from "react-router-dom";

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

    if (name === "email") {
      const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;
      if (!emailRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email format." }));
      } else {
        setErrors((prevErrors) => {
          const { email, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    if (name === "password") {
      const passwordRegex = /^(?=.[a-zA-Z])(?=.\d)[a-zA-Z\d@]{8,16}$/;
      if (!passwordRegex.test(value)) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          password: "Password must be 8-16 characters long, alphanumeric, and can include '@'.",
        }));
      } else {
        setErrors((prevErrors) => {
          const { password, ...rest } = prevErrors;
          return rest;
        });
      }
    }

    if (name === "username") {
      if (value.trim() === "") {
        setErrors((prevErrors) => ({ ...prevErrors, username: "Username is required." }));
      } else {
        setErrors((prevErrors) => {
          const { username, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const validateForm = async () => {
    const newErrors = {};
    const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;
    const passwordRegex = /^(?=.[a-zA-Z])(?=.\d)[a-zA-Z\d@]{8,16}$/;

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format.";
    } else {
      // Check if email already exists
      try {
        const response = await axios.post(Api.CHECK_EMAIL, { email: formData.email });
        if (!response.data.available) {
          newErrors.email = "Email already exists.";
        }
      } catch (err) {
        console.error("Error checking email:", err);
      }
    }

    if (!formData.username) {
      newErrors.username = "Username is required.";
    } else {
      // Check if username already exists
      try {
        const response = await axios.post(Api.CHECK_USERNAME, { username: formData.username });
        if (!response.data.available) {
          newErrors.username = "Username already exists.";
        }
      } catch (err) {
        console.error("Error checking username:", err);
      }
    }

    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(formData.password)) {
      newErrors.password = "Password must be 8-16 characters long, alphanumeric, and can include '@'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!(await validateForm())) return;

    try {
      const response = await axios.post(Api.SIGN_UP, formData);
      setSuccessMessage(response.data.message);
      setErrorMessage("");
      navigate("/verify-otp", { state: { email: formData.email } });
    } catch (err) {
      setErrorMessage(err.response?.data?.error || "Something went wrong.");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={styles.signupContainer}>
      <div className={`${styles.signupBox} container text-center mt-5`}>
        <div className="row justify-content-center">
          <div className={styles.signupLogo}></div>
          <h2 className="text-center mb-4">Sign Up</h2>
          {successMessage && <p className="alert alert-success">{successMessage}</p>}
          {errorMessage && <p className="alert alert-danger">{errorMessage}</p>}
          <form onSubmit={handleSubmit}>
            <div className={`form-group ${styles.inputContainer}`}>
              <label className={styles.labelField}>Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-control ${styles.inputField} ${errors.email ? styles.errorBorder : ""}`}
                placeholder="Enter your email"
                autoComplete="off"
                required
              />
              {errors.email && <p className={styles.errorText}>{errors.email}</p>}
            </div>
            <div className={`form-group ${styles.inputContainer}`}>
              <label className={styles.labelField}>Username:</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`form-control ${styles.inputField} ${errors.username ? styles.errorBorder : ""}`}
                placeholder="Enter your username"
                autoComplete="off"
                required
              />
              {errors.username && <p className={styles.errorText}>{errors.username}</p>}
            </div>
            <div className={`form-group ${styles.inputContainer}`}>
              <label className={styles.labelField}>Password:</label>
              <div className={styles.passwordFieldContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`form-control ${styles.inputField} ${errors.password ? styles.errorBorder : ""}`}
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
          <h5>
            Already have an account?  
            
              <Link to="/signin" style={{ textDecoration: "none" }}> Sign In</Link>
           
          </h5>
        </div>
      </div>
    </div>
  );
};

export default SignUp;