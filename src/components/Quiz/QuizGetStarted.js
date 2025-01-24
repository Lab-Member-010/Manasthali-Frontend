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
      {/* <img
        src="https://i.pinimg.com/originals/cf/85/d9/cf85d966c302f3728a0e8f81805c132a.gif"
        alt="Background"
        className="background-image"
      /> */}
      <h2>Unleash Your Inner Self!</h2>
      <p>Are you ready to discover your true personality? Click the arrow to embark on this exciting journey!</p>
      <button onClick={startQuiz} className="next-button">Lets Begin
      <HiArrowSmRight />
      </button>
    </div>
  );
};

export default QuizGetStarted;