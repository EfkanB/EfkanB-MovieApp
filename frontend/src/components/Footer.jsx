import { Clapperboard } from 'lucide-react';
import './Footer.css';

const Footer = ({ onMoviesClick, onSeriesClick }) => {
  const go = (handler) => (event) => {
    event.preventDefault();
    handler();
  };

  return (
    <footer className="site-footer">
      <div className="site-footer__inner page-width">
        <div className="site-footer__brand">
          <span className="site-footer__mark" aria-hidden="true">
            <Clapperboard size={16} strokeWidth={2.2} />
          </span>
          <span>MovieApp</span>
        </div>
        <nav className="site-footer__nav" aria-label="Alt menü">
          <a href="#" onClick={go(onMoviesClick)}>Filmler</a>
          <a href="#" onClick={go(onSeriesClick)}>Diziler</a>
          <a href="#how-it-works">Nasıl çalışır?</a>
          <a href="#plans">Fiyatlandırma</a>
        </nav>
        <a className="site-footer__privacy" href="/gizlilik">Gizlilik</a>
        <p className="site-footer__note">© {new Date().getFullYear()} MovieApp</p>
        <p className="site-footer__credit">
          Film afişleri ve bilgileri <a href="https://www.themoviedb.org" target="_blank" rel="noopener noreferrer">TMDB</a>
          {' '}kaynaklıdır. Bu ürün TMDB API'sini kullanır ancak TMDB tarafından onaylanmamış veya
          desteklenmemektedir.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
