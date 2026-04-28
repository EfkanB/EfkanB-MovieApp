import React, { useEffect, useState } from 'react';
import './MovieList.css';

const MovieList = ({ token }) => {
  const [movies, setMovies] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMovies = async () => {
    try {
      const response = await fetch('/api/movies');
      if (!response.ok) {
        throw new Error('Filmler getirilemedi');
      }
      const data = await response.json();
      setMovies(data);
    } catch (err) {
      setError(err.message || 'Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!token) {
      setFavoriteIds(new Set());
      return;
    }

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
      setFavoriteMovies(data);
      setFavoriteIds(new Set(data.map((movie) => movie.id)));
    } catch (err) {
      setError(err.message || 'Favori bilgisi alınamadı');
    }
  };

  const fetchWatchlist = async () => {
    if (!token) {
      setWatchlistIds(new Set());
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
      setWatchlistMovies(data);
      setWatchlistIds(new Set(data.map((movie) => movie.id)));
    } catch (err) {
      setError(err.message || 'İzleme listesi bilgisi alınamadı');
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    if (token) {
      fetchFavorites();
      fetchWatchlist();
    } else {
      setFavoriteIds(new Set());
      setWatchlistIds(new Set());
    }
  }, [token]);

  const updateFavoriteIds = (movieList) => {
    setFavoriteMovies(movieList);
    setFavoriteIds(new Set(movieList.map((movie) => movie.id)));
  };

  const updateWatchlistIds = (movieList) => {
    setWatchlistMovies(movieList);
    setWatchlistIds(new Set(movieList.map((movie) => movie.id)));
  };

  const handleToggleFavorite = async (movieId, add) => {
    if (!token) {
      setError('Favorilere eklemek için giriş yapın.');
      return;
    }

    try {
      const response = await fetch(`/api/users/me/favorites/${movieId}`, {
        method: add ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(add ? 'Favoriye eklenemedi' : 'Favoriden çıkarılamadı');
      }

      const data = await response.json();
      updateFavoriteIds(data);
    } catch (err) {
      setError(err.message || 'Favori güncellemesi sırasında bir hata oluştu');
    }
  };

  const handleToggleWatchlist = async (movieId, add) => {
    if (!token) {
      setError('İzleme listesine eklemek için giriş yapın.');
      return;
    }

    try {
      const response = await fetch(`/api/users/me/watchlist/${movieId}`, {
        method: add ? 'POST' : 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(add ? 'İzleme listesine eklenemedi' : 'İzleme listesinden çıkarılamadı');
      }

      const data = await response.json();
      updateWatchlistIds(data);
    } catch (err) {
      setError(err.message || 'İzleme listesi güncellemesi sırasında bir hata oluştu');
    }
  };

  const isFavorite = (movieId) => favoriteIds.has(movieId);

  const isInWatchlist = (movieId) => watchlistIds.has(movieId);

  if (loading) {
    return <div className="movie-list">Filmler yükleniyor...</div>;
  }

  if (error) {
    return <div className="movie-list movie-error">{error}</div>;
  }

  return (
    <section className="movie-list">
      <h2>Filmler</h2>
      {movies.length === 0 ? (
        <p>Henüz film yok.</p>
      ) : (
        <div className="movie-grid">
          {movies.map((movie) => (
            <article key={movie.id} className="movie-card">
              <h3>{movie.title}</h3>
              <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
              <p>{movie.description}</p>
              {token ? (
                <div className="movie-actions">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleToggleFavorite(movie.id, !isFavorite(movie.id))}
                  >
                    {isFavorite(movie.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline"
                    onClick={() => handleToggleWatchlist(movie.id, !isInWatchlist(movie.id))}
                  >
                    {isInWatchlist(movie.id) ? 'İzleme Listesinden Çıkar' : 'İzleme Listesine Ekle'}
                  </button>
                </div>
              ) : (
                <p className="movie-note">Favorilere eklemek için giriş yapın.</p>
              )}
            </article>
          ))}
        </div>
      )}
      {token && (
        <section className="favorite-list">
          <h2>Favori Filmleriniz</h2>
          {favoriteMovies.length === 0 ? (
            <p>Henüz favori eklemediniz.</p>
          ) : (
            <div className="movie-grid">
              {favoriteMovies.map((movie) => (
                <article key={movie.id} className="movie-card">
                  <h3>{movie.title}</h3>
                  <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
                  <p>{movie.description}</p>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => handleToggleFavorite(movie.id, false)}
                  >
                    Favorilerden Çıkar
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      {token && (
        <section className="watchlist-list">
          <h2>İzleme Listeniz</h2>
          {watchlistMovies.length === 0 ? (
            <p>Henüz izleme listesine eklemediniz.</p>
          ) : (
            <div className="movie-grid">
              {watchlistMovies.map((movie) => (
                <article key={movie.id} className="movie-card">
                  <h3>{movie.title}</h3>
                  <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
                  <p>{movie.description}</p>
                  <div className="movie-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => handleToggleFavorite(movie.id, !isFavorite(movie.id))}
                    >
                      {isFavorite(movie.id) ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => handleToggleWatchlist(movie.id, false)}
                    >
                      İzleme Listesinden Çıkar
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
    </section>
  );
};

export default MovieList;
