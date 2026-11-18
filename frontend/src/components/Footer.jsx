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
        <p className="site-footer__note">© {new Date().getFullYear()} MovieApp</p>
      </div>
    </footer>
  );
};

export default Footer;
