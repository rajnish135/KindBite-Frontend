import { useEffect, useState } from 'react';
import axios from 'axios';
import './style.css'; 

const ReceiverReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');
  const [averageRating, setAverageRating] = useState(0);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem('token');
      const donorId = localStorage.getItem('userId');

      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/reviews/${donorId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setReviews(res.data);

        const avg = res.data.reduce((acc, curr) => acc + curr.rating, 0) / res.data.length;
        setAverageRating(avg.toFixed(1));
        
      } 
      catch (err) {
        setError('Failed to fetch reviews.');
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="donor-reviews-container">
      <h2 className="reviews-heading">🌟 Your Reviews</h2>

      {error && <p className="error-message">{error}</p>}

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews yet.</p>
      ) : (
        <div>
          <p className="average-rating">
            <strong>Average Rating:</strong> {averageRating} <span className="star">⭐</span>
          </p>

          <div className="reviews-grid">
            {reviews.map((review) => (
              <div key={review._id} className="review-card">
                <p><strong>From:</strong> {review.receiver?.username || 'Anonymous'}</p>
                <p><strong>Rating:</strong> {review.rating} <span className="star">⭐</span></p>
                <p><strong>Comment:</strong> {review.comment || 'No comment'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiverReviews;
