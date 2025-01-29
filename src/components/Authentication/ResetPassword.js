import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styles from "./ResetPassword.module.css";
import { Visibility, VisibilityOff } from "@mui/icons-material"; 

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); 

  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  
  const validatePassword = (password) => {
    const newErrors = {};
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@]{8,16}$/;
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be 8-16 characters long, alphanumeric, and can include '@'.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e) => {
    const { name,value } = e.target;
    if (name === "password") {
      setPassword(value);
      const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@]{8,16}$/;
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
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) return;
    
    try {
      console.log(password);
      const response = await axios.post("http://localhost:3001/users/reset-password", {
        token,
        password,
      });
      toast.success(response.data.message, { position: "top-center" });
      setPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.", {
        position: "top-center",
      });
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className={styles.resetContainer}>
      <div className={styles.resetBox}>
        <ToastContainer />
        <div className={styles.resetLogo}></div>
        <h2 className="text-center mb-4">Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div className={styles.inputContainer}>
            <label>New Password:</label>
              <div className={styles.passwordFieldContainer}>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`form-control ${styles.inputField} ${errors.password ? styles.errorBorder : ""}`}
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
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>
          <button type="submit" className={`btn ${styles.resetButton}`}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;