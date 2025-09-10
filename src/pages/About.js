import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';
import '../modern-theme.css';

function About() {
    const { isDarkMode } = useTheme();

    return (
        <>
            <Helmet>
                <title>About Us - Tech News Portal</title>
                <meta name="description" content="About page coming soon - Tech News Portal" />
                <meta name="keywords" content="about us, tech news portal, coming soon" />
            </Helmet>

            <div className={`coming-soon-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <div className="coming-soon-content">
                    <h1 className="coming-soon-title">About Us</h1>
                    <p className="coming-soon-subtitle">Coming Soon</p>
                    <div className="coming-soon-message">
                        <p>We're working on something amazing. Stay tuned!</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;
