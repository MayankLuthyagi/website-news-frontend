import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';

function Privacy() {
    const { isDarkMode } = useTheme();

    return (
        <>
            <Helmet>
                <title>Privacy Policy - Tech News Portal</title>
                <meta name="description" content="Privacy Policy page coming soon - Tech News Portal" />
                <meta name="keywords" content="privacy policy, tech news portal, coming soon" />
            </Helmet>

            <div className={`coming-soon-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <div className="coming-soon-content">
                    <h1 className="coming-soon-title">Privacy Policy</h1>
                    <p className="coming-soon-subtitle">Coming Soon</p>
                </div>
            </div>
        </>
    );
}

export default Privacy;