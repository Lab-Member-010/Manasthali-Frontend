import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="background-container">
      <div className="home-container">
        <h3 className="display-4 mb-4 gradient-text">Welcome to Manasthali</h3>
        <p className="lead gradient-text " >
          A platform to connect with people based on your personality.
        </p>
        <div className="d-grid gap-3 mt-4 ">
          <button
            className="btn btn-outline-secondary btn-lg custom-btn gradient-text"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </button>
          <button
            className="btn btn-outline-secondary btn-lg custom-btn gradient-text"
            onClick={() => navigate("/signin")}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;