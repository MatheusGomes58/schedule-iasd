import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/loginPage';
import SchedulePage from './pages/schedulePage';
import AuthProvider from './components/firebase/authProvider';

function App() {
  return (
    <Router>
      <AuthProvider>
        {({ user, handleLogin, userPrivileges }) => (
          <Routes>
            <Route
              path="/"
              element={<LoginPage onLogin={handleLogin} />}
            />
            <Route
              path="/schedulepage"
              element={<SchedulePage user={user} sendUserPrivileges={userPrivileges} />}
            />
          </Routes>
        )}
      </AuthProvider>
    </Router>
  );
}

export default App;
