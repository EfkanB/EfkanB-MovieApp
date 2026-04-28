import React, { useState } from 'react';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import Showcase from './components/Showcase';
import MovieList from './components/MovieList';
import AccountPanel from './components/AccountPanel';
import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Plans from './components/Plans';
import BackToTop from './components/BackToTop';
import './App.css';

function App() {
  const [view, setView] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  const [token, setToken] = useState(null);
  const [username, setUsername] = useState(null);

  const handleLoginClick = () => {
    setShowAuth(true);
  };

  const handleAccountClick = () => {
    if (token) {
      setView('account');
    } else {
      setShowAuth(true);
    }
  };

  const handleAuthSuccess = (loggedUsername, authToken) => {
    setUsername(loggedUsername);
    setToken(authToken);
    setShowAuth(false);
    setView('home');
    window.scrollTo(0, 0);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const handleHomeClick = () => {
    setView('home');
    setShowAuth(false);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setView('home');
  };

  return (
    <div id="body">
      <Header
        onLoginClick={handleLoginClick}
        onHomeClick={handleHomeClick}
        onAccountClick={handleAccountClick}
        onLogout={handleLogout}
        isLoggedIn={!!token}
        username={username}
      />
      <main>
        {showAuth ? (
          <AuthForm onClose={handleCloseAuth} onAuthSuccess={handleAuthSuccess} />
        ) : view === 'account' ? (
          <AccountPanel token={token} username={username} />
        ) : (
          <>
            <Showcase />
            <MovieList token={token} />
            <HowItWorks />
            <Features />
            <Plans />
          </>
        )}
      </main>
      {!showAuth && <BackToTop />}
    </div>
  );
}

export default App;
