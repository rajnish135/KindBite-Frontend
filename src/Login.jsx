import React, { useState } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
// import ReCAPTCHA from 'react-google-recaptcha';
import './styles/Login.css';

import { useDispatch } from 'react-redux';
import { login } from '../store/AuthSlice.js';
import { socket } from './socket.js';


const Login = ({isAuthenticated }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  // const [captchaToken, setCaptchaToken] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const dispatch = useDispatch();
  
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleLogin = async (e) => {
    
    e.preventDefault();
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/login`, {
        username,
        password,
        // captchaToken,
      });

      const token = response.data.token;
      const role = response.data.role;
       const userId = response.data.userId;

      console.log("ROLE",role);
      
      localStorage.setItem('token', token);
      localStorage.setItem('role', role); 
      localStorage.setItem('userId', userId);

      // ✅ Dispatch Redux login action
      dispatch(login({
        user: { username, role }, // You can expand this object if needed
        token,
      }));

      // ✅ Configure and connect socket after login
      socket.auth.token = token; // set token in auth
      socket.connect();          // now connect socket manually

      setMessage({ type: 'success', text: 'Login successful!' });

      navigate('/');
    } 
    catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Invalid credentials. Please try again.',
      });
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
          />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* <ReCAPTCHA
          sitekey="6LcE8jQrAAAAAAoBOIdjX3zrQLjDyU5xgvpoSqDH"
          onChange={setCaptchaToken}
        /> */}

        <button type="submit" className="submit-btn">Login</button>

      </form>

      {message && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}

      <p className='register'>
        Don't have an account? <Link className='register-link' to="/registerUser">Register</Link>
      </p>  

       {/* 🔹 Forgot password link */}
      <p style={{ marginTop: '10px' }}>
        <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
      </p>

    </div>

  </div>

  );
};

export default Login;