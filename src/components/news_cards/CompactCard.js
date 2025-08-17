import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';
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

function CompactCard({ id, title, summary, url, date, source_id, source_name, category, image }) {
    const navigate = useNavigate();
    const [sourceName, setSourceName] = useState(source_name || 'Unknown Source');

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

    return (
        <a
            className="compact-card"
            href="#"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            role="button"
            tabIndex={0}
        >
            <div className="compact-card-content">
                <div className="compact-card-header">
                    <span className="compact-card-date">{sourceName} . {formatRelativeDate(date)}</span>
                </div>
                <h4 className="compact-card-title">{title}</h4>
                <p className="compact-card-summary">{summary.length > 120 ? summary.slice(0, 120) + '...' : summary}</p>
            </div>
        </a>
    );
}

export default CompactCard;
