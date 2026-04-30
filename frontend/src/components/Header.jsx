import React from 'react';
import './Header.css';

const Header = ({ onLoginClick, onHomeClick, onSeriesClick, onMoviesClick, onAdminClick, onAccountClick, onFavoritesClick, onLogout, isLoggedIn, username, role, searchQuery, onSearchChange }) => {
  return (
    <header className="main-header">
      <a
        href="#"
        className="main-header__logo"
        onClick={(event) => {
          event.preventDefault();
          onHomeClick();
        }}
      >
        MovieApp
      </a>
      <div className="header-search">
        <input
          type="search"
          className="header-search__input"
          placeholder="Film veya dizi ara..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <nav className="main-nav">
        <ul className="main-nav__items">
          <li className="main-nav__item">
            <a href="#" onClick={(event) => { event.preventDefault(); onMoviesClick(); }}>
              Filmler
            </a>
          </li>
          <li className="main-nav__item">
            <a href="#" onClick={(event) => { event.preventDefault(); onSeriesClick(); }}>
              Diziler
            </a>
          </li>
          {role === 'ADMIN' && (
            <li className="main-nav__item">
              <a href="#" onClick={(event) => { event.preventDefault(); onAdminClick(); }}>
                İçerik Ekle
              </a>
            </li>
          )}
          <li className="main-nav__item main-nav__item--login">
            {isLoggedIn ? (
              <div className="account-actions">
                <button
                  type="button"
                  className="btn btn-icon"
                  onClick={onFavoritesClick}
                  title="Favoriler"
                >
                  <span className="header-heart-icon">♥</span>
                </button>
                <button type="button" className="btn btn-account" onClick={onAccountClick}>
                  Hesabım
                </button>
                <span className="account-name">{username}{role === 'ADMIN' ? ' (Admin)' : ''}</span>
                <button type="button" className="btn btn-ghost" onClick={onLogout}>
                  Çıkış Yap
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={onLoginClick}>
                Giriş Yap
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;