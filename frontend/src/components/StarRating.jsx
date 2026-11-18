import { useState } from 'react';
import { Star } from 'lucide-react';
import './StarRating.css';

const StarRating = ({ rating, onRatingChange, readonly = false, maxStars = 5 }) => {
  const [hoverRating, setHoverRating] = useState(0);

  const handleClick = (value) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };

  const handleMouseEnter = (value) => {
    if (!readonly) {
      setHoverRating(value);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoverRating(0);
    }
  };

  const displayRating = hoverRating || rating || 0;

  if (readonly) {
    return (
      <span className="star-rating is-readonly" role="img" aria-label={`5 üzerinden ${rating}`}>
        {[...Array(maxStars)].map((_, index) => (
          <Star
            key={index}
            size={14}
            className={index + 1 <= displayRating ? 'star filled' : 'star'}
            fill="currentColor"
            aria-hidden="true"
          />
        ))}
      </span>
    );
  }

  return (
    <div className="star-rating" role="radiogroup" aria-label="Puan" onMouseLeave={handleMouseLeave}>
      {[...Array(maxStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <button
            key={index}
            type="button"
            role="radio"
            aria-checked={rating === starValue}
            aria-label={`${starValue} yıldız`}
            className={`star-btn${starValue <= displayRating ? ' filled' : ''}`}
            onClick={() => handleClick(starValue)}
            onMouseEnter={() => handleMouseEnter(starValue)}
            onFocus={() => handleMouseEnter(starValue)}
            onBlur={handleMouseLeave}
          >
            <Star size={22} fill="currentColor" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;
