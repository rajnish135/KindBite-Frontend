import { useState } from 'react';
import './style.css';
import NotificationBell from '../NotificationBell/index.jsx';

const Navbar = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const role = localStorage.getItem('role');

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@500;700&display=swap"
        rel="stylesheet"
      />

      <nav className="navbar">

            <div className="logo">
              <h2 className="logo-animate">KindBite – Waste Less, Feed More</h2>
            </div>

            {(role === 'admin' || role === 'receiver') && (
              <div className="notification-container">
                <NotificationBell />
              </div>
            )}

            <div
              className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
              onClick={toggleMenu}
            >
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>

            <ul className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
              {children}
            </ul>

      </nav>

    </>
  );
};

export default Navbar;
