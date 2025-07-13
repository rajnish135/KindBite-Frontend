import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './styles/Login.css';

const ResetPassword = () => {
  const { token } = useParams(); // Get token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/reset-password`, {
        token,
        password,
      });

      setMessage({ type: 'success', text: res.data.message || 'Password updated successfully!' });

      // Redirect to login after a few seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } 
    catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to reset password',
      });
    }
  };

  return (
    <div className="form-container">
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <div className="input-field">
          <input
            type="password"
            placeholder="Enter new password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Reset Password</button>
      </form>

      {message && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}

      <p>
        <Link to="/login">← Back to Login</Link>
      </p>
    </div>
  );
};

export default ResetPassword;
