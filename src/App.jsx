// App.jsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import SchedulePage from './pages/schedulePage';
import { signInWithEmailAndPassword } from './components/firebase/auth';

function App() {

  const handleLogin = async (email, password, navigate) => {
    try {
      await signInWithEmailAndPassword(email, password, navigate);
    } catch (error) {
    }
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<LoginPage onLogin={(email, password) => handleLogin(email, password)} />}
        />
        <Route
          path="/schedulepage"
          element={localStorage.getItem('currentEmail') ? <SchedulePage /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
