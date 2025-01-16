import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <h1>Welcome to the App</h1>
      <button onClick={() => navigate("/signup")}>Sign Up</button>
      <button onClick={() => navigate("/signin")}>Sign In</button>
    </div>
  );
};

export default Home;
