
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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

export function LargeCard({ id, title, image, date, category, summary, source_id, source_name, url }) {
    const navigate = useNavigate();
    const [imageUrl, setImageUrl] = useState(image || null);
    const [imageError, setImageError] = useState(false);

    const handleCardClick = (e) => {
        e.preventDefault();

        // Create URL-friendly title
        const urlFriendlyTitle = title
            .toLowerCase()
            .replace(/[^\w\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .trim();

        navigate(`/news-detail/${urlFriendlyTitle}`, {
            state: {
                newsData: {
                    id,
                    title,
                    summary,
                    url,
                    date,
                    source_id,
                    source_name,
                    category,
                    image: imageUrl
                }
            }
        });
    };

    const handleImageError = () => {
        setImageError(true);
        setImageUrl(null);
    };

    // Handle image fallback when no initial image - use tech category images only
    useEffect(() => {
        if (!image && category) {
            const firstCategory = category.split(',')[0].trim();

            // Map tech categories/subcategories to proper image filename
            const categoryMapping = {
                'tech': 'Tech',
                'technology': 'Tech',
                'ai': 'Tech',
                'cybersecurity': 'Tech',
                'quantum computing': 'Tech',
                'ar/vr': 'Tech',
                'edge computing': 'Tech',
                '6g & iot': 'Tech',
                'sustainable tech': 'Tech',
                'gadgets': 'Tech',
                'internet': 'Tech',
                'gaming': 'Tech',
                'cloud': 'Tech',
                'semiconductors': 'Tech',
                'web3': 'Tech',
                'green tech': 'Tech',
                'edtech': 'Tech',
                'healthtech': 'Tech',
                'autotech': 'Tech',
                'space tech': 'Tech'
            };

            // Always default to Tech image for this tech news website
            const mappedCategory = categoryMapping[firstCategory.toLowerCase()] || 'Tech';
            const categoryImageUrl = `/images/${mappedCategory}.png`;
            setImageUrl(categoryImageUrl);
        }
    }, [image, category]);

    // Get category styling
    const firstCategory = category ? category.split(',')[0].trim() : '';
    const categoryClass = firstCategory ? `category-${firstCategory.toLowerCase().replace(/\s+/g, '-')}` : 'category-default';

    return (
        <div
            className="large-card"
            onClick={handleCardClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e)}
        >
            <div className="large-card-image">
                {imageUrl && !imageError && (
                    <img
                        src={imageUrl}
                        alt={title}
                        onError={handleImageError}
                    />
                )}
                {(!imageUrl || imageError) && (
                    <div className="large-card-no-image">
                        <span>{source_name}</span>
                    </div>
                )}
            </div>
            <div className="large-card-content">
                <div className="large-card-header">
                    <div className="large-card-category">
                        <span className={categoryClass}>{firstCategory}</span>
                    </div>
                    <span className="large-card-date">{source_name} · {formatRelativeDate(date)}</span>
                </div>
                <h2 className="large-card-title">{title}</h2>
                <p className="large-card-summary">{summary}</p>
            </div>
        </div>
    );
}