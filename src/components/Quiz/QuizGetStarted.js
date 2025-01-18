import React from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./QuizGetStarted.css"; 
import { HiArrowSmRight } from "react-icons/hi";

const QuizGetStarted = () => {
  const navigate = useNavigate();

  const startQuiz = () => {
    navigate("/quiz");
  };

  return (
    <div className="quiz-get-started-container">
      <img
        src="https://cdn.pixabay.com/photo/2020/10/01/17/57/man-5619304_640.jpg"
        alt="Background"
        className="background-image"
      />
      <h2>Unleash Your Inner Self!</h2>
      <p>Are you ready to discover your true personality? Click the arrow to embark on this exciting journey!</p>
      <button onClick={startQuiz} className="next-button">
      <HiArrowSmRight />
      </button>
    </div>
  );
};

export default QuizGetStarted;
