// src/App.js
import React, {Suspense, useMemo, lazy} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './components/Login';
import QuizPage from './pages/QuizPage';
import ResultPage from './pages/ResultPage';
import Register from './components/Register';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { CHECK_AUTH, USER_API_ENDPOINT } from './services/api';
import { Skeleton } from '@mui/material';
import { useUpdateUserContext } from './context/UpdateUserContext';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [updateUser, setUpdateUser] = useState(false);
  const [updateUsername, setUpdateUsername] = useState('');
  const { isUpdateUserSuccess, setIsUpdateUserSuccess } = useUpdateUserContext();
  const [isLogoutSuccess, setIsLogoutSuccess] = useState(false);
  const [updateUsernameError, setUpdateUsernameError] = useState('');
  const [loadingUpdateUser, setLoadingUpdateUser] = useState(false);
  const UserWidget = useMemo(() => lazy(() => import('./components/UserWidget')), []);

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
      if (isAuthenticated || isUpdateUserSuccess) {
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
  }, [isAuthenticated, isUpdateUserSuccess]); // Bergantung pada isAuthenticated

  const handleFormUpdateUser = () => {
    setUpdateUser(!updateUser);
  }

  const updateUserDataToDB = async (e) => {
    e.preventDefault();
    setLoadingUpdateUser(true);
    if(isAuthenticated === true) {
      try{  
        const response = await axios.post(USER_API_ENDPOINT.updateUser, {
          username: updateUsername,
        }, {
          withCredentials: true
        })
        if (response.data.user && response.status === 200) {
          setLoadingUpdateUser(false);
          setIsUpdateUserSuccess(true);
          setTimeout(() => {
            setUpdateUser(false);
            setIsUpdateUserSuccess(false);
          }, 2000);
        }
      } catch (error) {
        setLoadingUpdateUser(false);
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
    setLoadingUpdateUser(true);
    try {
      const response = await axios.post(USER_API_ENDPOINT.logout, {}, {
        withCredentials: true
      })
  
      if(response.status === 200) {
        setLoadingUpdateUser(false);
        setIsLogoutSuccess(true);
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      setLoadingUpdateUser(false);
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

  if (loading) {
    return <div>Loading...</div>; // Tampilkan loading selama status autentikasi belum selesai dicek
  }

  return (
    <>
      <Router>
      <div className='position-fixed bottom-0 end-0 p-3 m-3 bg-white shadow capsule-rounded z-3'>
        <Suspense fallback={<Skeleton variant="rounded" animation="wave" width="7vw" height="5vh"/>}>
          <UserWidget
            isAuthenticated={isAuthenticated}
            userData={userData}
            updateUser={updateUser}
            setUpdateUser={setUpdateUser}
            updateUsername={updateUsername}
            setUpdateUsername={setUpdateUsername}
            isUpdateUserSuccess={isUpdateUserSuccess}
            isLogoutSuccess={isLogoutSuccess}
            updateUsernameError={updateUsernameError}
            handleFormUpdateUser={handleFormUpdateUser}
            updateUserDataToDB={updateUserDataToDB}
            loadingUpdateUser={loadingUpdateUser}
            logout={logout}
          />
        </Suspense>
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
