import { useState } from 'react';

interface RatingStarsProps {
  initialRating?: number;
  movieId: number;
  userId?: number;
  onRatingChange?: (rating: number) => void;
  readOnly?: boolean;
}

export default function RatingStars({
  initialRating = 0,
  movieId,
  userId = 1, // Default to user 1 for demo
  onRatingChange,
  readOnly = false
}: RatingStarsProps) {
  const [rating, setRating] = useState(initialRating);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRatingClick = async (newRating: number) => {
    if (readOnly) return;
    
    setRating(newRating);
    
    if (onRatingChange) {
      onRatingChange(newRating);
    }
    
    // Submit rating to API
    try {
      setIsSubmitting(true);
      const response = await fetch('/api/recommendations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          movieId,
          rating: newRating,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit rating');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readOnly || isSubmitting}
          className={`h-6 w-6 ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
          onMouseEnter={() => !readOnly && setHoveredRating(star)}
          onMouseLeave={() => !readOnly && setHoveredRating(0)}
          onClick={() => handleRatingClick(star)}
          aria-label={`Rate ${star} stars`}
        >
          <svg
            className={`h-full w-full ${
              (hoveredRating || rating) >= star
                ? 'text-yellow-400'
                : 'text-gray-400'
            } ${hoveredRating > 0 && hoveredRating >= star ? 'animate-pulse' : ''}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
      ))}
      {isSubmitting && (
        <span className="ml-2 text-xs text-gray-400">Saving...</span>
      )}
    </div>
  );
}
