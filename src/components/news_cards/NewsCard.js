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

function NewsCard({
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
  variant = 'default' // 'default', 'featured', 'compact'
}) {
  const navigate = useNavigate();
  const [sourceName, setSourceName] = useState(source_name || 'TechPulse');
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardClick(e);
    }
  };

  // Fetch source name if not provided
  useEffect(() => {
    async function fetchSourceName() {
      if (!source_name && source_id) {
        try {
          const response = await fetch(`${config.api.base}${config.api.sources}/${source_id}`);
          if (response.ok) {
            const data = await response.json();
            setSourceName(data.source_name);
          } else {
            setSourceName('TechPulse');
          }
        } catch (error) {
          console.error('Error fetching source name:', error);
          setSourceName('TechPulse');
        }
      }
    }

    fetchSourceName();
  }, [source_id, source_name]);

  // Reset image error when imageUrl changes
  useEffect(() => {
    setImageError(false);
  }, [imageUrl]);

  // Handle image fallback with tech-focused defaults
  useEffect(() => {
    if (!image && category) {
      const firstCategory = category.split(',')[0].trim().toLowerCase();

      // Map category to proper image filename
      const categoryMapping = {
        'tech': 'Tech',
        'technology': 'Tech',
        'ai': 'Tech',
        'artificial intelligence': 'Tech',
        'cybersecurity': 'Tech',
        'quantum computing': 'Tech',
        'ar/vr': 'Tech',
        'edge computing': 'Tech',
        '6g & iot': 'Tech',
        'sustainable tech': 'Tech',
        'web3': 'Tech',
        'blockchain': 'Tech',
        'cloud': 'Tech',
        'semiconductors': 'Tech',
        'gaming': 'Tech',
        'gadgets': 'Tech',
        'space tech': 'Tech',
        'autotech': 'Tech',
        'healthtech': 'Health',
        'edtech': 'Education',
        'fintech': 'Finance',
        'business': 'Business',
        'finance': 'Finance',
        'sports': 'Sports',
        'entertainment': 'Entertainment',
        'health': 'Health',
        'politics': 'Politics',
        'world': 'World',
        'india': 'India',
        'education': 'Education'
      };

      const mappedCategory = categoryMapping[firstCategory] || 'Tech';
      const fallbackImageUrl = `/images/${mappedCategory}.png`;
      setImageUrl(fallbackImageUrl);
    }
  }, [image, category]);

  const handleImageError = () => {
    setImageError(true);
    // Ultimate fallback to Tech image
    setImageUrl('/images/Tech.png');
  };

  // Get category class for styling
  const getCategoryClass = () => {
    if (!category) return '';
    const categorySlug = category.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
    return `news-card-category-${categorySlug}`;
  };

  const cardClassName = `news-card ${variant === 'featured' ? 'featured' : ''} ${variant === 'compact' ? 'compact' : ''}`.trim();

  return (
    <article
      className={cardClassName}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Read article: ${title}`}
    >
      {imageUrl && !imageError && (
        <img
          src={imageUrl}
          alt={title}
          className="news-card-image"
          onError={handleImageError}
          loading="lazy"
        />
      )}

      <div className="news-card-content">

        <h3 className="news-card-title">
          {title}
        </h3>

        {summary && (
          <p className="news-card-summary">
            {summary}
          </p>
        )}

        <div className="news-card-footer">
          <div className="news-card-meta">
            <span className="news-card-source">{sourceName}</span>
            {date && (
              <span className="news-card-date">{formatRelativeDate(date)}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export default NewsCard;
