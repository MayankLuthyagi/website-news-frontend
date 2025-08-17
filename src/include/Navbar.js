import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import ThemeToggle from '../components/ThemeToggle';
import '../modern-theme.css';

function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDropdownMouseEnter = () => {
    setIsDropdownOpen(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsDropdownOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Prevent default behavior for dropdown button
  const handleDropdownClick = (e) => {
    e.preventDefault();
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-text">Tech Brief</span>
        <span className="logo-accent">Daily</span>
      </Link>

      <div className="mobile-menu-btn" onClick={toggleMobileMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      <ul className={`navbar-links ${isMobileMenuOpen ? 'show' : ''}`}>
        <li><Link to="/latest-news" className="nav-link">Latest Tech</Link></li>
        <li><Link to="/category/tech" className="nav-link">All Tech News</Link></li>
        <li
          className={`dropdown ${isDropdownOpen ? 'dropdown-open' : ''}`}
          onMouseEnter={handleDropdownMouseEnter}
          onMouseLeave={handleDropdownMouseLeave}
        >
          <button
            className="dropbtn nav-link"
            onClick={handleDropdownClick}
            aria-expanded={isDropdownOpen}
            aria-haspopup="true"
            type="button"
          >
            Categories
            <svg className="dropdown-arrow" width="12" height="12" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <div className="dropdown-content">
            <div className="dropdown-section">
              <div className="dropdown-section-header">News</div>
              <div className="dropdown-section-content">
                <Link to="/category/AI">AI</Link>
                <Link to="/category/Cybersecurity">Cybersecurity</Link>
                <Link to="/category/AR/VR">AR/VR</Link>
                <Link to="/category/Edge Computing">Edge Computing</Link>
                <Link to="/category/6G & IoT">6G & IoT</Link>
                <Link to="/category/Sustainable Tech">Sustainable Tech</Link>
                <Link to="/category/Internet">Internet</Link>
                <Link to="/category/Gaming">Gaming</Link>
              </div>
            </div>
            <div className="dropdown-section">
              <div className="dropdown-section-header">Other</div>
              <div className="dropdown-section-content">
                <Link to="/category/Gadgets">Gadgets</Link>
                <Link to="/category/Cloud">Cloud</Link>
                <Link to="/category/Semiconductors">Semiconductors</Link>
                <Link to="/category/Green Tech">Green Tech</Link>
                <Link to="/category/EdTech">EdTech</Link>
                <Link to="/category/HealthTech">HealthTech</Link>
                <Link to="/category/Autotech">Autotech</Link>
                <Link to="/category/Space Tech">Space Tech</Link>
              </div>
            </div>
          </div>
        </li>
        <li><Link to="/about" className="nav-link">About</Link></li>
        <li><Link to="/contact" className="nav-link">Contact</Link></li>
        <li className="nav-actions">
          <ThemeToggle />
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;