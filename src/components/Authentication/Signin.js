import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux-config/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import styles from "./Signin.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Visibility, VisibilityOff } from "@mui/icons-material"; 
import { Link } from "react-router-dom";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({}); 
  const [passwordVisible, setPasswordVisible] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();

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

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^@\s]+@[^@\s]+\.com$/;
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@]{8,16}$/;

    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format. Email must include '@' and end with '.com'.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (!passwordRegex.test(password)) {
      newErrors.password = "Password must be 8-16 characters long, alphanumeric, and can include '@'.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle Sign-in
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

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
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`form-control ${styles.inputField} ${errors.email ? styles.errorBorder : ""}`}
                autoComplete="off"
                required
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputContainer}>
              <label htmlFor="password" className={styles.labelField}>
                Password
              </label>
              <div className="password-field-container">
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

            <button type="submit" className={`btn ${styles.inBtn}`}>
              Sign In
            </button>

            <a className={`${styles.inAnchor} mt-5 w-100`} href={"/forgot-password/"}>
              Forgot Password?
            </a>
          </form>
          <h5>
            Don't have an account?  
            <span>
              <Link to="/Signup" style={{ textDecoration: "none" }}> Please Register</Link>
            </span>
          </h5>
        </div>
      </div>
    </>
  );
};

export default SignIn;