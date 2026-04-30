import React, { useEffect, useState } from 'react';
import ReviewSection from './ReviewSection';
import './MovieList.css';

const MovieList = ({ token, username, searchQuery, contentType = 'all' }) => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const authHeaders = () => {
    const headers = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (username) {
      headers['X-Username'] = username;
    }
    return headers;
  };

  const getContentTypeLabel = (item) => {
    if (item.seasonCount != null || item.episodeCount != null) {
      return 'Dizi';
    }
    return 'Film';
  };

  const fetchContent = async (query = '') => {
    setError('');
    setLoading(true);

    try {
      if (query) {
        const response = await fetch(`/api/content/search?title=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Arama sonuçları getirilemedi');
        }
        const data = await response.json();
        setSearchResults(data);
        setMovies([]);
        setSeries([]);
      } else {
        setSearchResults(null);
        if (contentType === 'movies') {
          const response = await fetch('/api/movies');
          if (!response.ok) {
            throw new Error('Filmler getirilemedi');
          }
          const data = await response.json();
          setMovies(data);
          setSeries([]);
        } else if (contentType === 'series') {
          const response = await fetch('/api/series');
          if (!response.ok) {
            throw new Error('Diziler getirilemedi');
          }
          const data = await response.json();
          setSeries(data);
          setMovies([]);
        } else {
          const [moviesResponse, seriesResponse] = await Promise.all([
            fetch('/api/movies'),
            fetch('/api/series'),
          ]);

          if (!moviesResponse.ok || !seriesResponse.ok) {
            throw new Error('İçerikler getirilemedi');
          }

          const moviesData = await moviesResponse.json();
          const seriesData = await seriesResponse.json();
          setMovies(moviesData);
          setSeries(seriesData);
        }
      }
    } catch (err) {
      setError(err.message || 'Sunucu hatası');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    if (!token || !username) {
      setFavoriteIds(new Set());
      setFavoriteMovies([]);
      return;
    }

    try {
      const response = await fetch('/api/users/me/favorites', {
        headers: authHeaders(),
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
    if (!token || !username) {
      setWatchlistIds(new Set());
      setWatchlistMovies([]);
      return;
    }

    try {
      const response = await fetch('/api/users/me/watchlist', {
        headers: authHeaders(),
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
    const timer = setTimeout(() => {
      fetchContent(searchQuery);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, contentType]);

  useEffect(() => {
    if (!searchQuery) {
      fetchContent();
    }
  }, [contentType]);

  useEffect(() => {
    if (token && username) {
      fetchFavorites();
      fetchWatchlist();
    } else {
      setFavoriteIds(new Set());
      setWatchlistIds(new Set());
      setFavoriteMovies([]);
      setWatchlistMovies([]);
    }
  }, [token, username]);

  const updateFavoriteIds = (movieList) => {
    setFavoriteMovies(movieList);
    setFavoriteIds(new Set(movieList.map((movie) => movie.id)));
  };

  const updateWatchlistIds = (movieList) => {
    setWatchlistMovies(movieList);
    setWatchlistIds(new Set(movieList.map((movie) => movie.id)));
  };

  const handleToggleFavorite = async (movieId, add) => {
    if (!token || !username) {
      setError('Favorilere eklemek için giriş yapın.');
      return;
    }

    try {
      const response = await fetch(`/api/users/me/favorites/${movieId}`, {
        method: add ? 'POST' : 'DELETE',
        headers: authHeaders(),
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
    if (!token || !username) {
      setError('İzleme listesine eklemek için giriş yapın.');
      return;
    }

    try {
      const response = await fetch(`/api/users/me/watchlist/${movieId}`, {
        method: add ? 'POST' : 'DELETE',
        headers: authHeaders(),
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

  const renderCard = (movie) => (
    <article key={movie.id} className="movie-card">
      <div className="movie-card__top">
        <h3>{movie.title}</h3>
        <span className="movie-type-badge">{getContentTypeLabel(movie)}</span>
      </div>
      <p className="movie-meta">{movie.genre} · {movie.releaseYear}</p>
      <p>{movie.description}</p>
      {token ? (
        <div className="movie-actions">
          <button
            type="button"
            className={`btn btn-secondary ${isFavorite(movie.id) ? 'active' : ''}`}
            onClick={() => handleToggleFavorite(movie.id, !isFavorite(movie.id))}
          >
            {isFavorite(movie.id) ? '♥ Favorilerden Çıkar' : '♡ Favorilere Ekle'}
          </button>
          <button
            type="button"
            className={`btn btn-outline ${isInWatchlist(movie.id) ? 'active' : ''}`}
            onClick={() => handleToggleWatchlist(movie.id, !isInWatchlist(movie.id))}
          >
            {isInWatchlist(movie.id) ? '− İzleme Listesinden Çıkar' : '+ İzleme Listesine Ekle'}
          </button>
        </div>
      ) : (
        <p className="movie-note">Favorilere ve izleme listesine eklemek için giriş yapın.</p>
      )}
      <ReviewSection contentId={movie.id} token={token} username={username} />
    </article>
  );

  const renderSection = (title, items) => (
    <section className="content-section">
      <div className="movie-list__toolbar">
        <h2>{title}</h2>
      </div>
      {items.length === 0 ? (
        <p>{title} bulunamadı.</p>
      ) : (
        <div className="movie-grid">
          {items.map((movie) => renderCard(movie))}
        </div>
      )}
    </section>
  );

  if (loading) {
    return <div className="movie-list">Yükleniyor...</div>;
  }

  if (error) {
    return <div className="movie-list movie-error">{error}</div>;
  }

  const renderSearchResults = () => (
    <section className="content-section">
      <div className="movie-list__toolbar">
        <h2>{`"${searchQuery}" için arama sonuçları`}</h2>
      </div>
      {searchResults?.length === 0 ? (
        <p>{`"${searchQuery}" için sonuç bulunamadı.`}</p>
      ) : (
        <div className="movie-grid">
          {searchResults.map((movie) => renderCard(movie))}
        </div>
      )}
    </section>
  );

  return (
    <section className="movie-list">
      {searchResults ? (
        renderSearchResults()
      ) : (
        <>
          {contentType !== 'series' && renderSection('Filmler', movies)}
          {contentType !== 'movies' && renderSection('Diziler', series)}
        </>
      )}

      {token && (
        <section className="favorite-list">
          <h2>Favori Filmleriniz</h2>
          {favoriteMovies.length === 0 ? (
            <p>Henüz favori eklemediniz.</p>
          ) : (
            <div className="movie-grid">
              {favoriteMovies.map((movie) => renderCard(movie))}
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
              {watchlistMovies.map((movie) => renderCard(movie))}
            </div>
          )}
        </section>
      )}
    </section>
  );
};

export default MovieList;
