import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SidebarNewsCard from '../components/SidebarNewsCard';
import { Helmet } from 'react-helmet-async';
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

function NewsDetail() {
    const location = useLocation();
    const { title: urlTitle } = useParams();
    const [relatedNews, setRelatedNews] = useState([]);
    const [sourceName, setSourceName] = useState('');
    const [loading, setLoading] = useState(true);

    // Get news data from location state (passed from NewsCard)
    const newsData = location.state?.newsData;

    // If no newsData from navigation state, we might need to handle this case
    // For now, let's just log it for debugging
    if (!newsData && urlTitle) {
        console.warn('No newsData found in location state for URL title:', urlTitle);
    }

    useEffect(() => {
        // Scroll to top when component mounts or when navigation occurs
        window.scrollTo(0, 0);

        // Reset loading state and related news when navigation occurs
        setLoading(true);
        setRelatedNews([]);

        console.log('NewsDetail useEffect triggered:', {
            urlTitle,
            hasNewsData: !!newsData,
            newsDataTitle: newsData?.title,
            pathname: location.pathname
        });

        // Set source name from newsData if available
        if (newsData?.source_name) {
            setSourceName(newsData.source_name);
        } else if (newsData?.source_id) {
            // Fallback: fetch source name using source_id
            async function fetchSourceName() {
                try {
                    const response = await fetch(`${config.api.base}${config.api.sources}/${newsData.source_id}`);
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
            fetchSourceName();
        } else {
            setSourceName('Unknown Source');
        }

        // Fetch related news from same category
        async function fetchRelatedNews() {
            if (newsData?.category) {
                try {
                    const firstCategory = newsData.category.split(',')[0].trim();
                    console.log('Fetching related news for category:', firstCategory);
                    console.log('Current news data:', { title: newsData.title, url: newsData.url, link: newsData.link });

                    const response = await fetch(`${config.api.base}${config.api.news}?category=${encodeURIComponent(firstCategory)}&limit=10`);
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Fetched related news count:', data.length);
                        console.log('Sample articles:', data.slice(0, 2).map(a => ({ title: a.title, link: a.link })));

                        // Filter out current article (try both URL and title for safety)
                        const filtered = data.filter(article => {
                            // Primary filter: different titles (most reliable)
                            if (article.title === newsData.title) {
                                console.log('Filtered out by title match:', article.title);
                                return false;
                            }

                            // Secondary filter: URL matching (if available)
                            if (newsData.url && article.link && article.link === newsData.url) {
                                console.log('Filtered out by URL match:', article.link);
                                return false;
                            }

                            if (newsData.link && article.link && article.link === newsData.link) {
                                console.log('Filtered out by link match:', article.link);
                                return false;
                            }

                            return true;
                        });
                        console.log('Filtered related news count:', filtered.length);
                        setRelatedNews(filtered.slice(0, 10));
                    }
                } catch (error) {
                    console.error('Error fetching related news:', error);
                }
            }
            setLoading(false);
        }

        if (newsData) {
            fetchRelatedNews();
        } else {
            console.log('No newsData available, setting loading to false');
            setLoading(false);
        }
    }, [newsData, urlTitle, location.pathname, location.state]);

    const handleReadFullArticle = async () => {
        // Increment view count if we have an ID
        if (newsData?.id) {
            try {
                await fetch(`${config.api.base}${config.api.news}/${newsData.id}/view`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log('View count incremented successfully');
            } catch (error) {
                console.error('Error incrementing view count:', error);
                // Continue with navigation even if count increment fails
            }
        }
    };

    if (loading) {
        return (
            <div className="news-detail-loading">
                <div className="loading-spinner"></div>
                <p>Loading article...</p>
            </div>
        );
    }

    if (!newsData) {
        return (
            <div className="news-detail-error">
                <h2>Article not found</h2>
                <p>The requested article could not be loaded.</p>
            </div>
        );
    }

    const firstCategory = newsData.category ? newsData.category.split(',')[0].trim() : '';
    const categoryClass = firstCategory ? `news-detail-category news-detail-category-${firstCategory.toLowerCase()}` : 'news-detail-category';

    // Handle image source mapping - use category-based images
    const getImageSource = () => {
        if (newsData.image) return newsData.image;

        // Use category-based image as fallback
        if (firstCategory) {
            // Capitalize first letter for the image filename
            const capitalizedCategory = firstCategory.charAt(0).toUpperCase() + firstCategory.slice(1).toLowerCase();
            return `/images/${capitalizedCategory}.png`;
        }

        return null;
    };

    return (
        <>
            <Helmet>
                <title>{newsData ? `${newsData.title} - Your News Portal` : 'News Article - Your News Portal'}</title>
                <meta name="description" content={newsData ? newsData.summary.substring(0, 160) + '...' : 'Read the latest news article with detailed coverage and analysis.'} />
                <meta name="keywords" content={`${firstCategory}, news, ${sourceName}, breaking news, current events`} />

                {/* Open Graph Tags */}
                <meta property="og:title" content={newsData ? newsData.title : 'News Article'} />
                <meta property="og:description" content={newsData ? newsData.summary.substring(0, 200) + '...' : 'Read the latest news article with detailed coverage.'} />
                <meta property="og:image" content={getImageSource() || `${config.SERVER_URL}/images/default-news-og.jpg`} />
                <meta property="og:url" content={newsData ? newsData.url : window.location.href} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Your News Portal" />
                <meta property="article:section" content={firstCategory} />
                <meta property="article:published_time" content={newsData ? newsData.date : ''} />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={newsData ? newsData.title : 'News Article'} />
                <meta name="twitter:description" content={newsData ? newsData.summary.substring(0, 200) + '...' : 'Read the latest news article.'} />
                <meta name="twitter:image" content={getImageSource() || `${config.SERVER_URL}/images/default-news-og.jpg`} />

                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>

            <div className="news-detail-container">
                <div className="news-detail-sidebar">
                    <h3 className="related-news-title">Related {firstCategory || ''} News</h3>
                    <div className="related-news-list">
                        {relatedNews.length > 0 ? (
                            relatedNews.map((article, index) => (
                                <SidebarNewsCard
                                    key={`${article.title}-${index}`}
                                    title={article.title}
                                    summary={article.summary}
                                    url={article.link}
                                    date={article.date}
                                    source_id={article.source_id}
                                    source_name={article.source_name}
                                    category={article.category}
                                    image={article.image}
                                    newsData={article}
                                />
                            ))
                        ) : (
                            <p className="no-related-news">No related articles found.</p>
                        )}
                    </div>
                </div>

                <div className="news-detail-main">
                    <article className="news-detail-article">
                        {getImageSource() && (
                            <div className="news-detail-image-container">
                                <img
                                    src={getImageSource()}
                                    alt={newsData.title}
                                    className="news-detail-image"
                                />
                            </div>
                        )}

                        <div className="news-detail-meta">
                            <div className="news-detail-category-container">
                                <span className={categoryClass}>{firstCategory}</span>
                            </div>
                            <div className="news-detail-date-source">
                                <span className="news-detail-date">
                                    {formatRelativeDate(newsData.date)} • {sourceName}
                                </span>
                            </div>
                        </div>

                        <h1 className="news-detail-title">{newsData.title}</h1>

                        <div className="news-detail-content">
                            <p className="news-detail-summary">{newsData.summary}</p>

                            <div className="news-detail-actions">
                                <a
                                    href={newsData.url || newsData.link}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    className="read-full-article-btn"
                                    onClick={handleReadFullArticle}
                                >
                                    Read Full Article
                                </a>
                            </div>
                        </div>
                    </article>
                </div>
            </div>
        </>
    );
}

export default NewsDetail;
