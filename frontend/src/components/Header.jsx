import React from 'react';
import './Header.css';

const Header = ({ onLoginClick, onHomeClick, onAccountClick, onLogout, isLoggedIn, username }) => {
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
          <li className="main-nav__item main-nav__item--login">
            {isLoggedIn ? (
              <div className="account-actions">
                <button type="button" className="btn btn-account" onClick={onAccountClick}>
                  <span className="heart-icon">♥</span> Hesabım
                </button>
                <span className="account-name">{username}</span>
                <button type="button" className="btn btn-ghost" onClick={onLogout}>
                  Çıkış
                </button>
              </div>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={onLoginClick}>
                Login
              </button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;