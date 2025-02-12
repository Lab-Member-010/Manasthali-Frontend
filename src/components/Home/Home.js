import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Home.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import InfoIcon from '@mui/icons-material/Info';
import SecurityIcon from '@mui/icons-material/Security';
import { useState } from "react";
import Modal from "react-modal";

const Home = () => {
  const navigate = useNavigate();
  const [activeAbout, setActiveAbout] = useState(null);

  const handleAdminToggle=()=>{
    navigate("/admin-login");
  };

  const handleAboutToggle = () => {
    setActiveAbout(activeAbout === true ? null : true);
  };

  return (
    <div className={styles.backgroundContainer}>
      <SecurityIcon className={styles.AdminLoginToggle} onClick={()=>handleAdminToggle()}/>
      <InfoIcon className={styles.AboutToggle} onClick={() => handleAboutToggle(true)}/>
      <div className={`${styles.homeContainer} container-fluid text-center`}>
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
      {/* Modal for Commenting */}

      <Modal
        isOpen={activeAbout !== null}
        onRequestClose={() => setActiveAbout(null)}
        contentLabel="Add Comment"
        className={styles.modalAbout}
        overlayClassName={styles.modalAboutOverlay}
      >
        <div>About</div>
        <button className={styles.closeButton} onClick={() => setActiveAbout(null)}>X</button>
      </Modal>
    </div>
  );
};

export default Home;