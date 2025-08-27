import { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './style.css';

import { useDispatch } from 'react-redux';
import { login } from '../../store/AuthSlice.js';
import { socket } from '../socket.js';

const Login = ({ isAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    
    e.preventDefault();
    setLoading(true); // ✅ Show "Logging in..."

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        { username, password }
      );

      const token = response.data.token;
      const role = response.data.role;
      const userId = response.data.userId;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);

      dispatch(
        login({
          user: { username, role },
          token,
        })
      );

      socket.auth.token = token;
      socket.connect();

      setMessage({ type: 'success', text: 'Login successful!' });
      navigate('/');
    } 
    catch (error) 
    {
      setMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Invalid credentials. Please try again.',
      });
    } 
    finally {
      setLoading(false); // ✅ Hide loading after response
    }
  };

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2>Login</h2>

        <form onSubmit={handleLogin}>
          <div className="input-field">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading} // ✅ Disable while loading
            />
          </div>

          <div className="input-field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} // ✅ Disable while loading
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading} // ✅ Disable button
          >
            {loading ? 'Logging in...' : 'Login'} {/* ✅ Change text */}
          </button>
        </form>

        {message && (
          <div
            className={
              message.type === 'error'
                ? 'error-message'
                : 'success-message'
            }
          >
            {message.text}
          </div>
        )}

        <p className="register">
          Don't have an account?{' '}
          <Link className="register-link" to="/registerUser">
            Register
          </Link>
        </p>

        <p style={{ marginTop: '10px' }}>
          <Link to="/forgot-password" className="forgot-link">
            Forgot Password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

