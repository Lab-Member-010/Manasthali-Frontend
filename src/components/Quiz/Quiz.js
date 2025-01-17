import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";  // Import Toastify
import "react-toastify/dist/ReactToastify.css"; // Import Toastify styles
import Api from "../../apis/Api";
import "./Quiz.css";

const questions = [
  "How much do you enjoy socializing with new people?",
  "Do you feel drained after socializing, even in small groups?",
  "How often do you seek out new experiences?",
  "Do you often plan your activities in advance?",
  "How often do you prefer staying at home rather than going out?",
  "Are you usually the one to start conversations at a social gathering?",
  "Do you value harmony and avoid conflict at all costs?",
  "Do you tend to focus on the details rather than the big picture?",
  "How do you respond to criticism?",
  "Do you prefer working alone rather than in a group?",
  "How often do you feel anxious or nervous about the future?",
  "Do you enjoy brainstorming new ideas or concepts?",
  "Are you more of a 'doer' than a 'thinker'?",
  "How often do you find yourself taking charge in group situations?",
  "Do you often make decisions based on your feelings rather than logic?",
  "Are you careful about spending money?",
  "How often do you feel overwhelmed by your emotions?",
  "Do you find it easy to adapt to new situations?",
  "Do you prefer following established rules or making your own?",
  "How often do you seek out intellectual challenges?",
  "How often do you help others without expecting anything in return?",
  "Do you find it difficult to relax even when you have free time?",
  "How often do you follow through on your commitments?",
  "Do you enjoy trying new foods or cuisines?",
  "Are you more likely to trust others easily?",
  "How do you react to unexpected changes in plans?",
  "Do you feel uncomfortable when people express emotions openly?",
  "Do you prefer detailed plans over spontaneity?",
  "How important is it for you to have a routine?",
  "Do you prefer to avoid conflict even if you disagree with someone?",
  "Do you feel at ease in large social gatherings?",
  "How often do you feel a sense of accomplishment after completing a task?",
  "Do you often feel the need to be in control of situations?",
  "How often do you find yourself worrying about your performance or success?",
  "Are you more comfortable with facts and data than with abstract ideas?"
];

const options = [
  "Strongly Agree",
  "Agree",
  "Average",
  "Disagree",
  "Strongly Disagree"
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [isLoading, setIsLoading] = useState(false);

  const { token, isLoggedIn } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const calculateScores = (answers) => {
    const scores = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };
    scores.E_I += answers[0] + answers[1] + answers[2] + answers[3]; // Extraversion
    scores.E_I -= answers[16] + answers[17] + answers[18] + answers[19]; // Introversion
    scores.S_N += answers[4] + answers[5] + answers[6] + answers[7]; // Sensing
    scores.S_N -= answers[20] + answers[21] + answers[22] + answers[23]; // Intuition
    scores.T_F += answers[8] + answers[9] + answers[10] + answers[11]; // Thinking
    scores.T_F -= answers[24] + answers[25] + answers[26] + answers[27]; // Feeling
    scores.J_P += answers[12] + answers[13] + answers[14] + answers[15]; // Judging
    scores.J_P -= answers[28] + answers[29] + answers[30] + answers[31]; // Perceiving
    return scores;
  };

  const getPersonalityType = (scores) => {
    const personality = [];
    personality.push(scores.E_I > 0 ? 'E' : 'I');
    personality.push(scores.S_N > 0 ? 'S' : 'N');
    personality.push(scores.T_F > 0 ? 'T' : 'F');
    personality.push(scores.J_P > 0 ? 'J' : 'P');
    return personality.join('');
  };

  const handleOptionSelect = (index, answer) => {
    const newAnswers = [...answers];
    newAnswers[index] = answer;
    setAnswers(newAnswers);
  };

  const handleSubmit = async () => {
    if (answers.includes(null)) {
      toast.error("Please answer all the questions before submitting.");
      return;
    }

    const scores = calculateScores(answers);
    const personality = getPersonalityType(scores);
    setIsLoading(true);

    try {
      if (!isLoggedIn || !token) {
        toast.error("You are not logged in. Please log in first.");
        setIsLoading(false);
        return;
      }

      const quizResponse = await axios.post(
        Api.SUBMIT_QUIZ,
        { answers },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (quizResponse.status !== 200) throw new Error("Error submitting quiz.");

      toast.success("Quiz submitted successfully!");
      setIsLoading(false);
      navigate("/feed");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("There was an error submitting the quiz. Please try again.");
      setIsLoading(false);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(currentQuestionIndex - 1);
  };

  const goToNext = () => {
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  return (
    <div className="quiz-container">
      <div className="question-container">
        <div id="question" className="question">
          {questions[currentQuestionIndex]}
        </div>
        <div className="options">
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleOptionSelect(currentQuestionIndex, idx + 1)}
              style={{
                backgroundColor: answers[currentQuestionIndex] === idx + 1 ? "#007bff" : "#ccc",
              }}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="navigation-buttons">
          <button onClick={goToPrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </button>
          {currentQuestionIndex === questions.length - 1 ? (
            <button onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Quiz"}
            </button>
          ) : (
            <button onClick={goToNext}>Next</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
