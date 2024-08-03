// src/pages/Home.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Home.css'

const Home = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const username = localStorage.getItem('username');
    if (username) {
      navigate('/quiz');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="home-container">
      <h1 className="home-title">Fun Quiz App</h1>
      <button onClick={handleStart} className="home-button">Start Quiz</button>
    </div>
  );
};

export default Home;
