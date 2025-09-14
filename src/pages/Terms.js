import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';

function Terms() {
    const { isDarkMode } = useTheme();

    return (
        <>
            <Helmet>
                <title>Terms of Service - Tech News Portal</title>
                <meta name="description" content="Terms of Service page coming soon - Tech News Portal" />
                <meta name="keywords" content="terms of service, tech news portal, coming soon" />
            </Helmet>

            <div className={`coming-soon-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <div className="coming-soon-content">
                    <h1 className="coming-soon-title">Terms of Service</h1>
                    <p className="coming-soon-subtitle">Coming Soon</p>
                </div>
            </div>
        </>
    );
}

export default Terms;
