 
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundGif from "../../images/spore.gif";

const ResetPassword = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token"); // Get token from URL

  const [newPassword, setNewPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.[a-zA-Z])(?=.\d)[a-zA-Z\d@]{8,16}$/;
    if (!passwordRegex.test(password)) {
      setErrors({
        newPassword: "Password must be 8-16 characters long, alphanumeric, and can include '@'.",
      });
      return false;
    } else {
      setErrors({});
      return true;
    }
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNewPassword(value);
    validatePassword(value);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!validatePassword(newPassword)) return;

    try {
      const response = await axios.post("http://localhost:3001/users/reset-password", {
        token,
        newPassword,
      });
      toast.success(response.data.message, { position: "top-center" });
      setNewPassword("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Something went wrong.", {
        position: "top-center",
      });
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${backgroundGif})`,
        backgroundSize: "cover",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          maxWidth: "400px",
          margin: "50px auto",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "10px",
          backgroundColor: "transparent",
          boxShadow: "0px 1px 2px 1px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        <ToastContainer />
        <h2>Reset Password</h2>
        <form onSubmit={handleResetPassword}>
          <div style={{ marginBottom: "15px" }}>
            <label>New Password:</label>
            <input
              type="password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={handleChange}
              required
              style={{
                width: "100%",
                padding: "8px",
                marginTop: "5px",
                borderRadius: "5px",
                border: errors.newPassword ? "1px solid red" : "1px solid #ccc",
                backgroundColor: "transparent",
              }}
            />
            {errors.newPassword && (
              <span style={{ color: "red", fontSize: "0.9em" }}>{errors.newPassword}</span>
            )}
          </div>
          <button
            type="submit"
            style={{
              width: "100%",
              padding: "10px",
              color: "black",
              backgroundColor: "transparent",
              fontWeight: "bold",
              fontSize: "1.1rem",
              border: "1px solid black",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;