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

  const authHeaders = () => {
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    if (username) {
      headers['X-Username'] = username;
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

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!token || !username) {
      setError('Yorum yapmak için giriş yapın');
      return;
    }
    if (newRating === 0) {
      setError('Lütfen bir puan verin');
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
      setReviews(prev => [newReview, ...prev]);
      setNewRating(0);
      setNewComment('');
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
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (showReviews) {
      fetchReviews();
    }
  }, [showReviews, contentId]);

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="review-section">
      <button
        className="btn btn-outline review-toggle"
        onClick={() => setShowReviews(!showReviews)}
      >
        {showReviews ? 'Yorumları Gizle' : `Yorumları Göster (${reviews.length})`}
        {reviews.length > 0 && (
          <span className="average-rating">
            Ortalama: <StarRating rating={Math.round(averageRating)} readonly maxStars={5} /> ({averageRating})
          </span>
        )}
      </button>

      {showReviews && (
        <div className="review-content">
          {token && (
            <form className="review-form" onSubmit={handleSubmitReview}>
              <h4>Yorum Yap</h4>
              <div className="rating-input">
                <label>Puan:</label>
                <StarRating
                  rating={newRating}
                  onRatingChange={setNewRating}
                  maxStars={10}
                />
                <span className="rating-text">{newRating}/10</span>
              </div>
              <textarea
                placeholder="Yorumunuzu yazın..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                required
              />
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading ? 'Gönderiliyor...' : 'Yorum Gönder'}
              </button>
            </form>
          )}

          <div className="reviews-list">
            <h4>Yorumlar ({reviews.length})</h4>
            {reviews.length === 0 ? (
              <p>Henüz yorum yok. İlk yorumu siz yapın!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-item">
                  <div className="review-header">
                    <strong>{review.user.username}</strong>
                    <StarRating rating={review.rating} readonly maxStars={10} />
                    <span className="review-rating-text">{review.rating}/10</span>
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

          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;