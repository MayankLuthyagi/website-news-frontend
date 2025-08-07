import React, { useState, useEffect } from 'react';
import config from '../../config/config';

export default function SourceManagement() {
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingSource, setEditingSource] = useState(null);
    const [formData, setFormData] = useState({
        source_name: '',
        rss_url: '',
        category: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('');
    const [filteredSources, setFilteredSources] = useState([]);

    const sourceCategories = [
        'World', 'India', 'Tech', 'Politics', 'Sports',
        'Entertainment', 'Health', 'Business', 'Finance', 'Education'
    ];

    useEffect(() => {
        fetchSources();
        fetchSourceCategories();
    }, []);

    useEffect(() => {
        // Filter sources based on selected category
        if (selectedCategoryFilter) {
            setFilteredSources(sources.filter(source => source.category === selectedCategoryFilter));
        } else {
            setFilteredSources(sources);
        }
    }, [sources, selectedCategoryFilter]);

    const fetchSources = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.api.base}${config.api.sources}`);
            if (response.ok) {
                const data = await response.json();
                setSources(Array.isArray(data) ? data : []);
            } else {
                setError('Failed to fetch sources');
                setSources([]);
            }
        } catch (error) {
            console.error('Error fetching sources:', error);
            setError('Failed to fetch sources');
            setSources([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchSourceCategories = async () => {
        try {
            const response = await fetch(`${config.api.base}${config.api.sources}/categories`);
            if (response.ok) {
                const data = await response.json();
                if (data.categories && Array.isArray(data.categories)) {
                    setCategories(data.categories);
                }
            }
        } catch (error) {
            console.error('Error fetching source categories:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Validate RSS URL
        if (!validateUrl(formData.rss_url)) {
            setError('Please enter a valid RSS URL');
            return;
        }

        try {
            const url = editingSource
                ? `${config.api.base}${config.api.sources}/${editingSource.id}`
                : `${config.api.base}${config.api.sources}`;

            const method = editingSource ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(editingSource ? 'Source updated successfully!' : 'Source created successfully!');
                resetForm();
                fetchSources();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save source');
            }
        } catch (error) {
            console.error('Error saving source:', error);
            setError('Failed to save source');
        }
    };

    const handleEdit = (source) => {
        setEditingSource(source);
        setFormData({
            source_name: source.source_name || '',
            rss_url: source.rss_url || '',
            category: source.category || ''
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this source? This will also affect all news items from this source.')) {
            try {
                const response = await fetch(`${config.api.base}${config.api.sources}/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setSuccess('Source deleted successfully!');
                    fetchSources();
                } else {
                    setError('Failed to delete source');
                }
            } catch (error) {
                console.error('Error deleting source:', error);
                setError('Failed to delete source');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            source_name: '',
            rss_url: '',
            category: ''
        });
        setEditingSource(null);
        setShowForm(false);
    };

    const testRssFeed = async (url) => {
        try {
            const response = await fetch(`${config.api.base}${config.api.sources}/test-rss`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rss_url: url })
            });

            if (response.ok) {
                setSuccess('RSS feed is valid and accessible!');
            } else {
                setError('RSS feed is not accessible or invalid');
            }
        } catch (error) {
            setError('Failed to test RSS feed');
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="admin-section">
            <div className="admin-section-header">
                <h2>Source Management</h2>
                <div className="admin-section-actions">
                    <button
                        className="admin-btn admin-btn-primary"
                        onClick={() => setShowForm(!showForm)}
                    >
                        {showForm ? 'Cancel' : '+ Add Source'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="admin-alert admin-alert-error">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="15" y1="9" x2="9" y2="15" />
                        <line x1="9" y1="9" x2="15" y2="15" />
                    </svg>
                    {error}
                </div>
            )}

            {success && (
                <div className="admin-alert admin-alert-success">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,11 12,14 22,4" />
                        <path d="M21,12v7a2,2 0 01-2,2H5a2,2 0 01-2-2V5a2,2 0 012-2h11" />
                    </svg>
                    {success}
                </div>
            )}

            {showForm && (
                <div className="admin-form-container">
                    <form onSubmit={handleSubmit} className="admin-form">
                        <div className="admin-form-grid">
                            <div className="admin-form-group">
                                <label htmlFor="source_name">Source Name *</label>
                                <input
                                    type="text"
                                    id="source_name"
                                    name="source_name"
                                    value={formData.source_name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g., BBC News, CNN, Reuters"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="category">Category *</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                    required
                                    className="admin-form-select"
                                >
                                    <option value="">Select Category</option>
                                    {sourceCategories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                                <small className="admin-form-help">
                                    Select the primary category for this news source
                                </small>
                            </div>

                            <div className="admin-form-group admin-form-group-full">
                                <label htmlFor="rss_url">RSS URL *</label>
                                <div className="admin-input-group">
                                    <input
                                        type="url"
                                        id="rss_url"
                                        name="rss_url"
                                        value={formData.rss_url}
                                        onChange={handleInputChange}
                                        required
                                        placeholder="https://example.com/rss.xml"
                                    />
                                    {formData.rss_url && (
                                        <button
                                            type="button"
                                            onClick={() => testRssFeed(formData.rss_url)}
                                            className="admin-btn admin-btn-sm admin-btn-secondary"
                                            title="Test RSS Feed"
                                        >
                                            Test
                                        </button>
                                    )}
                                </div>
                                <small className="admin-form-help">
                                    Enter the RSS feed URL for this news source
                                </small>
                            </div>
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="admin-btn admin-btn-primary">
                                {editingSource ? 'Update Source' : 'Create Source'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-table-container">
                {loading ? (
                    <div className="admin-loading">Loading sources...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Source Name</th>
                                <th>Category</th>
                                <th>RSS URL</th>
                                <th>Status</th>
                                <th>Created</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSources.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="admin-table-empty">
                                        {selectedCategoryFilter
                                            ? `No sources found for category: ${selectedCategoryFilter}`
                                            : 'No sources found'
                                        }
                                    </td>
                                </tr>
                            ) : (
                                filteredSources.map(source => (
                                    <tr key={source.id}>
                                        <td>#{source.id}</td>
                                        <td className="admin-table-title">
                                            <strong>{source.source_name}</strong>
                                        </td>
                                        <td>
                                            <span className="admin-category-badge">
                                                {source.category || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="admin-table-url">
                                            <a
                                                href={source.rss_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                title={source.rss_url}
                                            >
                                                {source.rss_url.length > 40
                                                    ? `${source.rss_url.substring(0, 40)}...`
                                                    : source.rss_url}
                                            </a>
                                        </td>
                                        <td>
                                            <span className="admin-status-badge admin-status-active">
                                                Active
                                            </span>
                                        </td>
                                        <td>
                                            {source.created_at
                                                ? formatDate(source.created_at)
                                                : 'N/A'
                                            }
                                        </td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button
                                                    onClick={() => testRssFeed(source.rss_url)}
                                                    className="admin-btn admin-btn-sm admin-btn-info"
                                                    title="Test RSS Feed"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleEdit(source)}
                                                    className="admin-btn admin-btn-sm admin-btn-secondary"
                                                    title="Edit"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(source.id)}
                                                    className="admin-btn admin-btn-sm admin-btn-danger"
                                                    title="Delete"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3,6 5,6 21,6" />
                                                        <path d="M19,6v14a2,2 0 01-2,2H7a2,2 0 01-2-2V6m3,0V4a2,2 0 012-2h4a2,2 0 012,2v2" />
                                                        <line x1="10" y1="11" x2="10" y2="17" />
                                                        <line x1="14" y1="11" x2="14" y2="17" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                )}
            </div>

            <div className="admin-section-footer">
                <div className="admin-stats">
                    <div className="admin-stat">
                        <span className="admin-stat-number">{sources.length}</span>
                        <span className="admin-stat-label">Total Sources</span>
                    </div>
                    <div className="admin-stat">
                        <span className="admin-stat-number">{sources.filter(s => s.rss_url).length}</span>
                        <span className="admin-stat-label">Active RSS Feeds</span>
                    </div>
                    <div className="admin-stat">
                        <span className="admin-stat-number">{sources.filter(s => s.category).length}</span>
                        <span className="admin-stat-label">Categorized Sources</span>
                    </div>
                    <div className="admin-stat">
                        <span className="admin-stat-number">{categories.length}</span>
                        <span className="admin-stat-label">Categories</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
