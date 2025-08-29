import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';

function formatRelativeDate(dateString) {
    const dateObj = new Date(dateString);
    const now = new Date();
    const diffMs = now - dateObj;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);

    if (diffSec < 60) return 'just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHour < 24) return `${diffHour}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: dateObj.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

function SideModernNewsCard({
    id,
    title,
    summary,
    url,
    date,
    source_id,
    source_name,
    category,
    subcategory,
    image,
    variant = 'default' // 'default', 'featured', 'compact', 'hero'
}) {
    const navigate = useNavigate();
    const [sourceName, setSourceName] = useState(source_name || 'TechBrief Daily');
    const [imageUrl, setImageUrl] = useState(image || null);
    const [imageError, setImageError] = useState(false);

    const handleCardClick = (e) => {
        e.preventDefault();

        // Create URL-friendly title with dashes
        const urlFriendlyTitle = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/-+/g, '-') // Replace multiple dashes with single dash
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

        // Create news data object to pass to NewsDetail
        const newsData = {
            _id: id,
            id: id,
            title,
            summary,
            url,
            link: url,
            date,
            source_id,
            source_name: sourceName,
            category,
            subcategory,
            image: imageUrl
        };

        // Navigate to news detail page using title-based route
        navigate(`/news/${urlFriendlyTitle}`, {
            state: {
                newsData: newsData
            }
        });
    };

    const handleImageError = () => {
        setImageError(true);
        setImageUrl(null);
    };

    const getCategoryColor = (cat) => {
        const colors = {
            'AI': '#00bcd4',
            'Cybersecurity': '#ff5722',
            'Quantum Computing': '#9c27b0',
            'AR/VR': '#ff9800',
            'Edge Computing': '#4caf50',
            '6G & IoT': '#2196f3',
            'Sustainable Tech': '#8bc34a',
            'Internet': '#607d8b',
            'Gaming': '#e91e63',
            'Gadgets': '#795548',
            'Cloud': '#00bcd4',
            'Semiconductors': '#ffc107',
            'Web3': '#673ab7',
            'Green Tech': '#4caf50',
            'EdTech': '#3f51b5',
            'HealthTech': '#f44336',
            'Autotech': '#9e9e9e',
            'Space Tech': '#1a237e',
            'Tech': '#00bcd4',
            'Technology': '#00bcd4',
            'default': '#00bcd4'
        };
        return colors[cat] || colors.default;
    };

    const getVariantClass = () => {
        switch (variant) {
            case 'featured':
                return 'modern-card modern-card-featured';
            case 'compact':
                return 'modern-card modern-card-compact';
            case 'hero':
                return 'modern-card modern-card-hero';
            default:
                return 'modern-card';
        }
    };

    const trimTitle = (str, val) => {
        if (!str || str=='') return 'Briefli Special...';
        const trimmed = str.length > val ? str.substring(0, val) + '...' : str;
        return trimmed;
    }
    

    return (
        <article
            className={getVariantClass()}
            onClick={handleCardClick}
            style={{ cursor: 'pointer' }}
        >
            {imageUrl && !imageError && (
                <div className="card-image-container">
                    <img
                        src={imageUrl}
                        alt={title}
                        className="card-image"
                        onError={handleImageError}
                        loading="lazy"
                    />
                    <div className="card-image-overlay">
                        <span
                            className="card-category"
                            style={{ backgroundColor: getCategoryColor(subcategory) }}
                        >
                            {subcategory}
                        </span>
                    </div>
                </div>
            )}

            <div className="card-content">
                {!imageUrl && (
                    <span
                        className="card-category card-category-no-image"
                        style={{ backgroundColor: getCategoryColor(category) }}
                    >
                        {category}
                    </span>
                )}

                <h3 className="card-title">{trimTitle(title, 35)}</h3>

                <div className="card-meta">
                    <div className="card-meta-left">
                        <span className="card-source">{trimTitle(sourceName, 7)}</span>
                        <span className="card-date ">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <polyline    points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {formatRelativeDate(date)}
                        </span>
                    </div>
                </div>
            </div>

            <div className="card-hover-effect">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M7 17L17 7" stroke="currentColor" strokeWidth="2" />
                    <path d="M7 7h10v10" stroke="currentColor" strokeWidth="2" />
                </svg>
            </div>
        </article>
    );
}

export default SideModernNewsCard;

