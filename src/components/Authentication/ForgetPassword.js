import React, { useState } from "react";
import axios from "axios";
import Api from "../../apis/Api";
import styles from "./ForgetPassword.module.css";
import { toast, ToastContainer } from "react-toastify";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "email") {
      setEmail(value);
      const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;
      if (!emailRegex.test(value)) {
        setErrors((prevErrors) => ({ ...prevErrors, email: "Invalid email format. Email must include '@' and end with '.com'." }));
      } else {
        setErrors((prevErrors) => {
          const { email, ...rest } = prevErrors;
          return rest;
        });
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format. Email must include '@' and end with '.com'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post(Api.FORGOT_PASSWORD, { email });
      toast.success("Reset Password Link sent to you Email")
      setErrors("");
    } catch (err) {
      console.log(err);
      setErrors(err.response?.data?.error || "Something went wrong.");
      toast.error("Error sending reset Email");
    }
  };

  return (
    <div className={styles.ForgetContainer}>
      <ToastContainer/>
      <div className={`${styles.forgetBox} shadow-lg p-4`}>
      <div className={styles.forgetLogo}></div>
        <h2 className="text-center mb-4">Forget Password</h2>
        <form onSubmit={handleForgotPassword}>
          <div className={styles.inputContainer}>
            <label>Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email"
              className={`form-control ${styles.inputField} ${styles.passwordFieldContainer} ${errors.email ? styles.errorBorder : ""}`}
              autoComplete="off"
              required
            />
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>
          <button type="submit" className={`btn ${styles.forgetButton}`}>
            Send Reset Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgetPassword;