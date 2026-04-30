import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import Showcase from './components/Showcase';
import MovieList from './components/MovieList';
import AccountPanel from './components/AccountPanel';
import AdminPanel from './components/AdminPanel';
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
  const [role, setRole] = useState(null);
  const [accountSection, setAccountSection] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('all'); // 'all', 'movies', 'series'

  // Sayfa yüklendiğinde localStorage'dan giriş bilgilerini yükle
  useEffect(() => {
    const savedToken = localStorage.getItem('authToken');
    const savedUsername = localStorage.getItem('username');
    const savedRole = localStorage.getItem('role');

    if (savedToken && savedUsername) {
      setToken(savedToken);
      setUsername(savedUsername);
      setRole(savedRole);
    }
  }, []);

  const handleLoginClick = () => {
    setShowAuth(true);
  };

  const handleAccountClick = () => {
    if (token) {
      setAccountSection('details');
      setView('account');
    } else {
      setShowAuth(true);
    }
  };

  const handleFavoritesClick = () => {
    if (token) {
      setAccountSection('favorites');
      setView('account');
    } else {
      setShowAuth(true);
    }
  };

  const handleAdminClick = () => {
    setView('admin');
    setShowAuth(false);
  };

  const handleAuthSuccess = (loggedUsername, authToken, userRole) => {
    setUsername(loggedUsername);
    setToken(authToken);
    setRole(userRole);
    setShowAuth(false);
    setView('home');
    window.scrollTo(0, 0);

    // Giriş bilgilerini localStorage'a kaydet
    localStorage.setItem('authToken', authToken);
    localStorage.setItem('username', loggedUsername);
    localStorage.setItem('role', userRole);
  };

  const handleCloseAuth = () => {
    setShowAuth(false);
  };

  const handleHomeClick = () => {
    setView('home');
    setContentType('all');
    setShowAuth(false);
  };

  const handleSeriesClick = () => {
    setView('home');
    setContentType('series');
    setShowAuth(false);
  };

  const handleMoviesClick = () => {
    setView('home');
    setContentType('movies');
    setShowAuth(false);
  };

  const handleLogout = () => {
    setToken(null);
    setUsername(null);
    setRole(null);
    setView('home');

    // localStorage'dan giriş bilgilerini temizle
    localStorage.removeItem('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
  };

  return (
    <div id="body">
      <Header
        onLoginClick={handleLoginClick}
        onHomeClick={handleHomeClick}
        onSeriesClick={handleSeriesClick}
        onMoviesClick={handleMoviesClick}
        onAdminClick={handleAdminClick}
        onAccountClick={handleAccountClick}
        onFavoritesClick={handleFavoritesClick}
        onLogout={handleLogout}
        isLoggedIn={!!token}
        username={username}
        role={role}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <main>
        {showAuth ? (
          <AuthForm onClose={handleCloseAuth} onAuthSuccess={handleAuthSuccess} />
        ) : view === 'account' ? (
          <AccountPanel token={token} username={username} initialSection={accountSection} />
        ) : view === 'admin' ? (
          <AdminPanel token={token} username={username} />
        ) : (
          <>
            <Showcase />
            <MovieList token={token} username={username} searchQuery={searchQuery} contentType={contentType} />
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
