import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import '../index.css';

function formatRelativeDate(dateString) {
    const dateObj = new Date(dateString);
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin} minute${diffMin > 1 ? 's' : ''} ago`;
    if (diffHour < 24) return `${diffHour} hour${diffHour > 1 ? 's' : ''} ago`;
    if (diffDay < 7) return `${diffDay} day${diffDay > 1 ? 's' : ''} ago`;
    return dateObj.toLocaleDateString();
}

function SidebarNewsCard({ title, summary, url, date, source_id, source_name, category, image, newsData }) {
    const navigate = useNavigate();
    const [sourceName, setSourceName] = useState(source_name || 'Unknown Source');
    const [imageUrl, setImageUrl] = useState(image || null);
    const [imageError, setImageError] = useState(false);

    // If source_name is not provided, fetch it using source_id
    useEffect(() => {
        async function fetchSourceName() {
            if (!source_name && source_id) {
                try {
                    const response = await fetch(`${config.api.base}${config.api.sources}/${source_id}`);
                    if (response.ok) {
                        const data = await response.json();
                        setSourceName(data.source_name);
                    } else {
                        setSourceName('Unknown Source');
                    }
                } catch (error) {
                    console.error('Error fetching source name:', error);
                    setSourceName('Unknown Source');
                }
            }
        }

        fetchSourceName();
    }, [source_id, source_name]);

    // Reset image error when imageUrl changes
    useEffect(() => {
        setImageError(false);
    }, [imageUrl]);

    // Handle image fallback - use category-based images
    useEffect(() => {
        if (!image && category) {
            // Try category-based image
            const firstCategory = category.split(',')[0].trim().toLowerCase();
            setImageUrl(`/images/${firstCategory}.png`);
        }
    }, [image, category]);

    const handleImageError = () => {
        if (!imageError) {
            setImageError(true);
            // If image fails to load, try category-based image as fallback
            if (category) {
                const firstCategory = category.split(',')[0].trim().toLowerCase();
                setImageUrl(`/images/${firstCategory}.png`);
            } else {
                // No category available, hide image
                setImageUrl(null);
            }
        } else {
            // Even category-based fallback failed, hide image
            setImageUrl(null);
        }
    };

    const firstCategory = category ? category.split(',')[0].trim() : '';
    const categoryClass = firstCategory ? `news-card-category news-card-category-${firstCategory.toLowerCase()}` : 'news-card-category';

    const handleCardClick = (e) => {
        e.preventDefault();
        // Create URL-friendly title
        const urlFriendlyTitle = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

        navigate(`/news-detail/${urlFriendlyTitle}`, {
            state: {
                newsData: newsData || {
                    title,
                    summary,
                    link: url, // Keep it as 'link' to match the API data structure
                    url: url,  // Also keep 'url' for backward compatibility
                    date,
                    source_id,
                    source_name: sourceName,
                    category,
                    image
                }
            }
        });
    };

    return (
        <div
            className="sidebar-news-card"
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            <div className="sidebar-news-card-header">
                <div className="news-category">
                    <span className={categoryClass}>{firstCategory}</span>
                </div>
                <span className="sidebar-news-card-date">{sourceName} . {formatRelativeDate(date)}</span>
            </div>

            <div className="sidebar-news-card-content">
                <div className="sidebar-news-card-image">
                    {imageUrl && (
                        <img
                            src={imageUrl}
                            alt={sourceName}
                            onError={handleImageError}
                        />
                    )}
                    {!imageUrl && (
                        <div className="sidebar-news-card-no-image">
                            <span>{sourceName}</span>
                        </div>
                    )}
                </div>

                <div className="sidebar-news-card-text">
                    <h4 className="sidebar-news-card-title">{title}</h4>
                    <p className="sidebar-news-card-summary">
                        {summary.length > 100 ? summary.slice(0, 100) + '...' : summary}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SidebarNewsCard;
