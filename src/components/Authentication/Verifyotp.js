import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
// import styles from "./Verifyotp.module.css";

const Verifyotp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; 
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/users/verify-otp", {
        email,
        otp,
      });

      if (response.status === 200) {
        // Show success toast and navigate to sign-in
        toast.success(response.data.message);
        navigate("/signin");
      }
    } catch (err) {
      // Show error toast
      const errorMessage = err.response?.data?.error || "Invalid OTP.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="otp-popup">
      <ToastContainer />
      <div className="otp-box">
        <h2>Verify OTP</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            required
          />
          <button type="submit" className="btn btn-primary w-100">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verifyotp;
