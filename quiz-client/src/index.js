import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UpdateUserProvider } from './context/UpdateUserContext';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UpdateUserProvider>
      <App />
    </UpdateUserProvider>
  </React.StrictMode>
);
