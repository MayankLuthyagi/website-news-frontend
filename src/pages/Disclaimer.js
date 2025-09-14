import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';

function Disclaimer() {
    const { isDarkMode } = useTheme();

    return (
        <>
            <Helmet>
                <title>Disclaimer - Tech News Portal</title>
                <meta name="description" content="Disclaimer page coming soon - Tech News Portal" />
                <meta name="keywords" content="disclaimer, tech news portal, coming soon" />
            </Helmet>

            <div className={`coming-soon-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <div className="coming-soon-content">
                    <h1 className="coming-soon-title">Disclaimer</h1>
                    <p className="coming-soon-subtitle">Coming Soon</p>
                </div>
            </div>
        </>
    );
}

export default Disclaimer;
