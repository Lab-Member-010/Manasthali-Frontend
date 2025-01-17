import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import "bootstrap/dist/css/bootstrap.min.css";


const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container container text-center mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <h1 className="display-4 mb-4">Welcome to Manasthali</h1>
          <p className="lead">
            A platform to connect with people based on your personality.
          </p>
          <div className="d-grid gap-3 col-6 mx-auto mt-4">
            <button
              className="btn btn-primary btn-lg"
              onClick={() => navigate("/signup")}
            >
              Sign Up
            </button>
            <button
              className="btn btn-outline-secondary btn-lg"
              onClick={() => navigate("/signin")}
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
