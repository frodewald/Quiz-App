// src/components/Quiz.js
import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Question from './Question';
import '../styles/Quiz.css';
import { RECORD_API_ENDPOINT } from '../services/api';

const Quiz = () => {
  const quizTime = 120;
  const total_question = 10;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [correctScore, setCorrectScore] = useState(0);
  const [timer, setTimer] = useState(quizTime); 
  const navigate = useNavigate();
  const [startQuizTime, setStartQuizTime] = useState(Date.now());

  const scoreRef = useRef(correctScore);
  const currentQuestionIndexRef = useRef(currentQuestionIndex);
  const timerRef = useRef(timer);

  // Load saved quiz state from localStorage if available
  useEffect(() => {
    const savedQuiz = JSON.parse(localStorage.getItem('quiz'));
    if (savedQuiz && savedQuiz.questions && savedQuiz.questions.length > 0) {
      setQuestions(savedQuiz.questions);
      setCurrentQuestionIndex(savedQuiz.currentQuestionIndex);
      setCorrectScore(savedQuiz.score);
      const timeElapsed = Math.min(
        Math.floor((Date.now() - savedQuiz.startTime) / 1000),
        savedQuiz.timer
      );
      setTimer(Math.max(savedQuiz.timer - timeElapsed, 0));
    } else {
      fetchQuestions();
    }
  }, []);

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      const res = await axios.get(`https://opentdb.com/api.php?amount=${total_question}&type=multiple`);
      if (res.data.results && res.data.results.length > 0) {
        setQuestions(res.data.results);
      } else {
        console.error('No questions found in API response.');
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  // Save quiz state to localStorage whenever it changes
  useEffect(() => {
    // console.log('Saving quiz state:', { questions, currentQuestionIndex, score, timer });
      const handleBeforeUnload = () => {
        const quizData = {
          questions,
          currentQuestionIndex,
          correctScore,
          timer: timerRef.current,
          startTime: startQuizTime - (quizTime - timerRef.current) * 1000
        }
      
      localStorage.setItem('quiz', JSON.stringify(quizData));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [questions, currentQuestionIndex, correctScore]);

  // Save timer
  useEffect(() => {
    const savedQuiz = JSON.parse(localStorage.getItem('quiz'));
    if (savedQuiz) {
      savedQuiz.timer = timer;
      // console.log('Updating timer in localStorage:', savedQuiz);
      localStorage.setItem('quiz', JSON.stringify(savedQuiz));
    }
  }, [timer]);

  // Update refs when state changes
  useEffect(() => {
    scoreRef.current = correctScore;
    currentQuestionIndexRef.current = currentQuestionIndex;
    timerRef.current = timer;
  }, [correctScore, currentQuestionIndex, timer]);
  
  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          endQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // handle scoring
  const handleAnswer = (isCorrect) => {
    if (isCorrect) setCorrectScore(correctScore + 1);
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      endQuiz();
    }
  };

  const calculateFinalScore = () => {
    const endQuizTime = Date.now();
    localStorage.setItem('quizCooldown', endQuizTime);
    
    const elapsedTime = (endQuizTime - startQuizTime) / 1000;
    const HighestScore = 1000;

    const maxSpeedScorePerCorrectAnswer = HighestScore * 0.2 / total_question;
    const correctAnswerScore = correctScore * (HighestScore * 0.8 / total_question);

    const speedScorePerCorrect = correctScore > 0 
        ? (maxSpeedScorePerCorrectAnswer) * ((quizTime - elapsedTime) / quizTime) 
        : 0;

    const totalSpeedScore = correctScore > 0 
        ? Math.min(maxSpeedScorePerCorrectAnswer, speedScorePerCorrect * correctScore)
        : 0;

    const finalScore = (correctAnswerScore + totalSpeedScore).toFixed(2);

    return parseFloat(finalScore);
  };

  const endQuiz = async () => {
    try {
      const finalScore = calculateFinalScore();
      // console.log('Final Score:', finalScore);

      const response = await axios.post(RECORD_API_ENDPOINT.postRecord, {
        score: finalScore,
        time_spent: quizTime - timer,
        total_question: total_question,
        correct_answer: correctScore,
        wrong_answer: total_question - correctScore 
      }, {
        withCredentials: true
      });

      setStartQuizTime(null);
      localStorage.removeItem('quiz');
      navigate('/result');
    } catch (err) {

    }
  };

  const currentQuestion = questions[currentQuestionIndex];
  const shuffledAnswers = useMemo(() => {
    if (!currentQuestion) return [];
    const answers = [currentQuestion.correct_answer, ...currentQuestion.incorrect_answers];
    return answers.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);

  return (
    <div className="quiz-container">
      {questions.length > 0 ? (
        <>
          <div className="quiz-info">
            <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
            <span>Time Left: {timer}s</span>
          </div>
          <Question
            data={currentQuestion}
            shuffledAnswers={shuffledAnswers}
            handleAnswer={handleAnswer}
            timer={timer}
          />
        </>
      ) : (
        <div className="loading">Loading...</div>
      )}
    </div>
  );
};

export default Quiz;
