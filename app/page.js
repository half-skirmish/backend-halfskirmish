'use client';
import { useState } from 'react';
import LoginPage from './Screens/Login';
import Dashboard from './Screens/Dashboard';

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  return (
    <div>
      {!isLoggedIn ? (
        <LoginPage onLogin={handleLogin} />
      ) : (
        <Dashboard />
      )}
    </div>
  );
}
