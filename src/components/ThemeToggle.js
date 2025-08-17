import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

const ThemeToggle = () => {
    const { isDarkMode, toggleTheme } = useTheme();

    return (
        <button
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
            title={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        >
            <div className="theme-toggle-track">
                <div className="theme-toggle-thumb">
                    {isDarkMode ? (
                        <svg className="theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" fill="currentColor" />
                        </svg>
                    ) : (
                        <svg className="theme-icon" width="14" height="14" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="5" fill="currentColor" />
                            <path d="m12 1-2 2 2 2 2-2-2-2ZM21 11h-3v2h3v-2ZM6 11H3v2h3v-2ZM12.5 19.5l-2 2 2 2 2-2-2-2ZM18.36 5.64l-1.41 1.41 1.41 1.42 1.42-1.42-1.42-1.41ZM5.64 5.64l-1.42 1.41 1.42 1.42 1.41-1.42-1.41-1.41ZM18.36 18.36l-1.41-1.41-1.42 1.41 1.42 1.42 1.41-1.42ZM5.64 18.36l1.41-1.41-1.41-1.42-1.42 1.42 1.42 1.41Z" fill="currentColor" />
                        </svg>
                    )}
                </div>
            </div>
        </button>
    );
};

export default ThemeToggle;
