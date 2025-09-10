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

function ModernNewsCard({
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

        console.log('ModernNewsCard click - ID:', id);
        console.log('ModernNewsCard click - title:', title);

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
            image: imageUrl,
            // Flag to indicate this data needs to be fetched for complete content
            needsFullFetch: true
        };

        console.log('ModernNewsCard - passing newsData:', newsData);

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

    const estimatedReadTime = Math.max(1, Math.ceil((summary?.length || 200) / 200));
    const trimTitle = (str, val) => {
        if (!str || str == '') return 'Briefli Special...';
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
                </div>
            )}

            <div className="card-content">

                <h3 className="card-title">{title}</h3>

                {summary && variant !== 'compact' && (
                    <p className="card-summary">{summary}</p>
                )}

                <div className="card-meta">
                    <div className="card-meta-left">
                        <span className="card-source">{trimTitle(sourceName, 15)}</span>
                        <span className="card-date">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {formatRelativeDate(date)}
                        </span>
                    </div>

                    <div className="card-meta-right">
                        <span className="card-read-time">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" stroke="currentColor" strokeWidth="2" />
                                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            {estimatedReadTime} min read
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

export default ModernNewsCard;
