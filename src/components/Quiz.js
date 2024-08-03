// src/components/Quiz.js
import React, { useEffect, useState, useMemo, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Question from './Question';
import '../styles/Quiz.css';

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(300); 
  const navigate = useNavigate();

  const scoreRef = useRef(score);
  const currentQuestionIndexRef = useRef(currentQuestionIndex);
  const timerRef = useRef(timer);

  // Load saved quiz state from localStorage if available
  useEffect(() => {
    const savedQuiz = JSON.parse(localStorage.getItem('quiz'));
    if (savedQuiz && savedQuiz.questions && savedQuiz.questions.length > 0) {
      console.log('Loading saved quiz:', savedQuiz);
      setQuestions(savedQuiz.questions);
      setCurrentQuestionIndex(savedQuiz.currentQuestionIndex);
      setScore(savedQuiz.score);
      setTimer(savedQuiz.timer);
    } else {
      fetchQuestions();
    }
  }, []);

  // Fetch questions from API
  const fetchQuestions = async () => {
    try {
      const res = await axios.get('https://opentdb.com/api.php?amount=10&type=multiple');
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
    console.log('Saving quiz state:', { questions, currentQuestionIndex, score, timer }); // Tambahkan log
      const handleBeforeUnload = () => {
        const quizData = {
          questions,
          currentQuestionIndex,
          score,
          timer: timerRef.current,
        }
      
      localStorage.setItem('quiz', JSON.stringify(quizData));
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [questions, currentQuestionIndex, score]);

  // Save timer
  useEffect(() => {
    const savedQuiz = JSON.parse(localStorage.getItem('quiz'));
    if (savedQuiz) {
      savedQuiz.timer = timer;
      console.log('Updating timer in localStorage:', savedQuiz);
      localStorage.setItem('quiz', JSON.stringify(savedQuiz));
    }
  }, [timer]);

  // Update refs when state changes
  useEffect(() => {
    scoreRef.current = score;
    currentQuestionIndexRef.current = currentQuestionIndex;
    timerRef.current = timer;
  }, [score, currentQuestionIndex, timer]);
  
  // Timer logic
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        console.log('Timer:', prev);
        if (prev === 0) {
          clearInterval(interval);
          endQuiz();
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleAnswer = (isCorrect) => {
    if (isCorrect) setScore(score + 1);
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      endQuiz();
    }
  };

  const endQuiz = () => {
    localStorage.removeItem('quiz');
    navigate('/result', { state: { score: scoreRef.current, total: currentQuestionIndexRef.current + 1 } });
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
