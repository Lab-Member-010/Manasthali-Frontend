import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "../../redux-config/UserSlice";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";

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

      // Log the response data to debug
      console.log("API response:", response.data);

      // Dispatch the user data to Redux
      dispatch(setUser({
        user: response.data.user,
        message: response.data.message,
        token: response.data.token,
        isLoggedIn: true, // Ensure this is dispatched correctly
      }));

      // After successful login, navigate to the appropriate page
      if (response.data.user.personality_type) {
        navigate("/feed"); // Redirect to feed page if user has personality_type
      } else {
        navigate("/quiz-start"); // Redirect to quiz if user doesn't have personality_type
      }
    } catch (err) {
      console.log("Error:", err);
      toast.error("Invalid credentials");
    }
  };

  // Handle Forgot Password
  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(Api.FORGOT_PASSWORD, { email });
      toast.success("Password reset link sent to your email.");
      setForgotPassword(false); // Close the forgot password modal
    } catch (err) {
      console.log("Error:", err);
      toast.error("Failed to send password reset link.");
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="container d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
        <div className="" style={{ width: "30%", height: "auto", boxShadow: "10px 10px 10px 10px grey" }}>
          <h3 className="bg-dark text-white text-center p-2">Sign in</h3>

          {/* Sign In Form */}
          {!forgotPassword ? (
            <form className="p-3" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  onChange={(event) => setEmail(event.target.value)}
                  type="text"
                  placeholder="Enter email id"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <input
                  onChange={(event) => setPassword(event.target.value)}
                  type="password"
                  placeholder="Enter password"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <button style={{ width: "100%" }} className="btn btn-outline-secondary">
                  Submit
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setForgotPassword(true)} // Switch to forgot password view
                >
                  Forgot Password?
                </button>
              </div>
            </form>
          ) : (
            // Forgot Password Form
            <div className="p-3">
              <div className="form-group">
                <input
                  onChange={(event) => setEmail(event.target.value)}
                  type="text"
                  placeholder="Enter your email to reset password"
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  style={{ width: "100%" }}
                  className="btn btn-outline-secondary"
                >
                  Send Reset Link
                </button>
              </div>
              <div className="text-center">
                <button
                  type="button"
                  className="btn btn-link"
                  onClick={() => setForgotPassword(false)} // Go back to login view
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
