// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, redirect } from 'react-router-dom';
import { Link } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import Register from './components/Register';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH, USER_API_ENDPOINT } from './services/api';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [updateUser, setUpdateUser] = useState(false);
  const [updateUsername, setUpdateUsername] = useState('');
  const [isUpdateUserSucces, setIsUpdateUserSuccess] = useState(false);
  const [isLogoutSuccess, setIsLogoutSuccess] = useState(false);
  const [updateUsernameError, setUpdateUsernameError] = useState('');

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const response = await axios.get(CHECK_AUTH, {
          withCredentials: true,
        });
        setIsAuthenticated(response.data.authenticated);
      } catch (error) {
        console.error('Error checking authentication:', error);
        setIsAuthenticated(false);
        setUserData(null);
        if (error.response) {
          // Jika ada response dari server
          console.error('Server Error Response:', error.response.data);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (isAuthenticated) {
        try {
          const userResponse = await axios.get(USER_API_ENDPOINT.getUser, {
            withCredentials: true,
          });
          setUserData(userResponse.data.user);
          setUpdateUsername(userResponse.data.user.name || '');
          console.log(userResponse)
        } catch (error) {
          console.error('Error fetching user profile:', error);
          if (error.response) {
            // Jika ada response dari server
            console.error('Server Error Response:', error.response.data);
          }
        }
      }
    };

    fetchUserProfile();
  }, [isAuthenticated, isUpdateUserSucces]); // Bergantung pada isAuthenticated

  const handleFormUpdateUser = () => {
    setUpdateUser(!updateUser);
  }

  const updateUserDataToDB = async (e) => {
    e.preventDefault();
    if(isAuthenticated === true) {
      try{  
        const response = await axios.post(USER_API_ENDPOINT.updateUser, {
          username: updateUsername,
        }, {
          withCredentials: true
        })
        if (response.data.user && response.status === 200) {
          setIsUpdateUserSuccess(true);
          setTimeout(() => {
            setUpdateUser(false);
            setIsUpdateUserSuccess(false);
          }, 2000);
        }
      } catch (error) {
        if (error.response) {
          setUpdateUsernameError(error.response.data.message || 'An error occurred.');
          setTimeout(() => {
            setUpdateUsernameError('');
          }, 2000);
        } else if (error.request) {
          setUpdateUsernameError('No response from server. Please try again later.');
          setTimeout(() => {
            setUpdateUsernameError('');
          }, 2000);
        } else {
          setUpdateUsernameError('An error occurred. Please try again.');
          setTimeout(() => {
            setUpdateUsernameError('');
          }, 2000);
        }
      }
    }
  }

  const logout = async () => {
    try {
      const response = await axios.post(USER_API_ENDPOINT.logout, {}, {
        withCredentials: true
      })
  
      if(response.status === 200) {
        setIsLogoutSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      console.log(error);
    }
  }

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading selama status autentikasi belum selesai dicek
  }

  return (
    <>
      <Router>
      <div className='position-fixed bottom-0 end-0 p-3 m-3 bg-white shadow capsule-rounded'>
      {isAuthenticated ? (
        <div>
          <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={handleFormUpdateUser}>
            <img
              src={userData?.picture ? userData.picture : 'https://avatar.iran.liara.run/public'}
              alt="img"
              width={40}
              className="me-2 rounded-circle"
              referrerPolicy="no-referrer"
            />
            <p className="m-0 custom-text">{userData.name}</p>
          </div>
          {updateUser && (
            <div className="bg-white shadow p-3 rounded-3 mt-2" style={{ width: '100%', maxWidth: '300px' }}>
              <form onSubmit={updateUserDataToDB}>
                <div className="mb-3">
                  <label htmlFor="updateUsername" className="form-label p-1">
                    Update Name
                    {isUpdateUserSucces && (
                      <span className="text-success px-2 fw-bold rounded-2 d-inline-block fade-in-animation">
                      Success!
                      </span>
                    )}
                    {isLogoutSuccess && (
                      <span className="text-danger px-2 fw-bold rounded-2 d-inline-block fade-in-animation">
                      Logout!
                      </span>
                    )}
                    {updateUsernameError && (
                      <span className="text-danger px-2 fw-bold rounded-2 d-inline-block fade-in-animation">
                      { updateUsernameError }
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="updateUsername"
                    className="form-control"
                    placeholder="Enter new username"
                    value={updateUsername}
                    onChange={(e) => setUpdateUsername(e.target.value)}
                  />
                </div>
                <button type='submit' className="btn btn-primary mb-1 d-block my-0 mx-auto w-100">Update</button>
              </form>
              <button className="btn btn-danger d-block my-0 mx-auto w-100" onClick={logout}>Logout</button>
            </div>
          )}
        </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
        <Routes>
          <Route path="/" exact element={<Home/>} />
          <Route path="/login" element={isAuthenticated ? <Navigate to='/' /> : <Login setIsAuthenticated={setIsAuthenticated}/>} />
          <Route path="/register" element={isAuthenticated ? <Navigate to='/' /> : <Register setIsAuthenticated={setIsAuthenticated}/>} />
          <Route
            path="/quiz"
            element={!isAuthenticated ? <Navigate to='/login' /> : <QuizPage />}
          />
          <Route
            path="/result"
            element={!isAuthenticated ? <Navigate to='/login' /> : <ResultPage />}
          />
        </Routes>
      </Router>
    </>
  );
};

export default App;
