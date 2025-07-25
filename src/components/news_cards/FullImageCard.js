import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../index.css';

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

function FullImageCard({ id, title, summary, url, date, source_id, source_name, category, image }) {
    const navigate = useNavigate();
    const [sourceName, setSourceName] = useState(source_name || 'Unknown Source');
    const [imageUrl, setImageUrl] = useState(image || null);
    const [imageError, setImageError] = useState(false);

    const handleCardClick = (e) => {
        e.preventDefault();

        // Create URL-friendly title
        const urlFriendlyTitle = title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

        // Navigate to news detail page with news data
        navigate(`/news-detail/${urlFriendlyTitle}`, {
            state: {
                newsData: {
                    id,
                    title,
                    summary,
                    url,
                    date,
                    source_id,
                    source_name: sourceName,
                    category,
                    image
                }
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

            // Map category to proper image filename
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
                // No category available, set to null for fallback styling
                setImageUrl(null);
            }
        } else {
            // Even category-based fallback failed, set to null
            setImageUrl(null);
        }
    };

    // Function to truncate summary with proper word boundaries
    const truncateSummary = (text, maxLength = 150) => {
        if (!text) return '';

        // Remove extra whitespace and trim
        const cleanText = text.trim().replace(/\s+/g, ' ');

        if (cleanText.length <= maxLength) {
            return cleanText;
        }

        // Find the last space before maxLength to avoid cutting words
        const truncated = cleanText.substring(0, maxLength);
        const lastSpaceIndex = truncated.lastIndexOf(' ');

        // If no space found, use the full truncated string, otherwise cut at last space
        const finalText = lastSpaceIndex > maxLength * 0.8 ? truncated.substring(0, lastSpaceIndex) : truncated;

        return finalText + '...';
    };

    return (
        <a
            className="full-image-card"
            href="#"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
            style={{
                backgroundImage: imageUrl ? `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${imageUrl})` : 'linear-gradient(135deg, #3161ff 0%, #00bcd4 100%)'
            }}
        >
            {imageUrl && (
                <img
                    src={imageUrl}
                    alt={sourceName}
                    onError={handleImageError}
                    style={{ display: 'none' }} // Hidden img for error handling
                />
            )}

            <div className="full-image-card-overlay">
                <div className="full-image-card-header">
                    <div className="full-image-card-category">
                        {category && (
                            <span className={`category-${category.split(',')[0].trim().toLowerCase().replace(/\s+/g, '-')}`}>
                                {category.split(',')[0].trim()}
                            </span>
                        )}
                    </div>
                    <div className="full-image-card-date">{sourceName} · {formatRelativeDate(date)}</div>
                </div>
                <div className="full-image-card-content">
                    <h3 className="full-image-card-title">{title.trim()}</h3>
                    <p className="full-image-card-summary">{truncateSummary(summary)}</p>
                </div>
            </div>
        </a>
    );
}

export default FullImageCard;
