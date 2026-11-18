import { useEffect, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import './BackToTop.css';

// Sayfa biraz kaydırılınca beliren "yukarı çık" butonu
const BackToTop = () => {
  const [visible, setVisible] = useState(() => window.scrollY > 600);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <button
      type="button"
      className={`back-to-top${visible ? ' is-visible' : ''}`}
      aria-label="Sayfanın başına dön"
      tabIndex={visible ? 0 : -1}
      onClick={() => window.scrollTo({ top: 0 })}
    >
      <ArrowUp size={20} />
    </button>
  );
};

export default BackToTop;
