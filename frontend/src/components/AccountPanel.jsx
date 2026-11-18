import { useEffect, useState } from 'react';
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
          <span className="heart-icon">♥</span>
          <div>
            <strong>Hesabım</strong>
            <p>Film favorileri ve profil</p>
          </div>
        </div>
        <nav className="account-nav">
          <button
            type="button"
            className={currentSection === 'details' ? 'active' : ''}
            onClick={() => setCurrentSection('details')}
          >
            Hesap Bilgileri
          </button>
          <button
            type="button"
            className={currentSection === 'favorites' ? 'active' : ''}
            onClick={() => setCurrentSection('favorites')}
          >
            Favoriler
          </button>
          <button
            type="button"
            className={currentSection === 'watchlist' ? 'active' : ''}
            onClick={() => setCurrentSection('watchlist')}
          >
            İzleme Listesi
          </button>
        </nav>
      </aside>
      <div className="account-content">
        {currentSection === 'details' ? (
          <div className="account-card">
            <h2>Hesap Bilgileri</h2>
            <p>
              <strong>Kullanıcı Adı:</strong> {username}
            </p>
            <p>
              <strong>Favori Sayısı:</strong> {favorites.length}
            </p>
            <p>
              <strong>İzleme Listesi Sayısı:</strong> {watchlist.length}
            </p>
            <p>Buradan profil bilgilerinizi ve favorilerinizi takip edebilirsiniz.</p>
          </div>
        ) : currentSection === 'favorites' ? (
          <div className="account-card">
            <div className="account-card__header">
              <h2>Favoriler</h2>
              <span className="heart-icon large">♥</span>
            </div>
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
                    <h3>{movie.title}</h3>
                    <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
                    <p>{movie.description}</p>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveFavorite(movie.id)}
                    >
                      Favorilerden Kaldır
                    </button>
                  </article>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="account-card">
            <div className="account-card__header">
              <h2>İzleme Listesi</h2>
              <span className="watchlist-icon large">📺</span>
            </div>
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
                    <h3>{movie.title}</h3>
                    <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
                    <p>{movie.description}</p>
                    <button
                      type="button"
                      className="remove-button"
                      onClick={() => handleRemoveWatchlist(movie.id)}
                    >
                      İzleme Listesinden Kaldır
                    </button>
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
