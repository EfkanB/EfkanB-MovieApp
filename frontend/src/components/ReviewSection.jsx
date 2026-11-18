import { useState, useEffect } from 'react';
import { ChevronDown, MessageSquare } from 'lucide-react';
import StarRating from './StarRating';
import './ReviewSection.css';

const getJson = async (url, errorMessage) => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(errorMessage);
  }
  return response.json();
};

const ReviewSection = ({ contentId, token, username, isAdmin = false }) => {
  const [reviews, setReviews] = useState([]);
  const [showReviews, setShowReviews] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({ averageRating: null, reviewCount: 0 });

  const authHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    return headers;
  };

  const fetchStats = async () => {
    try {
      setStats(await getJson(`/api/reviews/stats/${contentId}`, 'İstatistikler yüklenemedi'));
    } catch (err) {
      console.error('Stats fetch error:', err);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token || !username) {
      setError('Yorum yapmak için giriş yapın');
      return;
    }
    if (newRating === 0) {
      setError('Lütfen bir puan verin (1-5 yıldız)');
      return;
    }
    if (!newComment.trim()) {
      setError('Lütfen bir yorum yazın');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({
          contentId,
          rating: newRating,
          comment: newComment.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Yorum eklenemedi');
      }

      const newReview = await response.json();
      setReviews(prev => {
        // Check if this is an update or new review
        const existingIndex = prev.findIndex(r => r.username === username);
        if (existingIndex >= 0) {
          const updated = [...prev];
          updated[existingIndex] = newReview;
          return updated;
        }
        return [newReview, ...prev];
      });
      setNewRating(0);
      setNewComment('');
      // Refresh stats
      await fetchStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!confirm('Bu yorumu silmek istediğinizden emin misiniz?')) {
      return;
    }

    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: authHeaders(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Yorum silinemedi');
      }

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      // Refresh stats
      await fetchStats();
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    let ignore = false;
    getJson(`/api/reviews/stats/${contentId}`, 'İstatistikler yüklenemedi')
      .then((data) => {
        if (!ignore) setStats(data);
      })
      .catch((err) => console.error('Stats fetch error:', err));
    return () => {
      ignore = true;
    };
  }, [contentId]);

  useEffect(() => {
    if (!showReviews) return undefined;
    let ignore = false;
    getJson(`/api/reviews/content/${contentId}`, 'Yorumlar yüklenemedi')
      .then((data) => {
        if (!ignore) setReviews(data);
      })
      .catch((err) => {
        if (!ignore) setError(err.message);
      });
    return () => {
      ignore = true;
    };
  }, [showReviews, contentId]);

  return (
    <div className="review-section">
      <button
        type="button"
        className={`review-toggle-btn${showReviews ? ' is-open' : ''}`}
        aria-expanded={showReviews}
        onClick={() => setShowReviews((prev) => !prev)}
      >
        <MessageSquare size={16} aria-hidden="true" />
        <span>{stats.reviewCount > 0 ? `${stats.reviewCount} yorum` : 'Yorum yap'}</span>
        <ChevronDown className="review-toggle-btn__chevron" size={16} aria-hidden="true" />
      </button>

      {showReviews && (
        <div className="review-content">

          {token ? (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <div className="rating-input">
                <span className="rating-input__label">Puanın</span>
                <StarRating
                  rating={newRating}
                  onRatingChange={setNewRating}
                  maxStars={5}
                />
              </div>
              <textarea
                placeholder="Ne düşündün?"
                aria-label="Yorumun"
                maxLength={500}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
              {error && <p className="error-message" role="alert">{error}</p>}
            </form>
          ) : (
            <p className="review-login">
              Puan vermek ve yorum yazmak için{' '}
              <button type="button" className="link-btn" onClick={() => window.dispatchEvent(new Event('open-auth'))}>
                giriş yap
              </button>
              .
            </p>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? (
              <p className="review-empty">Henüz yorum yok. İlk yorumu sen yaz.</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <strong>{review.username}</strong>
                    <StarRating rating={review.rating} readonly maxStars={5} />
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    {(username === review.username || isAdmin) && (
                      <button
                        type="button"
                        className="link-btn link-btn--danger"
                        onClick={() => handleDeleteReview(review.id)}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                  <p className="review-comment">{review.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewSection;