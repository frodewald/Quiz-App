// src/pages/QuizPage.js
import React from 'react';
import Quiz from '../components/Quiz';
import '../styles/QuizPage.css';

const QuizPage = () => {
  return (
    <div className="quiz-page-container">
      <h2 className="quiz-page-title">Fun Quiz App</h2>
      <Quiz />
    </div>
  );
};

export default QuizPage;
