import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux-config/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import "./Signin.css";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
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

  // Handle Forgot Password
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

  return (
    <>
      <ToastContainer />
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="card shadow-lg p-4" style={{ width: "100%", maxWidth: "400px" }}>
        <div className="signin-box shadow-lg p-4">
        <div className="signin-logo"></div>  {/* Add the logo here */}
          <h3 className="text-center mb-4">
            {forgotPassword ? "Reset Password" : "Sign In"}
          </h3>
          {!forgotPassword ? (
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email"
                  className="form-control"
                  required
                />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="form-control"
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Sign In
              </button>
              <button
                type="button"
                className="btn btn-link w-100 mt-3"
                onClick={() => setForgotPassword(true)}
              >
                Forgot Password?
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-3">
                <label htmlFor="reset-email" className="form-label">
                  Email
                </label>
                <input
                  type="email"
                  id="reset-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="form-control"
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
      </div>
    </>
  );
}

