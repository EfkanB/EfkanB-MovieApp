import { useEffect, useState } from 'react';
import { ArrowDown, Star } from 'lucide-react';
import './Showcase.css';

// Yelpazede gösterilecek afişler: önce bunlar denenir, yoksa listedeki ilk afişli içerikler
const FEATURED_TITLES = ['Interstellar', 'The Dark Knight', 'Breaking Bad'];

const pickFeatured = (contents) => {
  const withPoster = contents.filter((c) => c.posterUrl);
  const preferred = FEATURED_TITLES.map((t) => withPoster.find((c) => c.title === t)).filter(Boolean);
  const rest = withPoster.filter((c) => !preferred.includes(c));
  return [...preferred, ...rest].slice(0, 3);
};

const Showcase = ({ isLoggedIn }) => {
  const [featured, setFeatured] = useState([]);
  const [hiddenIds, setHiddenIds] = useState(() => new Set());

  useEffect(() => {
    let ignore = false;
    fetch('/api/contents')
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        if (!ignore) setFeatured(pickFeatured(data));
      })
      .catch(() => {});
    return () => {
      ignore = true;
    };
  }, []);

  const visible = featured.filter((c) => !hiddenIds.has(c.id));

  return (
    <section className="showcase page-width" aria-labelledby="showcase-title">
      <div className="showcase__panel">
        <div className="showcase__copy">
          <h1 id="showcase-title">
            Bu akşam <em>ne izlesek?</em>
          </h1>
          <p className="showcase__lead">
            Filmleri ve dizileri keşfet, puanla, yorumları oku. Beğendiklerini favorilerine,
            sonra izleyeceklerini izleme listene ekle.
          </p>
          <div className="showcase__actions">
            <a className="btn btn-primary" href="#icerikler">
              Keşfetmeye başla
              <ArrowDown size={18} aria-hidden="true" />
            </a>
            {!isLoggedIn && (
              <button
                type="button"
                className="btn showcase__secondary"
                onClick={() => window.dispatchEvent(new Event('open-auth'))}
              >
                Ücretsiz hesap aç
              </button>
            )}
          </div>
        </div>

        <div className="showcase__posters" aria-hidden="true">
          {visible.map((item, index) => (
            <figure key={item.id} className={`showcase__poster showcase__poster--${index + 1}`}>
              <img
                src={item.posterUrl}
                alt=""
                width="500"
                height="750"
                onError={() => setHiddenIds((prev) => new Set(prev).add(item.id))}
              />
              {index === 0 && (
                <figcaption>
                  <Star size={14} fill="currentColor" />
                  {item.title}
                </figcaption>
              )}
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Showcase;
