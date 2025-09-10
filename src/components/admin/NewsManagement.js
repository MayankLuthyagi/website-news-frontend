import React, { useState, useEffect } from 'react';
import config from '../../config/config';

export default function NewsManagement({ selectedCategory, allowFilter }) {
    const [news, setNews] = useState([]);
    const [sources, setSources] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingNews, setEditingNews] = useState(null);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    // Local filters (in addition to parent filters)
    const [selectedSource, setSelectedSource] = useState('');
    const [localSelectedCategory, setLocalSelectedCategory] = useState('');
    const [showDisallowedOnly, setShowDisallowedOnly] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        original_title: '',
        summary: '',
        html_content: '',
        link: '',
        source_id: '',
        category: '',
        subcategory: '',
        date: '',
        image_url: '',
        count: 0,
        allow: true
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const categories = [
        'World', 'India', 'Tech', 'Politics', 'Sports',
        'Entertainment', 'Health', 'Business', 'Finance', 'Education'
    ];

    const subcategories = {
        'Tech': ['AI', 'Cybersecurity', 'Quantum Computing', 'AR/VR', 'Edge Computing', '6G & IoT', 'Sustainable Tech', 'Gadgets', 'Internet', 'Gaming', 'Cloud', 'Semiconductors', 'Web3', 'Green Tech', 'EdTech', 'HealthTech', 'Autotech', 'Space Tech'],
        'Business': ['Startups', 'Corporates', 'Markets', 'Economy', 'Industry'],
        'Finance': ['Stock Market', 'Banking', 'Cryptocurrency', 'Personal Finance'],
        'World': ['US', 'Europe', 'Middle East', 'Asia', 'Africa', 'Global Events'],
        'India': ['Politics', 'Economy', 'Society', 'Culture', 'States'],
        'Health': ['Medicine', 'Wellness', 'Mental Health', 'Research', 'Fitness'],
        'Sports': ['Cricket', 'Football', 'Tennis', 'Olympics', 'Events'],
        'Education': ['Schools', 'Colleges', 'Exams', 'Policy', 'EdTech'],
        'Entertainment': ['Movies', 'TV', 'Music', 'Celebrities', 'OTT'],
        'Politics': ['Elections', 'Government', 'Policy', 'International Relations']
    };
    
    useEffect(() => {
        fetchNews();
        fetchSources();
    }, [selectedCategory, allowFilter, selectedSource, localSelectedCategory, currentPage, showDisallowedOnly]);

    const fetchNews = async () => {
        try {
            setLoading(true);
            let url = `${config.api.base}${config.api.getAllNewsAdmin}`;
            
            const params = new URLSearchParams();
            const categoryToUse = localSelectedCategory || selectedCategory;
            
            if (categoryToUse) params.append('category', categoryToUse);
            if (selectedSource) params.append('source', selectedSource);
            
            // Handle allow filter
            if (showDisallowedOnly) {
                params.append('allow', 'false');
            } else if (typeof allowFilter === 'boolean') {
                params.append('allow', allowFilter.toString());
            }
            
            // Pagination
            params.append('page', currentPage.toString());
            params.append('limit', itemsPerPage.toString());
            
            url += `?${params.toString()}`;
            
            const response = await fetch(url);
            if (response.ok) {
                const data = await response.json();
                setNews(data.data);
                setTotalItems(data.total);
                setTotalPages(data.totalPages);
            } else {
                setError('Failed to fetch news');
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
            const response = await fetch(`${config.api.base}${config.api.sources}`);
            if (response.ok) {
                const data = await response.json();
                setSources(Array.isArray(data) ? data : []);
            } else {
                console.error('Failed to fetch sources');
                setSources([]);
            }
        } catch (error) {
            console.error('Error fetching sources:', error);
            setSources([]);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'category') {
            // Clear subcategory when category changes
            setFormData(prev => ({
                ...prev,
                [name]: value,
                subcategory: '' // Reset subcategory when category changes
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
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

            // Format the data before sending
            const submitData = {
                ...formData,
                source_id: formData.source_id ? parseInt(formData.source_id) : null,
                count: parseInt(formData.count) || 0,
                pub_date: formData.date ? new Date(formData.date).toISOString() : null
            };

            // Remove the 'date' field and use 'pub_date' instead
            delete submitData.date;

            console.log('Submitting data:', submitData); // Debug log

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData)
            });

            if (response.ok) {
                const responseData = await response.json();
                setSuccess(editingNews ? 'News updated successfully!' : 'News created successfully!');

                // If editing, update the local state immediately
                if (editingNews) {
                    setNews(prevNews =>
                        prevNews.map(item =>
                            item.id === editingNews.id
                                ? { ...item, ...submitData }
                                : item
                        )
                    );
                } else {
                    // If creating new news, refetch to get the new item with ID
                    fetchNews();
                }

                resetForm();

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            } else {
                // Enhanced error handling
                let errorMessage = `HTTP ${response.status}: ${response.statusText}`;

                try {
                    const contentType = response.headers.get('content-type');
                    if (contentType && contentType.includes('application/json')) {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorData.error || errorMessage;

                        // Log detailed error for debugging
                        console.error('Backend error details:', {
                            status: response.status,
                            statusText: response.statusText,
                            errorData: errorData,
                            submittedData: submitData
                        });
                    } else {
                        // If response is not JSON, get text for debugging
                        const errorText = await response.text();
                        console.error('Backend error (non-JSON):', {
                            status: response.status,
                            statusText: response.statusText,
                            errorText: errorText.substring(0, 500), // First 500 chars
                            submittedData: submitData
                        });
                    }
                } catch (parseError) {
                    console.error('Error parsing backend response:', parseError);
                }

                setError(errorMessage);
            }
        } catch (error) {
            console.error('Error saving news:', {
                error: error,
                message: error.message,
                submittedData: formData,
                url: editingNews ? `${config.api.base}${config.api.news}/${editingNews.id}` : `${config.api.base}${config.api.news}`,
                method: editingNews ? 'PUT' : 'POST'
            });
            setError(`Network error: ${error.message}`);
        }
    };

    const handleEdit = (newsItem) => {
        setEditingNews(newsItem);

        // Format date for datetime-local input
        let formattedPubDate = '';
        if (newsItem.pub_date || newsItem.date) {
            try {
                const date = new Date(newsItem.pub_date || newsItem.date);
                // Format as YYYY-MM-DDTHH:MM for datetime-local input
                formattedPubDate = date.toISOString().slice(0, 16);
            } catch (error) {
                console.warn('Error formatting date:', error);
                formattedPubDate = '';
            }
        }

        setFormData({
            title: newsItem.title || '',
            original_title: newsItem.original_title || '',
            summary: newsItem.summary || '',
            html_content: newsItem.html_content || '',
            link: newsItem.link || '',
            source_id: newsItem.source_id ? newsItem.source_id.toString() : '',
            category: newsItem.category || '',
            subcategory: newsItem.subcategory || '',
            date: formattedPubDate,
            image_url: newsItem.image || '',
            count: newsItem.count || 0,
            allow: newsItem.allow !== undefined ? newsItem.allow : true
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

    const updateNewsAllowStatus = async (id, allowStatus) => {
        try {
            const url = `${config.api.base}${config.api.news}/${id}/allow`;
            console.log('Updating news allow status - URL:', url, 'Data:', { allow: allowStatus });

            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ allow: allowStatus })
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                // Update the local state immediately without refetching all news
                setNews(prevNews =>
                    prevNews.map(item =>
                        item.id === id
                            ? { ...item, allow: allowStatus }
                            : item
                    )
                );

                setSuccess(`News ${allowStatus ? 'allowed' : 'disallowed'} successfully!`);

                // Clear success message after 3 seconds
                setTimeout(() => {
                    setSuccess('');
                }, 3000);
            } else {
                // Check if response is JSON or HTML
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorData = await response.json();
                    setError(errorData.message || `Failed to update news status (${response.status})`);
                } else {
                    // Server returned HTML (likely 404 page)
                    setError(`API endpoint not found (${response.status}). The backend may not have the PUT /api/news/:id/allow endpoint implemented.`);
                }
            }
        } catch (error) {
            console.error('Error updating news allow status:', error);
            if (error.message.includes('Unexpected token')) {
                setError('Backend API endpoint not found or returned invalid response. Please check if PUT /api/news/:id/allow is implemented.');
            } else {
                setError('Failed to update news status: ' + error.message);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            original_title: '',
            summary: '',
            html_content: '',
            link: '',
            source_id: '',
            category: '',
            subcategory: '',
            date: '',
            image_url: '',
            count: 0,
            allow: true
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

    // Pagination handlers
    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSourceFilterChange = (e) => {
        setSelectedSource(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleCategoryFilterChange = (e) => {
        setLocalSelectedCategory(e.target.value);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    const handleDisallowedOnlyChange = (e) => {
        setShowDisallowedOnly(e.target.checked);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    // Reset filters
    const resetFilters = () => {
        setSelectedSource('');
        setLocalSelectedCategory('');
        setShowDisallowedOnly(false);
        setCurrentPage(1);
    };

    // Generate pagination pages array
    const getPaginationPages = () => {
        const pages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
            let end = Math.min(totalPages, start + maxVisible - 1);

            if (end - start + 1 < maxVisible) {
                start = Math.max(1, end - maxVisible + 1);
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages;
    };

    // Calculate items for current page (for client-side pagination)
    const getCurrentPageItems = () => {
        if (!Array.isArray(news)) return [];

        // If we have server-side pagination, return all items as they're already paginated
        if (totalPages > 1 && news.length <= itemsPerPage) {
            return news;
        }

        // Otherwise, do client-side pagination
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return news.slice(startIndex, endIndex);
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

            {/* Filters Section */}
            <div className="admin-filters-section">
                <div className="admin-filters-row">
                    <div className="admin-filter-group">
                        <label htmlFor="categoryFilter">Category:</label>
                        <select
                            id="categoryFilter"
                            value={localSelectedCategory}
                            onChange={handleCategoryFilterChange}
                            className="admin-filter-select"
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-filter-group">
                        <label htmlFor="sourceFilter">Source:</label>
                        <select
                            id="sourceFilter"
                            value={selectedSource}
                            onChange={handleSourceFilterChange}
                            className="admin-filter-select"
                        >
                            <option value="">All Sources</option>
                            {sources.map(source => (
                                <option key={source.id} value={source.id}>
                                    {source.source_name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="admin-filter-group">
                        <label htmlFor="disallowedOnlyFilter" className="admin-checkbox-label">
                            <input
                                type="checkbox"
                                id="disallowedOnlyFilter"
                                checked={showDisallowedOnly}
                                onChange={handleDisallowedOnlyChange}
                                className="admin-checkbox"
                            />
                            <span className="admin-checkbox-text">Show only disallowed news</span>
                        </label>
                    </div>

                    {(selectedSource || localSelectedCategory || showDisallowedOnly) && (
                        <button
                            onClick={resetFilters}
                            className="admin-btn admin-btn-secondary admin-btn-sm"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>

                {/* Filter Status Display */}
                <div className="admin-filter-status">
                    <span className="admin-filter-info">
                        Showing {news.length} of {totalItems} items
                        {(localSelectedCategory || selectedCategory) && <span> • Category: <strong>{localSelectedCategory || selectedCategory}</strong></span>}
                        {typeof allowFilter === 'boolean' && <span> • Status: <strong>{allowFilter ? 'Allowed' : 'Disallowed'}</strong></span>}
                        {selectedSource && <span> • Source: <strong>{sources.find(s => s.id.toString() === selectedSource)?.source_name}</strong></span>}
                        {showDisallowedOnly && <span> • Status: <strong>Disallowed Only</strong></span>}
                    </span>
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
                                <label htmlFor="subcategory">Subcategory</label>
                                <select
                                    id="subcategory"
                                    name="subcategory"
                                    value={formData.subcategory}
                                    onChange={handleInputChange}
                                    disabled={!formData.category}
                                >
                                    <option value="">Select Subcategory</option>
                                    {formData.category && subcategories[formData.category] && 
                                        subcategories[formData.category].map(subcategory => (
                                            <option key={subcategory} value={subcategory}>
                                                {subcategory}
                                            </option>
                                        ))
                                    }
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label htmlFor="date">Publication Date</label>
                                <input
                                    type="datetime-local"
                                    id="date"
                                    name="date"
                                    value={formData.date}
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

                            <div className="admin-form-group">
                                <label htmlFor="allow">Allow Status</label>
                                <select
                                    id="allow"
                                    name="allow"
                                    value={formData.allow.toString()}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        allow: e.target.value === 'true'
                                    }))}
                                    className="admin-form-select"
                                >
                                    <option value="true">Allowed</option>
                                    <option value="false">Disallowed</option>
                                </select>
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

                        <div className="admin-form-group admin-form-group-full">
                            <label htmlFor="html_content">HTML Content</label>
                            <textarea
                                id="html_content"
                                name="html_content"
                                value={formData.html_content}
                                onChange={handleInputChange}
                                rows="6"
                                placeholder="Enter detailed HTML content for the news article..."
                            />
                            <small className="admin-form-help">
                                Optional: Rich HTML content for the full article. Will default to summary if not provided.
                            </small>
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
                                <th>Status</th>
                                <th>Date</th>
                                <th>Count</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(() => {
                                const displayItems = getCurrentPageItems();
                                if (!Array.isArray(displayItems) || displayItems.length === 0) {
                                    return (
                                        <tr>
                                            <td colSpan="7" className="admin-table-empty">
                                                No news found
                                            </td>
                                        </tr>
                                    );
                                }

                                return displayItems.map(item => (
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
                                        <td>
                                            <span className={`admin-status-badge ${item.allow ? 'admin-status-allowed' : 'admin-status-disallowed'}`}>
                                                {item.allow ? 'Allowed' : 'Disallowed'}
                                            </span>
                                        </td>
                                        <td>{(item.pub_date || item.date) ? formatDate(item.pub_date || item.date) : 'N/A'}</td>
                                        <td>{item.count || 0}</td>
                                        <td>
                                            <div className="admin-table-actions">
                                                <button
                                                    onClick={() => updateNewsAllowStatus(item.id, !item.allow)}
                                                    className={`admin-btn admin-btn-sm ${item.allow ? 'admin-btn-warning' : 'admin-btn-success'}`}
                                                    title={item.allow ? 'Disallow news' : 'Allow news'}
                                                >
                                                    {item.allow ? (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <line x1="15" y1="9" x2="9" y2="15" />
                                                            <line x1="9" y1="9" x2="15" y2="15" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <polyline points="9,11 12,14 22,4" />
                                                            <path d="M21,12v7a2,2 0 01-2,2H5a2,2 0 01-2-2V5a2,2 0 012-2h11" />
                                                        </svg>
                                                    )}
                                                </button>
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
                                ));
                            })()}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="admin-pagination">
                    <div className="admin-pagination-info">
                        Page {currentPage} of {totalPages}
                    </div>

                    <div className="admin-pagination-controls">
                        <button
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="First Page"
                        >
                            ««
                        </button>

                        <button
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="Previous Page"
                        >
                            «
                        </button>

                        {getPaginationPages().map(page => (
                            <button
                                key={page}
                                onClick={() => handlePageChange(page)}
                                className={`admin-btn admin-btn-sm ${page === currentPage ? 'admin-btn-primary' : 'admin-btn-secondary'}`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="Next Page"
                        >
                            »
                        </button>

                        <button
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                            className="admin-btn admin-btn-sm admin-btn-secondary"
                            title="Last Page"
                        >
                            »»
                        </button>
                    </div>

                    <div className="admin-pagination-summary">
                        Showing {Math.min(((currentPage - 1) * itemsPerPage) + 1, totalItems)} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} items
                    </div>
                </div>
            )}
        </div>
    );
}