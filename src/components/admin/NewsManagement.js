import React, { useState, useEffect } from 'react';
import config from '../../config/config';

export default function NewsManagement() {
    const [news, setNews] = useState([]);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNews, setEditingNews] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        original_title: '',
        summary: '',
        link: '',
        source_id: '',
        category: '',
        pub_date: '',
        image_url: '',
        count: 0
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        'World', 'India', 'Tech', 'Politics', 'Sports',
        'Entertainment', 'Health', 'Business', 'Finance', 'Education'
    ];

    useEffect(() => {
        fetchNews();
        fetchSources();
    }, []);

    const fetchNews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${config.api.base}${config.api.news}`);
            if (response.ok) {
                const data = await response.json();
                setNews(data);
            }
        } catch (error) {
            console.error('Error fetching news:', error);
            setError('Failed to fetch news');
        } finally {
            setLoading(false);
        }
    };

    const fetchSources = async () => {
        try {
            const response = await fetch(`${config.api.base}/sources`);
            if (response.ok) {
                const data = await response.json();
                setSources(data);
            }
        } catch (error) {
            console.error('Error fetching sources:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            const url = editingNews
                ? `${config.api.base}${config.api.news}/${editingNews.id}`
                : `${config.api.base}${config.api.news}`;

            const method = editingNews ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                setSuccess(editingNews ? 'News updated successfully!' : 'News created successfully!');
                resetForm();
                fetchNews();
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Failed to save news');
            }
        } catch (error) {
            console.error('Error saving news:', error);
            setError('Failed to save news');
        }
    };

    const handleEdit = (newsItem) => {
        setEditingNews(newsItem);
        setFormData({
            title: newsItem.title || '',
            original_title: newsItem.original_title || '',
            summary: newsItem.summary || '',
            link: newsItem.link || '',
            source_id: newsItem.source_id || '',
            category: newsItem.category || '',
            pub_date: newsItem.pub_date ? newsItem.pub_date.split('T')[0] : '',
            image_url: newsItem.image_url || '',
            count: newsItem.count || 0
        });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this news item?')) {
            try {
                const response = await fetch(`${config.api.base}${config.api.news}/${id}`, {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setSuccess('News deleted successfully!');
                    fetchNews();
                } else {
                    setError('Failed to delete news');
                }
            } catch (error) {
                console.error('Error deleting news:', error);
                setError('Failed to delete news');
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            original_title: '',
            summary: '',
            link: '',
            source_id: '',
            category: '',
            pub_date: '',
            image_url: '',
            count: 0
        });
        setEditingNews(null);
        setShowForm(false);
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
                <h2>News Management</h2>
                <button
                    className="admin-btn admin-btn-primary"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : '+ Add News'}
                </button>
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
                                <label htmlFor="title">Title *</label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter news title"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="original_title">Original Title *</label>
                                <input
                                    type="text"
                                    id="original_title"
                                    name="original_title"
                                    value={formData.original_title}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="Enter original title"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="link">Link *</label>
                                <input
                                    type="url"
                                    id="link"
                                    name="link"
                                    value={formData.link}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="https://example.com/news-article"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="source_id">Source</label>
                                <select
                                    id="source_id"
                                    name="source_id"
                                    value={formData.source_id}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Source</option>
                                    {sources.map(source => (
                                        <option key={source.id} value={source.id}>
                                            {source.source_name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="category">Category</label>
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleInputChange}
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(category => (
                                        <option key={category} value={category}>
                                            {category}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="pub_date">Publication Date</label>
                                <input
                                    type="datetime-local"
                                    id="pub_date"
                                    name="pub_date"
                                    value={formData.pub_date}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="image_url">Image URL</label>
                                <input
                                    type="url"
                                    id="image_url"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleInputChange}
                                    placeholder="https://example.com/image.jpg"
                                />
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="count">Count</label>
                                <input
                                    type="number"
                                    id="count"
                                    name="count"
                                    value={formData.count}
                                    onChange={handleInputChange}
                                    min="0"
                                />
                            </div>
                        </div>

                        <div className="admin-form-group admin-form-group-full">
                            <label htmlFor="summary">Summary</label>
                            <textarea
                                id="summary"
                                name="summary"
                                value={formData.summary}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Enter news summary..."
                            />
                        </div>

                        <div className="admin-form-actions">
                            <button type="button" onClick={resetForm} className="admin-btn admin-btn-secondary">
                                Cancel
                            </button>
                            <button type="submit" className="admin-btn admin-btn-primary">
                                {editingNews ? 'Update News' : 'Create News'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="admin-table-container">
                {loading ? (
                    <div className="admin-loading">Loading news...</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Source</th>
                                <th>Date</th>
                                <th>Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {news.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="admin-table-empty">
                                        No news found
                                    </td>
                                </tr>
                            ) : (
                                news.map(item => (
                                    <tr key={item.id}>
                                        <td className="admin-table-title">
                                            <div>
                                                <strong>{item.title}</strong>
                                                <small>{item.original_title}</small>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="admin-category-badge">
                                                {item.category || 'N/A'}
                                            </span>
                                        </td>
                                        <td>{item.source_name || 'N/A'}</td>
                                        <td>{item.pub_date ? formatDate(item.pub_date) : 'N/A'}</td>
                                        <td>{item.count || 0}</td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="admin-btn admin-btn-sm admin-btn-secondary"
                                                    title="Edit"
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                                                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
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
        </div>
    );
}
