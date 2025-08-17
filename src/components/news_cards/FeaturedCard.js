import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../modern-theme.css';

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

function FeaturedCard({ id, title, summary, url, date, source_id, source_name, category, image }) {
    const navigate = useNavigate();
    const [sourceName, setSourceName] = useState(source_name || 'Unknown Source');
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
        const newsDataObj = {
            _id: id,
            id: id,
            title,
            summary,
            link: url,
            url: url,
            date,
            source_id,
            source_name: sourceName,
            category,
            image
        };

        // Navigate to news detail page using title-based route
        navigate(`/news/${urlFriendlyTitle}`, {
            state: {
                newsData: newsDataObj
            }
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick(e);
        }
    };

    // Handle image fallback when no initial image - use category-based images
    useEffect(() => {
        if (!image && category) {
            const firstCategory = category.split(',')[0].trim();

            // Map category to proper image filename (Tech-focused only)
            const categoryMapping = {
                'tech': 'Tech',
                'technology': 'Tech',
                'artificial intelligence': 'Tech',
                'ai': 'Tech',
                'machine learning': 'Tech',
                'software': 'Tech',
                'hardware': 'Tech',
                'programming': 'Tech',
                'cybersecurity': 'Tech',
                'internet': 'Tech',
                'mobile': 'Tech',
                'gaming': 'Tech',
                'startups': 'Tech',
                'innovation': 'Tech'
            };

            let imageCategory = 'Tech'; // Default to Tech for our tech-focused website
            if (categoryMapping[firstCategory.toLowerCase()]) {
                imageCategory = categoryMapping[firstCategory.toLowerCase()];
            }

            setImageUrl(`/images/${imageCategory}.png`);
        }
    }, [image, category]);

    const handleImageError = () => {
        if (!imageError) {
            setImageError(true);
            // If image fails to load, try category-based image as fallback
            if (category) {
                const firstCategory = category.split(',')[0].trim();

                const categoryMapping = {
                    'business': 'Business',
                    'tech': 'Tech',
                    'technology': 'Tech',
                    'world': 'World',
                    'entertainment': 'Entertainment',
                    'politics': 'Politics',
                    'sports': 'Sports',
                    'health': 'Health',
                    'education': 'Education',
                    'finance': 'Finance',
                    'national': 'India',
                    'india': 'India'
                };

                let imageCategory = firstCategory;
                if (categoryMapping[firstCategory.toLowerCase()]) {
                    imageCategory = categoryMapping[firstCategory.toLowerCase()];
                }

                setImageUrl(`/images/${imageCategory}.png`);
            } else {
                // No category available, hide image
                setImageUrl(null);
            }
        } else {
            // Even category-based fallback failed, hide image
            setImageUrl(null);
        }
    };

    return (
        <a
            className="featured-card"
            href="#"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <div className="featured-card-image">
                {imageUrl && (
                    <img
                        src={imageUrl}
                        alt={sourceName}
                        onError={handleImageError}
                    />
                )}
                {!imageUrl && (
                    <div className="featured-card-no-image">
                        <span>{sourceName}</span>
                    </div>
                )}
            </div>
            <div className="featured-card-content">
                <div className="featured-card-header">
                    <span className="featured-card-date">{sourceName} . {formatRelativeDate(date)}</span>
                </div>
                <h3 className="featured-card-title">{title}</h3>
                <p className="featured-card-summary">{summary.length > 300 ? summary.slice(0, 300) + '...' : summary}</p>
            </div>
        </a>
    );
}

export default FeaturedCard;
