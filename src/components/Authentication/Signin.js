import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux-config/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import styles from "./Signin.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Visibility, VisibilityOff } from "@mui/icons-material"; // Import icons

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <>
      <ToastContainer />
      <div className={styles.signinContainer}>
        <div className={`${styles.signinBox} shadow-lg p-4`}>
          <div className={styles.signinLogo}></div> {/* Add your logo here */}
          <h2 className="text-center mb-4">Sign In</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.inputContainer}>
              <label htmlFor="email" className={styles.labelField}>
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
                className={`form-control ${styles.inputField}`}
                autoComplete="off"
                required
              />
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="password" className={styles.labelField}>
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
                  {passwordVisible ? (
                    <VisibilityOff />
                  ) : (
                    <Visibility />
                  )}
                </span>
              </div>
            </div>

            <button type="submit" className={`btn ${styles.inBtn}`}>
              Sign In
            </button>

            <a className={`${styles.inAnchor} mt-5 w-100`} href={"/forgot-password/"}>
              Forgot Password?
            </a>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignIn;
