import { useEffect, useState } from 'react';
import { Bookmark, Heart, UserRound } from 'lucide-react';
import './AccountPanel.css';

const fetchList = async (token, path, errorMessage) => {
  const response = await fetch(path, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json();
};

const AccountPanel = ({ token, username, initialSection = 'details' }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [currentSection, setCurrentSection] = useState(initialSection);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    setFavorites(await fetchList(token, '/api/users/me/favorites', 'Favoriler getirilemedi'));
    setLoading(false);
  };

  const fetchWatchlist = async () => {
    setWatchlist(await fetchList(token, '/api/users/me/watchlist', 'İzleme listesi getirilemedi'));
    setLoading(false);
  };

  // initialSection değişince bileşen App'te `key` ile yeniden kurulur, ayrı bir effect gerekmez
  useEffect(() => {
    if (!token) return undefined;
    let ignore = false;

    Promise.all([
      fetchList(token, '/api/users/me/favorites', 'Favoriler getirilemedi'),
      fetchList(token, '/api/users/me/watchlist', 'İzleme listesi getirilemedi'),
    ])
      .then(([favoriteData, watchlistData]) => {
        if (ignore) return;
        setFavorites(favoriteData);
        setWatchlist(watchlistData);
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Liste yüklenemedi');
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [token]);

  const handleRemoveFavorite = async (contentId) => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/users/me/favorites/${contentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Favori kaldırılamadı');
      }

      await fetchFavorites();
    } catch (err) {
      setError(err.message || 'Favori kaldırılamadı');
      setLoading(false);
    }
  };

  const handleRemoveWatchlist = async (contentId) => {
    if (!token) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/users/me/watchlist/${contentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('İzleme listesi kaldırılamadı');
      }

      await fetchWatchlist();
    } catch (err) {
      setError(err.message || 'İzleme listesi kaldırılamadı');
      setLoading(false);
    }
  };

  return (
    <section className="account-panel">
      <aside className="account-sidebar">
        <div className="account-sidebar__brand">
          <span className="account-avatar" aria-hidden="true">
            {username ? username.charAt(0).toUpperCase() : <UserRound size={20} />}
          </span>
          <div>
            <strong>{username}</strong>
            <p>Hesabım</p>
          </div>
        </div>
        <nav className="account-nav">
          <button
            type="button"
            className={currentSection === 'details' ? 'active' : ''}
            onClick={() => setCurrentSection('details')}
          >
            <UserRound size={18} aria-hidden="true" />
            Hesap bilgileri
          </button>
          <button
            type="button"
            className={currentSection === 'favorites' ? 'active' : ''}
            onClick={() => setCurrentSection('favorites')}
          >
            <Heart size={18} aria-hidden="true" />
            Favoriler
            <span className="account-nav__count">{favorites.length}</span>
          </button>
          <button
            type="button"
            className={currentSection === 'watchlist' ? 'active' : ''}
            onClick={() => setCurrentSection('watchlist')}
          >
            <Bookmark size={18} aria-hidden="true" />
            İzleme listesi
            <span className="account-nav__count">{watchlist.length}</span>
          </button>
        </nav>
      </aside>
      <div className="account-content">
        {currentSection === 'details' ? (
          <div className="account-card">
            <h2>Hesap bilgileri</h2>
            <dl className="account-facts">
              <div>
                <dt>Kullanıcı adı</dt>
                <dd>{username}</dd>
              </div>
              <div>
                <dt>Favoriler</dt>
                <dd>{favorites.length}</dd>
              </div>
              <div>
                <dt>İzleme listesi</dt>
                <dd>{watchlist.length}</dd>
              </div>
            </dl>
          </div>
        ) : currentSection === 'favorites' ? (
          <div className="account-card">
            <h2>Favoriler</h2>
            {loading ? (
              <p>Favoriler yükleniyor...</p>
            ) : error ? (
              <p className="account-error">{error}</p>
            ) : favorites.length === 0 ? (
              <p>Henüz favori içerik eklemediniz.</p>
            ) : (
              <div className="favorite-grid">
                {favorites.map((movie) => (
                  <article key={movie.id} className="favorite-card">
                    {movie.posterUrl ? (
                      <img className="favorite-card__poster" src={movie.posterUrl} alt="" loading="lazy" />
                    ) : (
                      <span className="favorite-card__poster" aria-hidden="true" />
                    )}
                    <div className="favorite-card__body">
                    <h3>{movie.title}</h3>
                    <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
                    <p className="favorite-card__desc">{movie.description}</p>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveFavorite(movie.id)}
                    >
                      Favorilerden kaldır
                    </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="account-card">
            <h2>İzleme listesi</h2>
            {loading ? (
              <p>İzleme listesi yükleniyor...</p>
            ) : error ? (
              <p className="account-error">{error}</p>
            ) : watchlist.length === 0 ? (
              <p>Henüz izleme listesine içerik eklemediniz.</p>
            ) : (
              <div className="favorite-grid">
                {watchlist.map((movie) => (
                  <article key={movie.id} className="favorite-card">
                    {movie.posterUrl ? (
                      <img className="favorite-card__poster" src={movie.posterUrl} alt="" loading="lazy" />
                    ) : (
                      <span className="favorite-card__poster" aria-hidden="true" />
                    )}
                    <div className="favorite-card__body">
                    <h3>{movie.title}</h3>
                    <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
                    <p className="favorite-card__desc">{movie.description}</p>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveWatchlist(movie.id)}
                    >
                      İzleme listesinden kaldır
                    </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default AccountPanel;
