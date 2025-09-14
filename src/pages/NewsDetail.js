import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import SidebarNewsCard from '../components/SidebarNewsCard';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';
import config from '../config/config';

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
    const { isDarkMode } = useTheme();
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

            // Try multiple possible endpoints for fetching the complete news article
            const possibleEndpoints = [
                `${config.api.base}${config.api.news}/${id}`,
                `${config.api.base}/api/news/${id}`,
                `${config.api.base}${config.api.allNews}/${id}`
            ];

            let fetchedNewsData = null;

            for (const endpoint of possibleEndpoints) {
                try {
                    const response = await fetch(endpoint);
                    if (response.ok) {
                        fetchedNewsData = await response.json();
                        break;
                    } else {
                    }
                } catch (endpointError) {
                }
            }

            if (fetchedNewsData) {

                setNewsData(fetchedNewsData);
            } else {
                console.error('All endpoints failed to fetch news by ID:', id);
                // If fetch by ID fails but we have initial data, use that
                if (initialNewsData) {
                    setNewsData(initialNewsData);
                }
            }
        } catch (error) {
            console.error('Error fetching news by ID:', error);
            // If fetch by ID fails but we have initial data, use that
            if (initialNewsData) {
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

        // Always fetch complete data if coming from a component that doesn't have html_content
        if (initialNewsData && (initialNewsData.needsFullFetch || !initialNewsData.html_content) && (initialNewsData.id || initialNewsData._id)) {
            setNewsLoading(true);
            fetchNewsById(initialNewsData.id || initialNewsData._id);
        }
        // If no newsData and we have a newsId, fetch the news by ID
        else if (!initialNewsData && newsId) {
            setNewsLoading(true);
            fetchNewsById(newsId);
        } else if (initialNewsData && initialNewsData.html_content) {
            setNewsData(initialNewsData);
            setNewsLoading(false);
        } else {
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

        // Fetch related news from same subcategory
        async function fetchRelatedNews() {
            // Fetch related news based on current article's subcategory
            try {
                const currentSubcategory = newsData.subcategory;
                if (currentSubcategory) {
                    const subcategoryEndpoint = `${config.api.base}${config.api.news}/subcategory/${encodeURIComponent(currentSubcategory)}?limit=10`;

                    const response = await fetch(subcategoryEndpoint);
                    if (response.ok) {
                        const data = await response.json();

                        // Filter out current article (try both URL and title for safety)
                        const filtered = data.news.filter(article => {
                            if (article.title === newsData.title) return false;
                            if (newsData.url && article.link && article.link === newsData.url) return false;
                            if (newsData.link && article.link && article.link === newsData.link) return false;
                            return true;
                        });
                        setRelatedNews(filtered.slice(0, 10));
                    } else {
                        // Fallback to category if subcategory fetch fails
                        const techCategory = 'Tech';
                        const fallbackResponse = await fetch(`${config.api.base}${config.api.news}?category=${encodeURIComponent(techCategory)}&limit=10`);
                        if (fallbackResponse.ok) {
                            const fallbackData = await fallbackResponse.json();
                            const filtered = fallbackData.filter(article => {
                                if (article.title === newsData.title) return false;
                                if (newsData.url && article.link && article.link === newsData.url) return false;
                                if (newsData.link && article.link && article.link === newsData.link) return false;
                                return true;
                            });
                            setRelatedNews(filtered.slice(0, 10));
                        }
                    }
                } else {
                    // No subcategory available, fallback to Tech category
                    const techCategory = 'Tech';
                    const response = await fetch(`${config.api.base}${config.api.news}?category=${encodeURIComponent(techCategory)}&limit=10`);
                    if (response.ok) {
                        const data = await response.json();
                        const filtered = data.filter(article => {
                            if (article.title === newsData.title) return false;
                            if (newsData.url && article.link && article.link === newsData.url) return false;
                            if (newsData.link && article.link && article.link === newsData.link) return false;
                            return true;
                        });
                        setRelatedNews(filtered.slice(0, 10));
                    }
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
            } catch (error) {
                console.error('Error incrementing view count:', error);
                // Continue with navigation even if count increment fails
            }
        }
    };

    if (loading) {
        return (
            <div className={`news-detail-loading ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <div className="loading-spinner"></div>
                <p>Loading article...</p>
            </div>
        );
    }

    // Show loading state if we're fetching news by ID
    if (newsLoading) {
        return (
            <div className={`news-detail-loading ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <p>Loading article...</p>
            </div>
        );
    }

    if (!newsData) {
        return (
            <div className={`news-detail-error ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <h2>Article not found</h2>
                <p>The requested article could not be loaded.</p>
            </div>
        );
    }

    // Use subcategory if available, otherwise fallback to category or 'Tech'
    const firstCategory = newsData?.subcategory || newsData?.category || 'Tech';
    const categoryClass = `news-detail-category news-detail-category-${firstCategory.toLowerCase()}`;

    // Handle image source mapping - use category-based images
    const getImageSource = () => {
        if (newsData.image) return newsData.image;

        // Use category-based image as fallback
        if (firstCategory) {
            // Map category/subcategory to proper image filename
            const categoryMapping = {
                // Main categories
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
                'india': 'India',
                // Tech subcategories - all map to Tech image
                'ai': 'Tech',
                'artificial intelligence': 'Tech',
                'cybersecurity': 'Tech',
                'quantum computing': 'Tech',
                'ar/vr': 'Tech',
                'edge computing': 'Tech',
                '6g & iot': 'Tech',
                'sustainable tech': 'Tech',
                'internet': 'Tech',
                'gaming': 'Tech',
                'gadgets': 'Tech',
                'cloud': 'Tech',
                'semiconductors': 'Tech',
                'web3': 'Tech',
                'green tech': 'Tech',
                'edtech': 'Tech',
                'healthtech': 'Tech',
                'autotech': 'Tech',
                'space tech': 'Tech'
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
                <meta name="keywords" content={`${firstCategory}, Tech, news, ${sourceName}, breaking tech news, current events, AI, Cybersecurity, Quantum Computing, AR/VR, Edge Computing, 6G, IoT, Sustainable Tech, Gadgets, Internet, Gaming, Cloud, Semiconductors, Web3, Green Tech, EdTech, HealthTech, Autotech, Space Tech`} />

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

            <div className={`news-detail-container ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
                <div className="news-detail-sidebar">
                    <h3 className="related-news-title">
                        {newsData?.subcategory ? `Related ${newsData.subcategory} News` : 'Related Tech News'}
                    </h3>
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
                                    category={article.category || 'Tech'}
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
                                        <p>{newsData.summary}</p>
                                    </div>
                                );
                            })()}

                            <div className="">
                                Source - {' '}
                                <a
                                    href={newsData.url || newsData.link}
                                    target="_blank"
                                    rel="noopener noreferrer nofollow"
                                    onClick={handleReadFullArticle}
                                >
                                    {sourceName}
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