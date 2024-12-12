// src/pages/ResultPage.js
import React from 'react';
import Result from '../components/Result';
import '../styles/ResultPage.css';

const ResultPage = () => {
  return (
    <div className='result-page-container'>
      <h2 className="result-title">Quiz Result</h2>
      <Result />
    </div>
  );
};

export default ResultPage;
