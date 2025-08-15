import { useState } from 'react';
import axios from 'axios';
import './style.css'; 
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/forgot-password`, {
        email,
      });

      setMessage({
        type: 'success',
        text: res.data.message || 'Password reset email sent!',
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Error sending reset email.',
      });
    }
  };

  return (
  <div className="forgot-wrapper">
    <div className="forgot-form-container">
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-field">
          <input
            type="email"
            placeholder="Enter your registered email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="forgot-submit-btn">Reset Password</button>
      </form>

      {message && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}

      <p>
        <Link className='back-btn' to="/login">← Back to Login</Link>
      </p>
    </div>
  </div>
  
  );
};

export default ForgotPassword;
