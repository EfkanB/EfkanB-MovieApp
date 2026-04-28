import React, { useEffect, useState } from 'react';
import './AccountPanel.css';

const AccountPanel = ({ token, username }) => {
  const [favorites, setFavorites] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [currentSection, setCurrentSection] = useState('details');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    if (!token) {
      setFavorites([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/users/me/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Favoriler getirilemedi');
      }

      const data = await response.json();
      setFavorites(data);
    } catch (err) {
      setError(err.message || 'Favoriler yüklenemedi');
    } finally {
      setLoading(false);
    }
  };

  const fetchWatchlist = async () => {
    if (!token) {
      setWatchlist([]);
      return;
    }

    try {
      const response = await fetch('/api/users/me/watchlist', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('İzleme listesi getirilemedi');
      }

      const data = await response.json();
      setWatchlist(data);
    } catch (err) {
      setError(err.message || 'İzleme listesi yüklenemedi');
    }
  };

  useEffect(() => {
    fetchFavorites();
    fetchWatchlist();
  }, [token]);

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
              <h2>Favori Filmler</h2>
              <span className="heart-icon large">♥</span>
            </div>
            {loading ? (
              <p>Favoriler yükleniyor...</p>
            ) : error ? (
              <p className="account-error">{error}</p>
            ) : favorites.length === 0 ? (
              <p>Henüz favori film eklemediniz.</p>
            ) : (
              <div className="favorite-grid">
                {favorites.map((movie) => (
                  <article key={movie.id} className="favorite-card">
                    <h3>{movie.title}</h3>
                    <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
                    <p>{movie.description}</p>
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
              <p>Henüz izleme listesine film eklemediniz.</p>
            ) : (
              <div className="favorite-grid">
                {watchlist.map((movie) => (
                  <article key={movie.id} className="favorite-card">
                    <h3>{movie.title}</h3>
                    <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
                    <p>{movie.description}</p>
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
