import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import SchedulePage from './pages/schedulePage';
import AuthProvider from './components/firebase/authProvider';

function App() {
  return (
    <Router>
      <AuthProvider>
        {({ user, handleLogin }) => (
          <Routes>
            <Route
              path="/login"
              element={<LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/"
              element={<SchedulePage user={user} />}
            />
          </Routes>
        )}
      </AuthProvider>
    </Router>
  );
}

export default App;
