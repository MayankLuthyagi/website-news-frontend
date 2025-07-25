import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../../config/config';
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

function NewsCard({ id, title, summary, url, date, source_id, source_name, category, image }) {
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

  // Handle image fallback when no initial image - use category-based images
  useEffect(() => {
    if (!image && category) {
      // Try category-based image with proper capitalization
      const firstCategory = category.split(',')[0].trim();
      console.log('Original category:', firstCategory);

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

      // Try exact match first, then lowercase match
      let imageCategory = firstCategory;
      if (categoryMapping[firstCategory.toLowerCase()]) {
        imageCategory = categoryMapping[firstCategory.toLowerCase()];
      }

      console.log('Image category for file:', imageCategory);
      setImageUrl(`/images/${imageCategory}.png`);
    }
  }, [image, category]);

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
      // If image fails to load, try category-based image as fallback
      if (category) {
        const firstCategory = category.split(',')[0].trim();
        console.log('Error fallback - Original category:', firstCategory);

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

        // Try exact match first, then lowercase match
        let imageCategory = firstCategory;
        if (categoryMapping[firstCategory.toLowerCase()]) {
          imageCategory = categoryMapping[firstCategory.toLowerCase()];
        }

        console.log('Error fallback - Image category:', imageCategory);
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
      className="news-card"
      href="#"
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
    >
      <div className="news-card-image">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={sourceName}
            onError={handleImageError}
          />
        )}
        {!imageUrl && (
          <div className="news-card-no-image">
            <span>{sourceName}</span>
          </div>
        )}
      </div>
      <div className="news-card-header">
        <span className="news-card-date">{sourceName} . {formatRelativeDate(date)}</span>
      </div>
      <div className="news-card-content">
        <h3 className="news-card-title">{title}</h3>
        <p className="news-card-summary">{summary.length > 250 ? summary.slice(0, 250) + '...' : summary}</p>
      </div>
    </a>
  );
}

export default NewsCard; 