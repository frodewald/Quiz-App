// src/components/Result.js
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Result.css';

const Result = () => {
  const location = useLocation();
  const { score, total } = location.state || {};
  const navigate = useNavigate();

  const wrongAnswer = total - score;

  const handleGoHome = () => {
    localStorage.removeItem('quiz');
    navigate('/');
  };

  return (
    <div className="result-container">
      <h2 className="result-title">Quiz Result</h2>
      <div className="result-stats">
        <div className="result-card correct">
          <div className="result-card-icon">✔️</div>
          <div className="result-card-content">
            <h3>Jumlah Benar</h3>
            <p>{score}</p>
          </div>
        </div>
        <div className="result-card wrong">
          <div className="result-card-icon">❌</div>
          <div className="result-card-content">
            <h3>Jumlah Salah</h3>
            <p>{wrongAnswer}</p>
          </div>
        </div>
        <div className="result-card total">
          <div className="result-card-icon">📋</div>
          <div className="result-card-content">
            <h3>Total Soal</h3>
            <p>{total}</p>
          </div>
        </div>
      </div>
      <button className="result-button" onClick={handleGoHome}>Go Home</button>
    </div>
  );
};

export default Result;
