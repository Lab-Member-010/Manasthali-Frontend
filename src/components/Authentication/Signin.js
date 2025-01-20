import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux-config/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import styles from "./Signin.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false); // Toggle state for Forgot Password
  const [passwordVisible, setPasswordVisible] = useState(false); // Password visibility toggle
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Handle Sign-in
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(Api.SIGN_IN, { email, password });
      console.log("API response:", response.data);

      dispatch(
        setUser({
          user: response.data.user,
          message: response.data.message,
          token: response.data.token,
          isLoggedIn: true,
        })
      );

      if (response.data.user.personality_type) {
        navigate("/feed");
      } else {
        navigate("/quiz-start");
      }
    } catch (err) {
      console.error("Error:", err);
      toast.error("Invalid credentials");
    }
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post(Api.FORGOT_PASSWORD, { email });
      toast.success("Password reset link sent to your email.");
      setForgotPassword(false);
    } catch (err) {
      console.error("Error:", err);
      toast.error("Failed to send password reset link.");
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.signinContainer}>
        <div className={`${styles.signinBox} shadow-lg p-4`}>
          <div className={styles.signinLogo}></div> {/* Add your logo here */}
          <h3 className="text-center mb-4">
            {forgotPassword ? "Reset Password" : "Sign In"}
          </h3>
          {!forgotPassword ? (
            // Sign In Form
            <form onSubmit={handleSubmit}>
              <div className={styles.inputContainer}>
                <label htmlFor="email" className={email ? "active" : ""}>
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className={`form-control ${styles.inputField}`}
                  required
                />
              </div>

              <div className={styles.inputContainer}>
                <label htmlFor="password" className={password ? "active" : ""}>
                  Password
                </label>
                <div className="password-field-container">
                  <input
                    type={passwordVisible ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className={`form-control ${styles.inputField}`}
                    required
                  />
                  <span
                    className={styles.togglePassword}
                    onClick={togglePasswordVisibility}
                    style={{ cursor: "pointer" }}
                  >
                    {passwordVisible ? "Hide" : "Show"}
                  </span>
                </div>
              </div>

              <button type="submit" className={`btn ${styles.inBtn} w-100`}>
                Sign In
              </button>

              <button
                type="button"
                className={`btn ${styles.inBtn} btn-link mt-3 w-100`}
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <div className={styles.inputContainer}>
                <label htmlFor="reset-email" className={email ? "active" : ""}>
                  Email
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`form-control ${styles.inputField}`}
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary w-100">
                Send Reset Link
              </button>

              <button
                type="button"
                className="btn btn-link w-100 mt-3"
                onClick={() => setForgotPassword(false)}
              >
                Back to Sign In
              </button>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SignIn;
