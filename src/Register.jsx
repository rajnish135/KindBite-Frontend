import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from 'react-google-recaptcha';
import './styles/Register.css';

// ✅ Email format validation
const validateEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('donor');
  // const [captchaToken, setCaptchaToken] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // ✅ Frontend email validation
    if (!validateEmail(email)) {
      setMessage({ type: 'error', text: 'Invalid email format.' });
      return;
    }

    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/registerUser`, {
        username,
        password,
        role,
        email,
        // captchaToken,
      });

      console.log("Register User Response", response.data);

      setMessage({ type: 'success', text: 'Registration successful! Please verify your email.' });
      setTimeout(() => navigate('/login'), 2000); // redirect after 2 sec
    } 
    catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Registration failed. Please try again.'
      });
    }
  };

  return (
    <div className="register-container">
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <div className="input-field">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="input-field">
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="donor">Donor</option>
            <option value="receiver">Receiver</option>
          </select>
        </div>

        {/* <ReCAPTCHA
          sitekey="6LcE8jQrAAAAAAoBOIdjX3zrQLjDyU5xgvpoSqDH"
          onChange={setCaptchaToken}
        /> */}

        <button type="submit" className="submit-btn">Register</button>
      </form>

      {message && (
        <div className={message.type === 'error' ? 'error-message' : 'success-message'}>
          {message.text}
        </div>
      )}

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
