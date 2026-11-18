import { Clapperboard, Heart, LogOut, Search, UserRound } from 'lucide-react';
import './Header.css';

const NavLink = ({ active, onClick, children }) => (
  <a
    href="#"
    className={`main-nav__link${active ? ' is-active' : ''}`}
    aria-current={active ? 'page' : undefined}
    onClick={(event) => {
      event.preventDefault();
      onClick();
    }}
  >
    {children}
  </a>
);

const Header = ({
  onLoginClick,
  onHomeClick,
  onSeriesClick,
  onMoviesClick,
  onAdminClick,
  onAccountClick,
  onFavoritesClick,
  onLogout,
  isLoggedIn,
  username,
  role,
  searchQuery,
  onSearchChange,
  activeNav,
}) => {
  return (
    <header className="main-header">
      <div className="main-header__inner page-width">
        <a
          href="#"
          className="main-header__logo"
          onClick={(event) => {
            event.preventDefault();
            onHomeClick();
          }}
        >
          <span className="main-header__mark" aria-hidden="true">
            <Clapperboard size={18} strokeWidth={2.2} />
          </span>
          <span className="main-header__name">MovieApp</span>
        </a>

        <label className="header-search">
          <span className="visually-hidden">Film veya dizi ara</span>
          <Search className="header-search__icon" size={18} aria-hidden="true" />
          <input
            type="search"
            className="header-search__input"
            placeholder="Film veya dizi ara"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>

        <nav className="main-nav" aria-label="Ana menü">
          <NavLink active={activeNav === 'movies'} onClick={onMoviesClick}>Filmler</NavLink>
          <NavLink active={activeNav === 'series'} onClick={onSeriesClick}>Diziler</NavLink>
          {role === 'ADMIN' && (
            <NavLink active={activeNav === 'admin'} onClick={onAdminClick}>İçerik Ekle</NavLink>
          )}

          {isLoggedIn ? (
            <div className="account-actions">
              <button
                type="button"
                className="icon-btn"
                onClick={onFavoritesClick}
                aria-label="Favorilerim"
                title="Favorilerim"
              >
                <Heart size={18} />
              </button>
              <button type="button" className="account-chip" onClick={onAccountClick} title="Hesabım">
                <span className="account-chip__avatar" aria-hidden="true">
                  {username ? username.charAt(0).toUpperCase() : <UserRound size={16} />}
                </span>
                <span className="account-chip__name">{username}</span>
                {role === 'ADMIN' && <span className="account-chip__role">Admin</span>}
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={onLogout}
                aria-label="Çıkış yap"
                title="Çıkış yap"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <button type="button" className="btn btn-dark btn-login" onClick={onLoginClick}>
              Giriş Yap
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
