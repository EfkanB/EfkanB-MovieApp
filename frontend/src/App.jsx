import { useState, useEffect } from 'react';
import Header from './components/Header';
import AuthForm from './components/AuthForm';
import Showcase from './components/Showcase';
import MovieList from './components/MovieList';
import AccountPanel from './components/AccountPanel';
import AdminDashboard from './components/AdminDashboard';
import ResetPassword from './components/ResetPassword';


import HowItWorks from './components/HowItWorks';
import Features from './components/Features';
import Plans from './components/Plans';
import BackToTop from './components/BackToTop';
import Footer from './components/Footer';
import './App.css';

// MovieList'ten tetiklenen global event (giriş sayfasına yönlendirme)
import { attachOpenAuthListener } from './components/openAuthListener';


function App() {
  const [view, setView] = useState('home');
  const [showAuth, setShowAuth] = useState(false);
  // Giriş bilgileri sayfa açılırken localStorage'dan okunur
  const [token, setToken] = useState(() => localStorage.getItem('authToken'));
  const [username, setUsername] = useState(() => localStorage.getItem('username'));
  const [role, setRole] = useState(() => localStorage.getItem('role'));
  const [accountSection, setAccountSection] = useState('details');
  const [searchQuery, setSearchQuery] = useState('');
  const [contentType, setContentType] = useState('all'); // 'all', 'movies', 'series'

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

  // Listeye kaydır (liste yeniden çizildikten sonra)
  const scrollToList = () => {
    requestAnimationFrame(() => document.getElementById('icerikler')?.scrollIntoView());
  };

  const handleSeriesClick = () => {
    setView('home');
    setContentType('series');
    setShowAuth(false);
    scrollToList();
  };

  const handleMoviesClick = () => {
    setView('home');
    setContentType('movies');
    setShowAuth(false);
    scrollToList();
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

  useEffect(() => {
    // MovieList'te “giriş yapın” ctasına basınca AuthForm'u aç
    const detach = attachOpenAuthListener(() => {
      setShowAuth(true);
    });
    return () => detach();
  }, []);

  const isSearching = searchQuery.trim().length > 0;
  const activeNav = showAuth
    ? null
    : view === 'admin'
      ? 'admin'
      : view === 'home' && contentType !== 'all'
        ? contentType
        : null;

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
        activeNav={activeNav}
      />
      <main>
        {window.location.pathname === '/reset-password' ? (
          <ResetPassword />
        ) : showAuth ? (
          <AuthForm onClose={handleCloseAuth} onAuthSuccess={handleAuthSuccess} />
        ) : view === 'account' ? (
          <AccountPanel key={accountSection} token={token} username={username} initialSection={accountSection} />
        ) : view === 'admin' ? (
          <AdminDashboard token={token} />

        ) : (
          <>
            {!isSearching && <Showcase isLoggedIn={!!token} />}
            <MovieList key={username || 'misafir'} token={token} username={username} role={role} searchQuery={searchQuery} contentType={contentType} />
            {!isSearching && (
              <>
                <HowItWorks />
                <Features />
                <Plans />
              </>
            )}
          </>
        )}
      </main>
      <Footer onMoviesClick={handleMoviesClick} onSeriesClick={handleSeriesClick} />
      {!showAuth && <BackToTop />}
    </div>
  );
}

export default App;
