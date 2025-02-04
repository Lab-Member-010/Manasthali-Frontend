import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../../apis/Api";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import styles from "./AdminLogin.module.css";

const AdminLogin=()=>{
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const username = "admin";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(Api.ADMIN_LOGIN, {
        username,
        token
      });

      if (response.status === 200) {
        toast.success("Welcome Home Admin!");
        navigate("/admin");
      }
    } catch (err) {
      toast.error("Token Invalid!");
    }
  };

  return (
    <div className={styles.adminLoginContainer}>
      <ToastContainer />
      <div className={`${styles.adminLoginBox} container text-center mt-5`}>
      <div className={styles.adminLoginLogo}></div>
        <h2 className="text-center mb-4">Verify Token</h2>
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${styles.adminLoginInputContainer}`}>
          <label className={styles.adminLoginLabelField}>Token:</label>
            <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            className={`form-control ${styles.adminLoginInputField}`}
            placeholder="Enter Token"
            required
          />
          </div>
          <button type="submit" className={`btn custom-btn ${styles.verifyAdminLoginBtn}`}>
            Verify Token
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;