// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" exact element={<Home/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/quiz" element={<QuizPage/>} />
        <Route path="/result" element={<ResultPage/>} />
      </Routes>
    </Router>
  );
};

export default App;
