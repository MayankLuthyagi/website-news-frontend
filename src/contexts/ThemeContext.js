import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            setIsDarkMode(savedTheme === 'dark');
        } else {
            // Check system preference
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            setIsDarkMode(prefersDark);
        }
    }, []);

    // Update theme in localStorage and CSS custom properties
    useEffect(() => {
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');

        // Update CSS custom properties for dynamic theming
        const root = document.documentElement;
        if (isDarkMode) {
            root.style.setProperty('--bg-primary', '#0f0f1a');
            root.style.setProperty('--bg-secondary', '#121212');
            root.style.setProperty('--bg-tertiary', '#1a1a2e');
            root.style.setProperty('--text-primary', '#ffffff');
            root.style.setProperty('--text-secondary', '#e0e0e0');
            root.style.setProperty('--text-muted', '#ffffff');
            root.style.setProperty('--accent-primary', '#00bcd4');
            root.style.setProperty('--accent-secondary', '#00ff99');
            root.style.setProperty('--accent-tertiary', '#8a2be2');
            root.style.setProperty('--border-color', '#2a2a3e');
            root.style.setProperty('--card-bg', '#1e1e2e');
            root.style.setProperty('--hover-bg', '#252538');
        } else {
            root.style.setProperty('--bg-primary', '#ffffff');
            root.style.setProperty('--bg-secondary', '#f8f9fa');
            root.style.setProperty('--bg-tertiary', '#f1f3f4');
            root.style.setProperty('--text-primary', '#1a1a1a');
            root.style.setProperty('--text-secondary', '#333333');
            root.style.setProperty('--text-muted', '#666666');
            root.style.setProperty('--accent-primary', '#00bcd4');
            root.style.setProperty('--accent-secondary', '#00c851');
            root.style.setProperty('--accent-tertiary', '#8a2be2');
            root.style.setProperty('--border-color', '#e0e0e0');
            root.style.setProperty('--card-bg', '#ffffff');
            root.style.setProperty('--hover-bg', '#f5f5f5');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
    };

    const value = {
        isDarkMode,
        toggleTheme,
        theme: isDarkMode ? 'dark' : 'light'
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
