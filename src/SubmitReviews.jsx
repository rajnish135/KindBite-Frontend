import { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import './styles/SubmitReview.css'; 

const SubmitReview = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [message, setMessage] = useState('');
  const { donationId } = useParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    try {
      
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/submitReview`,
        { donationId, rating, comment },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setMessage(res.data.message);
      console.log('Donation Id in frontend', donationId);

    } 
    catch (err) {
      console.error('Submit review error:', err);
      setMessage(err.response?.data?.message || 'Error submitting review');
    }
  };

  return (
    <div className="review-container">
      <form onSubmit={handleSubmit} className="review-form">
        <h3 className="review-title">Leave a Review</h3>

        <select
          className="review-select"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r} Star
            </option>
          ))}
        </select>

        <textarea
          className="review-textarea"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Write a comment..."
        />

        <button type="submit" className="review-button">
          Submit Review
        </button>

        {message && <p className="review-message">{message}</p>}
      </form>
    </div>
  );
};

export default SubmitReview;
