import React from "react";
import { useNavigate } from "react-router-dom";

const QuizGetStarted = () => {
  const navigate = useNavigate();

  const startQuiz = () => {
    // Redirect to the actual quiz page
    navigate("/quiz");
  };

  return (
    <div className="quiz-get-started-container">
      <h2>Get Started with the Quiz</h2>
      <p>Click "Next" to begin answering questions that will help us determine your personality type.</p>
      <button onClick={startQuiz}>Next</button>
    </div>
  );
};

export default QuizGetStarted;
