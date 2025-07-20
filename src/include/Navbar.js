import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleDropdownMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-text">Daily Brief</span>
        <span className="logo-accent">Newsly</span>
      </Link>
      <ul className="navbar-links">
        <li><Link to="/latest-news" className="nav-link">Latest</Link></li>
        <li><Link to="/world" className="nav-link">World</Link></li>
        <li><Link to="/national" className="nav-link">National</Link></li>
        <li 
          className={`dropdown ${isDropdownOpen ? 'dropdown-open' : ''}`}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <a href="#categories" className="dropbtn nav-link">
            Categories
            <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <div className="dropdown-content">
            <Link to="/national">Finance</Link>
            <Link to="/world">Education</Link>
            <Link to="/tech">Tech</Link>
            <Link to="/business">Business</Link>
            <Link to="/crime">Politics</Link>
            <Link to="/sports">Sports</Link>
            <Link to="/entertainment">Entertainment</Link>
            <Link to="/entertainment">Health</Link>
          </div>
        </li>
        <li><Link to="/about" className="nav-link nav-special">About</Link></li>
        <li><Link to="/contact" className="nav-link nav-cta">Contact</Link></li>
      </ul>
      
      {/* Mobile menu button - for future mobile implementation */}
      <div className="mobile-menu-btn">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </nav>
  );
}

export default Navbar; 