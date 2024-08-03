// src/components/Question.js
import React from 'react';
import '../styles/Question.css';

const Question = ({ data, shuffledAnswers, handleAnswer, timer }) => {
  const { question, correct_answer } = data;

  return (
    <div className="question-container">
      <h3 className="question-text">{question}</h3>
      <div className="answers-container">
        {shuffledAnswers.map((answer, index) => (
          <button 
            key={index} 
            onClick={() => handleAnswer(answer === correct_answer)}
            className="answer-button"
          >
            {answer}
          </button>
        ))}
      </div>
      <div className="timer">Time Left: {timer}s</div>
    </div>
  );
};

export default Question;
