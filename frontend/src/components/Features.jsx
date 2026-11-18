import { ArrowRight } from 'lucide-react';
import './Features.css';

const Features = () => {
  return (
    <section id="features" className="features page-width" aria-labelledby="features-title">
      <div className="features__panel">
        <div className="features__image">
          <img src="/features.jpeg" alt="Birlikte film izleyen iki kişi" loading="lazy" />
        </div>
        <div className="features__copy">
          <h2 id="features-title">Sinema dünyasını keşfet, puanla ve incele</h2>
          <p>
            İzlediğiniz filmleri kaydedin, favori listelerinizi oluşturun ve diğer kullanıcıların
            yorumlarını okuyarak sıradaki filminizi bulun. Gelişmiş puanlama sistemimizle
            topluluğumuzun bir parçası olun.
          </p>
          <a className="btn btn-dark" href="#icerikler">
            Filmlere göz at
            <ArrowRight size={18} aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
};

export default Features;
