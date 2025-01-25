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

  const handleResetPassword = async (e) => {
    e.preventDefault();
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
    <div style={{ maxWidth: "400px", margin: "50px auto", padding: "20px", border: "1px solid #ccc", borderRadius: "10px" }}>
      <ToastContainer />
      <h2>Reset Password</h2>
      <form onSubmit={handleResetPassword}>
        <div style={{ marginBottom: "15px" }}>
          <label>New Password:</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "8px",
              marginTop: "5px",
              borderRadius: "5px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
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
