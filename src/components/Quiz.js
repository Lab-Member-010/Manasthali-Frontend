import React, { useState } from 'react';

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
  "Are you more comfortable with facts and data than with abstract ideas?",
];

const Quiz = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [personalityType, setPersonalityType] = useState('');

  const calculateScores = (answers) => {
    const scores = { E_I: 0, S_N: 0, T_F: 0, J_P: 0 };

    // Add points for each score based on answers
    scores.E_I += answers[0] + answers[1] + answers[2] + answers[3];
    scores.E_I -= answers[16] + answers[17] + answers[18] + answers[19];

    scores.S_N += answers[4] + answers[5] + answers[6] + answers[7];
    scores.S_N -= answers[20] + answers[21] + answers[22] + answers[23];

    scores.T_F += answers[8] + answers[9] + answers[10] + answers[11];
    scores.T_F -= answers[24] + answers[25] + answers[26] + answers[27];

    scores.J_P += answers[12] + answers[13] + answers[14] + answers[15];
    scores.J_P -= answers[28] + answers[29] + answers[30] + answers[31];

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

  const calculateAndDisplayResults = () => {
    const scores = calculateScores(answers);
    const personality = getPersonalityType(scores);
    setPersonalityType(personality); // Update the personalityType
  };

  const submitAnswer = (answer) => {
    const updatedAnswers = [...answers, answer];
    setAnswers(updatedAnswers); // Update answers

    // Proceed to next question or show result if it's the last question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      calculateAndDisplayResults(); // Calculate and display personality when all questions are answered
    }
  };

  return (
    <div className="App">
      <div className="question-container">
        {personalityType ? (
          <div id="result" className="result">
            Your personality type is: {personalityType}
          </div>
        ) : (
          <div>
            <div id="question" className="question">
              {questions[currentQuestionIndex]}
            </div>
            <div className="options">
              {[1, 2, 3, 4].map((option) => (
                <button key={option} onClick={() => submitAnswer(option)}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Quiz;