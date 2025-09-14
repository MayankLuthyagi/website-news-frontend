import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';

function Contact() {
    const { isDarkMode } = useTheme();

    return (
        <>
            <Helmet>
                <title>Contact Us - Tech News Portal</title>
                <meta name="description" content="Contact page coming soon - Tech News Portal" />
                <meta name="keywords" content="contact us, tech news portal, coming soon" />
            </Helmet>

            <div className={`coming-soon-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <div className="coming-soon-content">
                    <h1 className="coming-soon-title">Contact Us</h1>
                    <p className="coming-soon-subtitle">Coming Soon</p>
                </div>
            </div>
        </>
    );
}

export default Contact;
