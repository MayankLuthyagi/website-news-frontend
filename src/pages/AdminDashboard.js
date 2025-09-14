import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import NewsManagement from '../components/admin/NewsManagement';
import SourceManagement from '../components/admin/SourceManagement';
import ThemeToggle from '../components/ThemeToggle';
import '../index.css';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('news');
    const [adminUser, setAdminUser] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [allowFilter, setAllowFilter] = useState(true);
    const [showDisallowedOnly, setShowDisallowedOnly] = useState(false);
    const navigate = useNavigate();

    const categories = [
        'World', 'India', 'Tech', 'Politics', 'Sports',
        'Entertainment', 'Health', 'Business', 'Finance', 'Education'
    ];

    useEffect(() => {
        // Check if admin is logged in
        const isLoggedIn = localStorage.getItem('adminLoggedIn');
        const username = localStorage.getItem('adminUsername');

        if (!isLoggedIn || isLoggedIn !== 'true') {
            navigate('/admin/login');
            return;
        }

        setAdminUser(username || 'Admin');
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('adminLoggedIn');
        localStorage.removeItem('adminUsername');
        localStorage.removeItem('adminLoginTime');
        navigate('/admin/login');
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const loginTime = localStorage.getItem('adminLoginTime');

    return (
        <>
            <Helmet>
                <title>Admin Dashboard - Daily Brief Newsly</title>
                <meta name="description" content="Admin dashboard for managing news and sources" />
                <meta name="robots" content="noindex, nofollow" />
            </Helmet>

            <div className="admin-dashboard">
                {/* Admin Header */}
                <header className="admin-header">
                    <div className="admin-header-content">
                        <div className="admin-brand">
                            <h1>Daily Brief Newsly</h1>
                            <span className="admin-subtitle">Content Management System</span>
                        </div>

                        <div className="admin-user-info">
                            <div className="admin-user-details">
                                <span className="admin-username">Welcome, {adminUser}</span>
                                {loginTime && (
                                    <span className="admin-login-time">
                                        Last login: {formatDate(loginTime)}
                                    </span>
                                )}
                            </div>
                            <div className="admin-header-actions">
                                <button onClick={handleLogout} className="admin-logout-btn">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                                        <polyline points="16,17 21,12 16,7" />
                                        <line x1="21" y1="12" x2="9" y2="12" />
                                    </svg>
                                    Logout
                                </button>
                                <ThemeToggle />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Admin Layout Container */}
                <div className="admin-layout">
                    {/* Admin Sidebar */}
                    <aside className="admin-sidebar">
                        <nav className="admin-sidebar-nav">
                            <div className="admin-sidebar-section">
                                <h3 className="admin-sidebar-title">Management</h3>
                                <ul className="admin-sidebar-menu">
                                    <li>
                                        <button
                                            className={`admin-sidebar-item ${activeTab === 'news' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('news')}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                                                <polyline points="14,2 14,8 20,8" />
                                                <line x1="16" y1="13" x2="8" y2="13" />
                                                <line x1="16" y1="17" x2="8" y2="17" />
                                                <polyline points="10,9 9,9 8,9" />
                                            </svg>
                                            <span>News Management</span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            className={`admin-sidebar-item ${activeTab === 'sources' ? 'active' : ''}`}
                                            onClick={() => setActiveTab('sources')}
                                        >
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
                                                <polyline points="3.27,6.96 12,12.01 20.73,6.96" />
                                                <line x1="12" y1="22.08" x2="12" y2="12" />
                                            </svg>
                                            <span>Source Management</span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </nav>
                    </aside>

                    {/* Admin Content */}
                    <main className="admin-main">
                        <div className="admin-content">
                            {activeTab === 'news' && (
                                <NewsManagement
                                    selectedCategory={selectedCategory}
                                    allowFilter={allowFilter}
                                />
                            )}
                            {activeTab === 'sources' && <SourceManagement />}
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
