import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.backgroundContainer}>
      <div className={`${styles.homeContainer} container text-center mt-5`}>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <h3 className="display-4 mb-4">Welcome to Manasthali</h3>
            <p className="lead">
              A platform to connect with people based on your personality.
            </p>
            <div className="d-grid gap-3 col-6 mx-auto mt-4">
              <button
                className={`${styles.customBtn} ${styles.customBtnOutline} btn`}
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
              <button
                className={`${styles.customBtn} ${styles.customBtnOutline} btn`}
                onClick={() => navigate("/signin")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;