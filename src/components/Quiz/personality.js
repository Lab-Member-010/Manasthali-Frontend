import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./personality.css";

const Personality = () => {
  const location = useLocation();
  const personality = location.state?.personality || "Unknown";
  const navigate=useNavigate();

  const handleSubmit= ()=>{
    navigate("/feed");
  }

  return (
    <div className="type-container">
      {/* <img
        src="https://i.pinimg.com/originals/cf/85/d9/cf85d966c302f3728a0e8f81805c132a.gif"
        alt="Background"
        className="background-image"
      /> */}
     
        <h2>Hey, your personality type is:</h2>
        <h1>{personality}</h1>
        <button type="submit" className="nextButton" onClick={()=>handleSubmit()}>Next</button>
    </div>
  );
};

export default Personality;
