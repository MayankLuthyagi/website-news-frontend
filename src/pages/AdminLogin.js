import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import '../index.css';

export default function AdminLogin() {
    const [credentials, setCredentials] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Hardcoded admin credentials (stored in frontend for now as requested)
    const ADMIN_CREDENTIALS = {
        username: 'admin',
        password: 'admin123'
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
        if (error) setError('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Simulate login delay
        setTimeout(() => {
            if (credentials.username === ADMIN_CREDENTIALS.username &&
                credentials.password === ADMIN_CREDENTIALS.password) {

                // Store admin session in localStorage
                localStorage.setItem('adminLoggedIn', 'true');
                localStorage.setItem('adminUsername', credentials.username);
                localStorage.setItem('adminLoginTime', new Date().toISOString());

                navigate('/admin/dashboard');
            } else {
                setError('Invalid username or password');
            }
            setLoading(false);
        }, 500);
    };

    return (
        <>
            <Helmet>
                <title>Admin Login - Daily Brief Newsly</title>
                <meta name="description" content="Admin login for Daily Brief Newsly content management system" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-login-container">
                <div className="admin-login-card">
                    <div className="admin-login-header">
                        <h1>Admin Login</h1>
                        <p>Daily Brief Newsly - Content Management System</p>
                    </div>

                    <form onSubmit={handleSubmit} className="admin-login-form">
                        {error && (
                            <div className="admin-error-message">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="15" y1="9" x2="9" y2="15" />
                                    <line x1="9" y1="9" x2="15" y2="15" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div className="admin-form-group">
                            <label htmlFor="username">Username</label>
                            <input
                                type="text"
                                id="username"
                                name="username"
                                value={credentials.username}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="Enter admin username"
                                autoComplete="username"
                            />
                        </div>

                        <div className="admin-form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={credentials.password}
                                onChange={handleInputChange}
                                required
                                disabled={loading}
                                placeholder="Enter admin password"
                                autoComplete="current-password"
                            />
                        </div>

                        <button
                            type="submit"
                            className="admin-login-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="admin-loading-spinner" width="20" height="20" viewBox="0 0 24 24">
                                        <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeDasharray="31.416" strokeDashoffset="31.416">
                                            <animate attributeName="stroke-dasharray" dur="2s" values="0 31.416;15.708 15.708;0 31.416" repeatCount="indefinite" />
                                            <animate attributeName="stroke-dashoffset" dur="2s" values="0;-15.708;-31.416" repeatCount="indefinite" />
                                        </circle>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
