import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';
import { USER_API_ENDPOINT } from '../services/api';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [confirmpass, setConfirmpass] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(USER_API_ENDPOINT.register, {
        username: username,
        email: email,
        password: password,
        confirmpass: confirmpass
      }, {
        withCredentials: true
      })
      if (response.data.user && response.status === 201) {
        setIsAuthenticated(true);
        localStorage.removeItem('quiz');
        setSuccess(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'An error occurred.');
      } else if (error.request) {
        setError('No response from server. Please try again later.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit} className="login-form">
      {error &&
        <div className='p-1 bg-danger rounded-2 p-2 mb-4'>
          <p className="text-response">{error}</p>
        </div>
      }
      {success &&
        <div className='p-1 bg-success rounded-2 p-2 mb-4'>
          <p className="text-response">{success}</p>
        </div>
      }
        <label className="login-label">
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="login-input"
            required
          />
        </label>
        <label className="login-label">
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
            required
          />
        </label>
        <label className="login-label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
            required
          />
        </label>
        <label className="login-label">
          Confirm Password:
          <input
            type="password"
            value={confirmpass}
            onChange={(e) => setConfirmpass(e.target.value)}
            className="login-input"
            required
          />
        </label>
        <button type="submit" className="login-button">Register</button>
        <p className='text-center' style={{marginTop: '16px'}}>Atau</p>
        {/* Tombol Google */}
        <button
          type="button"
          className="d-flex align-items-center justify-content-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-md hover:bg-gray-100 transition duration-300"
          style={{ width: '100%' }}
          onClick={() => window.location.href = 'http://localhost:8000/auth/google'}
        >
          <img src='google.svg' alt='google' width={30} />
          <span className="text-gray-700 font-semibold">Login with Google</span>
        </button>
        <div className='d-flex justify-content-center mt-2'>
          <p>Already register?</p>
          <a href='/login' className='ms-1'>Login here</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
