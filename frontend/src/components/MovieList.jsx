import { useEffect, useState } from 'react';
import ReviewSection from './ReviewSection';
import './MovieList.css';

const getJson = async (url, errorMessage, headers = {}) => {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(errorMessage);
  return response.json();
};

// Arama varsa arama sonuçlarını, yoksa seçilen türdeki içerikleri getirir
const loadContent = async (query, contentType) => {
  if (query) {
    const data = await getJson(`/api/content/search?title=${encodeURIComponent(query)}`, 'Arama sonuçları getirilemedi');
    return { searchResults: data, movies: [], series: [] };
  }
  if (contentType === 'movies') {
    return { searchResults: null, movies: await getJson('/api/movies', 'Filmler getirilemedi'), series: [] };
  }
  if (contentType === 'series') {
    return { searchResults: null, movies: [], series: await getJson('/api/series', 'Diziler getirilemedi') };
  }
  const [movies, series] = await Promise.all([
    getJson('/api/movies', 'İçerikler getirilemedi'),
    getJson('/api/series', 'İçerikler getirilemedi'),
  ]);
  return { searchResults: null, movies, series };
};

const MovieList = ({ token, username, role, searchQuery, contentType = 'all' }) => {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const [searchResults, setSearchResults] = useState(null);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [watchlistMovies, setWatchlistMovies] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState(new Set());
  const [watchlistIds, setWatchlistIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [ratingStatsByContentId, setRatingStatsByContentId] = useState({});

  const authHeaders = () => {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    return headers;
  };

  const getContentTypeLabel = (item) => {
    if (item.seasonCount != null || item.episodeCount != null) return 'Dizi';
    return 'Film';
  };

  const formatAverageRating = (value) => {
    if (value === null || value === undefined) return null;
    if (Number(value) === 0) return null;
    const onTenScale = Math.round(Number(value) * 2 * 10) / 10;
    return String(onTenScale).replace('.', ',');
  };

  // Arama yazılırken her tuşta istek atmamak için 250 ms bekle; eski istek gelirse yok say
  useEffect(() => {
    let ignore = false;
    const timer = setTimeout(async () => {
      setError('');
      setLoading(true);
      try {
        const result = await loadContent(searchQuery, contentType);
        if (ignore) return;
        setSearchResults(result.searchResults);
        setMovies(result.movies);
        setSeries(result.series);
      } catch (err) {
        if (!ignore) setError(err.message || 'Sunucu hatası');
      } finally {
        if (!ignore) setLoading(false);
      }
    }, searchQuery ? 250 : 0);

    return () => {
      ignore = true;
      clearTimeout(timer);
    };
  }, [searchQuery, contentType]);

  // Giriş/çıkışta App bu bileşeni `key` ile yeniden kurar, listeleri sıfırlamaya gerek yok
  useEffect(() => {
    if (!token || !username) return undefined;
    let ignore = false;
    const headers = { Authorization: `Bearer ${token}` };

    Promise.all([
      getJson('/api/users/me/favorites', 'Favoriler getirilemedi', headers),
      getJson('/api/users/me/watchlist', 'İzleme listesi getirilemedi', headers),
    ])
      .then(([favoriteData, watchlistData]) => {
        if (ignore) return;
        setFavoriteMovies(favoriteData);
        setFavoriteIds(new Set(favoriteData.map((m) => m.id)));
        setWatchlistMovies(watchlistData);
        setWatchlistIds(new Set(watchlistData.map((m) => m.id)));
      })
      .catch((err) => {
        if (!ignore) setError(err.message || 'Favori bilgisi alınamadı');
      });

    return () => {
      ignore = true;
    };
  }, [token, username]);

  const updateFavoriteIds = (movieList) => {
    setFavoriteMovies(movieList);
    setFavoriteIds(new Set(movieList.map((m) => m.id)));
  };

  const updateWatchlistIds = (movieList) => {
    setWatchlistMovies(movieList);
    setWatchlistIds(new Set(movieList.map((m) => m.id)));
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
      if (!response.ok) throw new Error(add ? 'Favoriye eklenemedi' : 'Favoriden çıkarılamadı');
      updateFavoriteIds(await response.json());
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
      if (!response.ok) throw new Error(add ? 'İzleme listesine eklenemedi' : 'İzleme listesinden çıkarılamadı');
      updateWatchlistIds(await response.json());
    } catch (err) {
      setError(err.message || 'İzleme listesi güncellemesi sırasında bir hata oluştu');
    }
  };

  const isFavorite = (movieId) => favoriteIds.has(movieId);
  const isInWatchlist = (movieId) => watchlistIds.has(movieId);

  useEffect(() => {
    if (searchResults) return undefined;

    const list =
      contentType === 'movies'
        ? movies
        : contentType === 'series'
          ? series
          : [...movies, ...series];
    const uniqueIds = [...new Set(list.map((c) => c.id))];
    if (uniqueIds.length === 0) return undefined;

    let ignore = false;
    Promise.all(
      uniqueIds.map((contentId) =>
        getJson(`/api/reviews/stats/${contentId}`, '')
          .then((data) => [contentId, data.averageRating])
          .catch(() => [contentId, null])
      )
    ).then((entries) => {
      if (!ignore) setRatingStatsByContentId(Object.fromEntries(entries));
    });

    return () => {
      ignore = true;
    };
  }, [movies, series, contentType, searchResults]);

  const renderCard = (movie) => {
    const formatted = formatAverageRating(ratingStatsByContentId[movie.id]);
    const displayValue = formatted ? `${formatted}/10` : '-/10';

    return (
      <article key={movie.id} className="movie-card">
        <div className="movie-card__header">
          <h3 className="movie-card__title">{movie.title}</h3>
          <div className="movie-card__labels">
            <span className="movie-type-badge">{getContentTypeLabel(movie)}</span>
            <span className="movie-rating-inline">
              <span className="movie-rating-star">★</span>
              <span className="movie-rating-value">{displayValue}</span>
            </span>
          </div>
        </div>

        <p className="movie-meta">
          {movie.genre} · {movie.releaseYear}
        </p>
        <p className="movie-description">{movie.description}</p>

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
          <button
            type="button"
            className="btn btn-secondary movie-note movie-login-cta"
            onClick={() => {
              // Header içindeki Giriş Yap butonunu tetikleyecek global aksiyon yoksa sadece uyarı verelim.
              // Bu projede AuthForm sadece Header'dan açılıyor, o yüzden burada gerçek yönlendirme olmayabilir.
              window.dispatchEvent(new Event('open-auth'));
            }}
          >
            Favorilere ve izleme listesine eklemek için giriş yapın
          </button>
        )}

        <ReviewSection contentId={movie.id} token={token} username={username} isAdmin={role === 'ADMIN'} />
      </article>
    );
  };

  const renderSection = (title, items) => (
    <section className="content-section">
      <div className="movie-list__toolbar">
        <h2>{title}</h2>
      </div>
      {items.length === 0 ? (
        <p>{title} bulunamadı.</p>
      ) : (
        <div className="movie-grid">{items.map((m) => renderCard(m))}</div>
      )}
    </section>
  );

  if (loading) return <div className="movie-list">Yükleniyor...</div>;
  if (error) return <div className="movie-list movie-error">{error}</div>;

  const renderSearchResults = () => (
    <section className="content-section">
      <div className="movie-list__toolbar">
        <h2>{`"${searchQuery}" için arama sonuçları`}</h2>
      </div>
      {searchResults?.length === 0 ? (
        <p>{`"${searchQuery}" için sonuç bulunamadı.`}</p>
      ) : (
        <div className="movie-grid">{searchResults.map((m) => renderCard(m))}</div>
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
            <div className="movie-grid">{favoriteMovies.map((m) => renderCard(m))}</div>
          )}
        </section>
      )}

      {token && (
        <section className="watchlist-list">
          <h2>İzleme Listeniz</h2>
          {watchlistMovies.length === 0 ? (
            <p>Henüz izleme listesine eklemediniz.</p>
          ) : (
            <div className="movie-grid">{watchlistMovies.map((m) => renderCard(m))}</div>
          )}
        </section>
      )}
    </section>
  );
};

export default MovieList;

