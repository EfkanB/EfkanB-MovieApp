import React from 'react';
import './Header.css';

const Header = ({ onLoginClick, onHomeClick, onAdminClick, onAccountClick, onFavoritesClick, onLogout, isLoggedIn, username, role }) => {
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
      <nav className="main-nav">
        <ul className="main-nav__items">
          <li className="main-nav__item">
            <a href="#" onClick={(event) => { event.preventDefault(); onHomeClick(); }}>
              Filmler
            </a>
          </li>
          <li className="main-nav__item">
            <a href="#">Diziler</a>
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
                  <span className="heart-icon">♥</span>
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