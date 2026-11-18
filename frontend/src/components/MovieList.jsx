import { useEffect, useState } from 'react';
import { Bookmark, Clapperboard, Heart, Star } from 'lucide-react';
import ReviewSection from './ReviewSection';
import './MovieList.css';

const getJson = async (url, errorMessage, headers = {}) => {
  const response = await fetch(url, { headers });
  if (!response.ok) throw new Error(errorMessage);
  return response.json();
};

// Afiş yoksa ya da yüklenemezse başlığın baş harfleriyle tasarlanmış bir yedek gösterilir
const Poster = ({ src, title }) => {
  const [failed, setFailed] = useState(false);
  if (!src || failed) {
    const initials = title
      .split(/\s+/)
      .filter((w) => /[\p{L}\d]/u.test(w[0] || ''))
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
    return (
      <div className="poster-fallback" role="img" aria-label={`${title} afişi`}>
        <Clapperboard size={22} aria-hidden="true" />
        <span>{initials}</span>
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={`${title} afişi`}
      loading="lazy"
      width="500"
      height="750"
      onError={() => setFailed(true)}
    />
  );
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
    // Ekranda görünen her kartın puanı lazım: liste, arama sonuçları, favoriler, izleme listesi
    const list = [
      ...(searchResults || []),
      ...(contentType === 'series' ? [] : movies),
      ...(contentType === 'movies' ? [] : series),
      ...favoriteMovies,
      ...watchlistMovies,
    ];
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
  }, [movies, series, contentType, searchResults, favoriteMovies, watchlistMovies]);

  const openAuth = () => window.dispatchEvent(new Event('open-auth'));

  const renderCard = (movie, sectionKey) => {
    const formatted = formatAverageRating(ratingStatsByContentId[movie.id]);
    const favorite = isFavorite(movie.id);
    const inWatchlist = isInWatchlist(movie.id);
    const isSeries = getContentTypeLabel(movie) === 'Dizi';
    const detail = isSeries
      ? movie.seasonCount ? `${movie.seasonCount} sezon` : null
      : movie.durationMinutes ? `${movie.durationMinutes} dk` : null;

    return (
      <article key={`${sectionKey}-${movie.id}`} className="movie-card">
        <div className="movie-card__poster">
          <Poster src={movie.posterUrl} title={movie.title} />
          <span className="movie-type-badge">{getContentTypeLabel(movie)}</span>
          <div className="movie-card__quick">
            <button
              type="button"
              className={`quick-btn${favorite ? ' is-on' : ''}`}
              aria-pressed={token ? favorite : undefined}
              aria-label={
                token
                  ? favorite ? `${movie.title}: favorilerden çıkar` : `${movie.title}: favorilere ekle`
                  : 'Favorilere eklemek için giriş yapın'
              }
              title={favorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
              onClick={() => (token ? handleToggleFavorite(movie.id, !favorite) : openAuth())}
            >
              <Heart size={18} fill={favorite ? 'currentColor' : 'none'} />
            </button>
            <button
              type="button"
              className={`quick-btn${inWatchlist ? ' is-on' : ''}`}
              aria-pressed={token ? inWatchlist : undefined}
              aria-label={
                token
                  ? inWatchlist ? `${movie.title}: izleme listesinden çıkar` : `${movie.title}: izleme listesine ekle`
                  : 'İzleme listesine eklemek için giriş yapın'
              }
              title={inWatchlist ? 'İzleme listesinden çıkar' : 'İzleme listesine ekle'}
              onClick={() => (token ? handleToggleWatchlist(movie.id, !inWatchlist) : openAuth())}
            >
              <Bookmark size={18} fill={inWatchlist ? 'currentColor' : 'none'} />
            </button>
          </div>
        </div>

        <div className="movie-card__body">
          <p className={`movie-rating${formatted ? '' : ' is-empty'}`}>
            <Star size={15} fill="currentColor" aria-hidden="true" />
            {formatted ? (
              <>
                <span className="movie-rating__value">
                  <strong>{formatted}</strong>/10
                </span>
              </>
            ) : (
              <span>Henüz puan yok</span>
            )}
          </p>
          <h3 className="movie-card__title" title={movie.title}>{movie.title}</h3>
          <p className="movie-meta">
            {[movie.genre, movie.releaseYear, detail].filter(Boolean).join(' · ')}
          </p>
          <p className="movie-description">{movie.description}</p>
          <ReviewSection contentId={movie.id} token={token} username={username} isAdmin={role === 'ADMIN'} />
        </div>
      </article>
    );
  };

  const renderGrid = (items, sectionKey) => (
    <div className="movie-grid">{items.map((m) => renderCard(m, sectionKey))}</div>
  );

  const renderSection = (title, items, sectionKey, emptyText) => (
    <section className="content-section" aria-labelledby={`baslik-${sectionKey}`}>
      <div className="section-head">
        <h2 id={`baslik-${sectionKey}`}>{title}</h2>
        <span className="section-count">{items.length} yapım</span>
      </div>
      {items.length === 0 ? <p className="movie-empty">{emptyText}</p> : renderGrid(items, sectionKey)}
    </section>
  );

  if (loading) {
    return (
      <div className="movie-list page-width" id="icerikler" aria-busy="true">
        <div className="section-head">
          <h2>Yükleniyor</h2>
        </div>
        <div className="movie-grid">
          {Array.from({ length: 10 }, (_, i) => (
            <div key={i} className="movie-card movie-card--skeleton" aria-hidden="true">
              <div className="movie-card__poster" />
              <div className="movie-card__body">
                <span className="skeleton-line" />
                <span className="skeleton-line skeleton-line--short" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="movie-list page-width" id="icerikler">
        <div className="movie-error" role="alert">
          <p>{error}</p>
          <button type="button" className="btn btn-outline" onClick={() => window.location.reload()}>
            Tekrar dene
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="movie-list page-width" id="icerikler">
      {searchResults ? (
        renderSection(
          `“${searchQuery}” için sonuçlar`,
          searchResults,
          'arama',
          'Bu aramayla eşleşen bir film ya da dizi bulamadık. Farklı bir isim deneyin.'
        )
      ) : (
        <>
          {contentType !== 'series' && renderSection('Filmler', movies, 'filmler', 'Henüz film eklenmemiş.')}
          {contentType !== 'movies' && renderSection('Diziler', series, 'diziler', 'Henüz dizi eklenmemiş.')}
        </>
      )}

      {token && (
        <>
          {renderSection(
            'Favorilerin',
            favoriteMovies,
            'favoriler',
            'Henüz favori eklemedin. Bir afişin üzerindeki kalbe dokunarak başlayabilirsin.'
          )}
          {renderSection(
            'İzleme listen',
            watchlistMovies,
            'izleme',
            'İzleme listen boş. Sonra izlemek istediklerini yer imi simgesiyle ekleyebilirsin.'
          )}
        </>
      )}
    </div>
  );
};

export default MovieList;
