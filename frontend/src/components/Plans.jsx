import { Check } from 'lucide-react';
import './Plans.css';

const PLANS = [
  {
    name: 'Ücretsiz',
    price: '0',
    cta: 'Hemen başla',
    featured: true,
    features: ['Sınırsız keşif', '1-5 yıldız puanlama', 'Standart yorum yapma', 'Temel izleme listesi', 'Reklamlı arayüz'],
  },
  {
    name: 'Temel',
    price: '9,99',
    cta: 'Planı seç',
    features: ['Reklamsız arayüz', 'Sınırsız favori listesi', 'Gelişmiş filtreleme', '“Sinemasever” rozeti'],
  },
  {
    name: 'Premium',
    price: '19,99',
    cta: 'Planı seç',
    features: ['Reklamsız arayüz', 'Detaylı izleme istatistikleri', '“Premium Eleştirmen” rozeti', 'Yeni özelliklere erken erişim'],
  },
];

const Plans = () => {
  return (
    <section id="plans" className="plans page-width" aria-labelledby="plans-title">
      <div className="section-head plans__head">
        <h2 id="plans-title">Fiyatlandırma</h2>
        <p>Ücretli planlar yakında. Şimdilik tüm özellikler ücretsiz.</p>
      </div>

      <div className="plans__grid">
        {PLANS.map((plan) => (
          <article key={plan.name} className={`plan${plan.featured ? ' plan--featured' : ''}`}>
            <div className="plan__top">
              <h3>{plan.name}</h3>
              {plan.price !== '0' && <span className="plan__badge plan__badge--soon">Yakında</span>}
            </div>
            <p className="plan__price">
              <span className="plan__currency">$</span>
              {plan.price}
              <span className="plan__period">/ay</span>
            </p>
            <ul className="plan__features">
              {plan.features.map((f) => (
                <li key={f}>
                  <Check size={18} aria-hidden="true" />
                  {f}
                </li>
              ))}
            </ul>
            {plan.price === '0' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => window.dispatchEvent(new Event('open-auth'))}
              >
                {plan.cta}
              </button>
            ) : (
              <button type="button" className="btn btn-outline" disabled>
                Yakında
              </button>
            )}
          </article>
        ))}
      </div>
    </section>
  );
};

export default Plans;
