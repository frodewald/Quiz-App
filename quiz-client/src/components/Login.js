// src/components/Login.js
import React, { useState } from 'react';
import '../styles/Login.css';
import axios from 'axios';
import { USER_API_ENDPOINT } from '../services/api';
import { BASE_URL } from '../services/api';
import { Bars } from 'react-loading-icons';

const Login = ({ setIsAuthenticated }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const response = await axios.post(
        USER_API_ENDPOINT.login,
        { email, password },
        { withCredentials: true }
      );
  
      if (response.data.user && response.status === 200) {
        setLoading(false);
        setSuccess(response.data.message)
        localStorage.removeItem('quiz');
        setIsAuthenticated(true);
      }
    } catch (error) {
      setLoading(false);
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
      <h1>Login</h1>
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
      {loading &&
       <div className='w-100 m-auto text-center'>
         <Bars fill='black'width={20} height={20} />
       </div>
      }
        <label className="login-label">
          Email:
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value.toLowerCase())}
            className="login-input"
          />
        </label>
        <label className="login-label">
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
        </label>
        <button type="submit" className="login-button">Login</button>
        <p className='text-center' style={{marginTop: '16px'}}>Atau</p>
        {/* Tombol Google */}
        <button
          type="button"
          className="d-flex align-items-center justify-content-center bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-md hover:bg-gray-100 transition duration-300"
          style={{ width: '100%' }}
          onClick={() => window.location.href = `${BASE_URL}/auth/google`}
        >
          <img src='google.svg' alt='google' width={30} />
          <span className="text-gray-700 font-semibold">Login with Google</span>
        </button>
        <div className='d-flex justify-content-center mt-2'>
          <p>Haven't register yet? </p>
          <a href='/register' className='ms-1'> Register Here</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
