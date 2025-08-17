import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="modern-footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-grid">
          {/* Brand Section */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-tech">Tech</span>
              <span className="footer-logo-brief">Brief</span>
              <span className="footer-logo-daily">Daily</span>
            </div>
            <p className="footer-description">
              Your ultimate source for technology news, AI developments, and digital innovation insights.
            </p>
            <div className="footer-social">
              <a href="#" className="social-icon" aria-label="Twitter">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              <a href="#" className="social-icon" aria-label="GitHub">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22" />
                </svg>
              </a>
            </div>
          </div>

          {/* Tech Categories */}
          <div className="footer-section">
            <h4>Tech Categories</h4>
            <ul className="footer-links">
              <li><Link to="/category/AI" className="footer-link">Artificial Intelligence</Link></li>
              <li><Link to="/category/Cybersecurity" className="footer-link">Cybersecurity</Link></li>
              <li><Link to="/category/Quantum Computing" className="footer-link">Quantum Computing</Link></li>
              <li><Link to="/category/AR/VR" className="footer-link">AR/VR</Link></li>
              <li><Link to="/category/Cloud" className="footer-link">Cloud Computing</Link></li>
              <li><Link to="/category/Web3" className="footer-link">Web3 & Blockchain</Link></li>
            </ul>
          </div>

          {/* Innovation */}
          <div className="footer-section">
            <h4>Innovation</h4>
            <ul className="footer-links">
              <li><Link to="/category/Startups" className="footer-link">Startup News</Link></li>
              <li><Link to="/category/EdTech" className="footer-link">EdTech</Link></li>
              <li><Link to="/category/HealthTech" className="footer-link">HealthTech</Link></li>
              <li><Link to="/category/Green Tech" className="footer-link">Green Technology</Link></li>
              <li><Link to="/category/Space Tech" className="footer-link">Space Technology</Link></li>
              <li><Link to="/category/Autotech" className="footer-link">Automotive Tech</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="footer-section">
            <h4>Resources</h4>
            <ul className="footer-links">
              <li><Link to="/latest-news" className="footer-link">Latest News</Link></li>
              <li><Link to="/about" className="footer-link">About Us</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
              <li><Link to="/privacy" className="footer-link">Privacy Policy</Link></li>
              <li><Link to="/terms" className="footer-link">Terms of Service</Link></li>
              <li><Link to="/disclaimer" className="footer-link">Disclaimer</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-section newsletter-section">
            <h4>Stay Connected</h4>
            <p className="newsletter-description">
              Get the latest tech news and insights delivered weekly to your inbox.
            </p>
            <form className="footer-newsletter-form" onSubmit={e => e.preventDefault()}>
              <div className="newsletter-input-wrapper">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  required
                />
                <button type="submit" className="newsletter-button">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12h14" stroke="currentColor" strokeWidth="2" />
                    <path d="m12 5 7 7-7 7" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </div>
            </form>
            <div className="newsletter-benefits">
              <div className="benefit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>Weekly tech digest</span>
              </div>
              <div className="benefit">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" />
                </svg>
                <span>No spam guarantee</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>&copy; {currentYear} Tech Brief Daily. Powered by innovation.</p>
            </div>
            <div className="footer-tech-badge">
              <span>Built with ⚡ React & Modern Web Technologies</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;