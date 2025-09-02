import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SidebarNewsCard from '../components/SidebarNewsCard';
import { Helmet } from 'react-helmet-async';
import config from '../config/config';
import '../modern-theme.css';

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
    const { title: urlTitle, id: newsId } = useParams();
    const [newsData, setNewsData] = useState(location.state?.newsData || null);
    const [relatedNews, setRelatedNews] = useState([]);
    const [sourceName, setSourceName] = useState('');
    const [loading, setLoading] = useState(true);
    const [newsLoading, setNewsLoading] = useState(!newsData);

    // Get initial news data from location state (passed from NewsCard/NewsTicker)
    const initialNewsData = location.state?.newsData;

    // Function to fetch news by ID
    const fetchNewsById = async (id) => {
        try {
            console.log('=== FETCHING BY ID ===', id);

            // Try multiple possible endpoints for fetching the complete news article
            const possibleEndpoints = [
                `${config.api.base}${config.api.news}/${id}`,
                `${config.api.base}/api/news/${id}`,
                `${config.api.base}${config.api.allNews}/${id}`
            ];

            let fetchedNewsData = null;

            for (const endpoint of possibleEndpoints) {
                try {
                    console.log('Trying endpoint:', endpoint);
                    const response = await fetch(endpoint);
                    if (response.ok) {
                        fetchedNewsData = await response.json();
                        console.log('Success with endpoint:', endpoint);
                        break;
                    } else {
                        console.log('Failed with endpoint:', endpoint, 'Status:', response.status);
                    }
                } catch (endpointError) {
                    console.log('Error with endpoint:', endpoint, endpointError.message);
                }
            }

            if (fetchedNewsData) {
                console.log('Raw fetched data:', fetchedNewsData);
                console.log('Fetched has html_content:', !!fetchedNewsData.html_content);
                console.log('html_content type:', typeof fetchedNewsData.html_content);
                console.log('html_content length:', fetchedNewsData.html_content?.length);
                console.log('html_content first 100 chars:', fetchedNewsData.html_content?.substring(0, 100));

                setNewsData(fetchedNewsData);
            } else {
                console.error('All endpoints failed to fetch news by ID:', id);
                // If fetch by ID fails but we have initial data, use that
                if (initialNewsData) {
                    console.log('Falling back to initial data');
                    setNewsData(initialNewsData);
                }
            }
        } catch (error) {
            console.error('Error fetching news by ID:', error);
            // If fetch by ID fails but we have initial data, use that
            if (initialNewsData) {
                console.log('Falling back to initial data due to error');
                setNewsData(initialNewsData);
            }
        } finally {
            setNewsLoading(false);
        }
    };

    if (!newsData && urlTitle) {
        // Remove console.warn in production
        console.warn('No newsData found in location state for URL title:', urlTitle);
    }

    useEffect(() => {
        // Scroll to top when component mounts or when navigation occurs
        window.scrollTo(0, 0);
        setLoading(true);
        setRelatedNews([]);

        console.log('=== NEWSDETAIL NAVIGATION ===');
        console.log('initialNewsData:', initialNewsData);
        console.log('has html_content:', !!initialNewsData?.html_content);
        console.log('needsFullFetch flag:', initialNewsData?.needsFullFetch);

        // Always fetch complete data if coming from a component that doesn't have html_content
        if (initialNewsData && (initialNewsData.needsFullFetch || !initialNewsData.html_content) && (initialNewsData.id || initialNewsData._id)) {
            console.log('Fetching complete data due to needsFullFetch flag or missing html_content...');
            setNewsLoading(true);
            fetchNewsById(initialNewsData.id || initialNewsData._id);
        }
        // If no newsData and we have a newsId, fetch the news by ID
        else if (!initialNewsData && newsId) {
            console.log('No initial data, fetching by newsId...');
            setNewsLoading(true);
            fetchNewsById(newsId);
        } else if (initialNewsData && initialNewsData.html_content) {
            console.log('Using complete initialNewsData with html_content');
            setNewsData(initialNewsData);
            setNewsLoading(false);
        } else {
            console.log('Using initialNewsData without html_content (fallback)');
            setNewsData(initialNewsData);
            setNewsLoading(false);
        }
    }, [newsId, initialNewsData, urlTitle, location.pathname]);

    // Separate useEffect for handling newsData-dependent operations
    useEffect(() => {
        if (!newsData) return;

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

        // Fetch related news from Tech category only
        async function fetchRelatedNews() {
            // Always fetch related news from Tech category
            try {
                const techCategory = 'Tech';
                const response = await fetch(`${config.api.base}${config.api.news}?category=${encodeURIComponent(techCategory)}&limit=10`);
                if (response.ok) {
                    const data = await response.json();
                    // Filter out current article (try both URL and title for safety)
                    const filtered = data.filter(article => {
                        if (article.title === newsData.title) return false;
                        if (newsData.url && article.link && article.link === newsData.url) return false;
                        if (newsData.link && article.link && article.link === newsData.link) return false;
                        return true;
                    });
                    setRelatedNews(filtered.slice(0, 10));
                }
            } catch (error) {
                console.error('Error fetching related news:', error);
            }
            setLoading(false);
        }

        fetchRelatedNews();
    }, [newsData]);

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
                // console.log('View count incremented successfully');
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

    // Show loading state if we're fetching news by ID
    if (newsLoading) {
        return (
            <div className="news-detail-loading">
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

    // Always set firstCategory to 'Tech'
    const firstCategory = 'Tech';
    const categoryClass = `news-detail-category news-detail-category-${firstCategory.toLowerCase()}`;

    // Handle image source mapping - use category-based images
    const getImageSource = () => {
        if (newsData.image) return newsData.image;

        // Use category-based image as fallback
        if (firstCategory) {
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

            return `/images/${imageCategory}.png`;
        }

        return null;
    };

    return (
        <>
            <Helmet>
                <title>{newsData ? `${newsData.title} - Tech News Portal` : 'Tech News Article - Tech News Portal'}</title>
                <meta name="description" content={newsData ? newsData.summary.substring(0, 160) + '...' : 'Read the latest tech news article with detailed coverage and analysis.'} />
                <meta name="keywords" content={`Tech, news, ${sourceName}, breaking tech news, current events, AI, Cybersecurity, Quantum Computing, AR/VR, Edge Computing, 6G, IoT, Sustainable Tech, Gadgets, Internet, Gaming, Cloud, Semiconductors, Web3, Green Tech, EdTech, HealthTech, Autotech, Space Tech`} />

                {/* Open Graph Tags */}
                <meta property="og:title" content={newsData ? newsData.title : 'Tech News Article'} />
                <meta property="og:description" content={newsData ? newsData.summary.substring(0, 200) + '...' : 'Read the latest tech news article with detailed coverage.'} />
                <meta property="og:image" content={getImageSource() || `${config.SERVER_URL}/images/default-news-og.jpg`} />
                <meta property="og:url" content={newsData ? newsData.url : window.location.href} />
                <meta property="og:type" content="article" />
                <meta property="og:site_name" content="Tech News Portal" />
                <meta property="article:section" content={firstCategory} />
                <meta property="article:published_time" content={newsData ? newsData.date : ''} />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={newsData ? newsData.title : 'Tech News Article'} />
                <meta name="twitter:description" content={newsData ? newsData.summary.substring(0, 200) + '...' : 'Read the latest tech news article.'} />
                <meta name="twitter:image" content={getImageSource() || `${config.SERVER_URL}/images/default-news-og.jpg`} />

                {/* Additional SEO */}
                <meta name="robots" content="index, follow" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Helmet>

            <div className="news-detail-container">
                <div className="news-detail-sidebar">
                    <h3 className="related-news-title">Related Tech News</h3>
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
                            {/* Debug: Log html_content */}
                            {console.log('Raw html_content:', newsData.html_content)}
                            {console.log('html_content type:', typeof newsData.html_content)}
                            {console.log('html_content length:', newsData.html_content?.length)}

                            {(() => {
                                // Process the html_content to handle escaped characters
                                let processedHtmlContent = newsData.html_content;

                                if (processedHtmlContent && typeof processedHtmlContent === 'string') {
                                    // Unescape HTML entities like \u003C to < and \u003E to >
                                    processedHtmlContent = processedHtmlContent
                                        .replace(/\\u003C/g, '<')
                                        .replace(/\\u003E/g, '>')
                                        .replace(/\\"/g, '"')
                                        .replace(/\\n/g, '\n');

                                    console.log('Processed html_content:', processedHtmlContent);

                                    return (
                                        <div
                                            className="news-detail-summary"
                                            dangerouslySetInnerHTML={{ __html: processedHtmlContent }}
                                        />
                                    );
                                }

                                // Fallback to summary if no html_content
                                return (
                                    <div className="news-detail-summary">
                                        <p>No HTML content available. Using summary instead:</p>
                                        <p>{newsData.summary}</p>
                                    </div>
                                );
                            })()}

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