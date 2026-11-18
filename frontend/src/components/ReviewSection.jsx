import React, { useState, useEffect } from 'react';
import StarRating from './StarRating';
import './ReviewSection.css';

const ReviewSection = ({ contentId, token, username }) => {
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

  const fetchReviews = async () => {
    try {
      const response = await fetch(`/api/reviews/content/${contentId}`);
      if (!response.ok) {
        throw new Error('Yorumlar yüklenemedi');
      }
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`/api/reviews/stats/${contentId}`);
      if (!response.ok) {
        throw new Error('İstatistikler yüklenemedi');
      }
      const data = await response.json();
      setStats(data);
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
        const existingIndex = prev.findIndex(r => r.user.username === username);
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
    fetchStats();
  }, [contentId]);

  useEffect(() => {
    if (showReviews) {
      fetchReviews();
    }
  }, [showReviews, contentId]);

  return (
    <div className="review-section">
      <button
        type="button"
        className="review-toggle-btn"
        onClick={() => setShowReviews((prev) => !prev)}
      >
        {showReviews
          ? 'Yorumları Gizle'
          : `Yorumları Göster (${stats.reviewCount})`}
      </button>

      {showReviews && (
        <div className="review-content">

          {token && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h4>Puanla ve Yorum Yap</h4>
              <div className="rating-input">
                <label>Puanın:</label>
                <StarRating
                  rating={newRating}
                  onRatingChange={setNewRating}
                  maxStars={5}
                />
                <span className="rating-text">{newRating}/5</span>
              </div>
              <textarea
                placeholder="Yorumunuzu yazın..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Gönderiliyor...' : 'Gönder'}
              </button>
              {error && <p className="error-message">{error}</p>}
            </form>
          )}

          <div className="reviews-list">
            <h4>Tüm Yorumlar ({stats.reviewCount})</h4>
            {reviews.length === 0 ? (
              <p>Henüz yorum yok. İlk yorumu siz yapın!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <strong>{review.user.username}</strong>
                    <StarRating rating={review.rating} readonly maxStars={5} />
                    <span className="review-rating-text">{review.rating}/5</span>
                    <span className="review-date">
                      {new Date(review.createdAt).toLocaleDateString('tr-TR')}
                    </span>
                    {(username === review.user.username || /* admin check */ false) && (
                      <button
                        className="btn btn-small btn-danger"
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