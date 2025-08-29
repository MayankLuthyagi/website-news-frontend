import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/news_cards/NewsCard';
import FeaturedCard from '../components/news_cards/FeaturedCard';
import CompactCard from '../components/news_cards/CompactCard';
import FullImageCard from '../components/news_cards/FullImageCard';
import SideImageCard from '../components/news_cards/SideImageCard';
import '../index.css';
import '../modern-theme.css';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';
import config from '../config/config';

export default function CategoryNews() {
    const { categoryName } = useParams();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isDarkMode } = useTheme();

    // Category display names mapping
    const categoryDisplayNames = {
        world: 'World',
        india: 'National',
        finance: 'Finance',
        education: 'Education',
        tech: 'Tech',
        business: 'Business',
        politics: 'Politics',
        sports: 'Sports',
        entertainment: 'Entertainment',
        health: 'Health',
        // Tech subcategories
        'AI': 'AI',
        'Cybersecurity': 'Cybersecurity',
        'Quantum Computing': 'Quantum Computing',
        'AR/VR': 'AR/VR',
        'Edge Computing': 'Edge Computing',
        '6G & IoT': '6G & IoT',
        'Sustainable Tech': 'Sustainable Tech',
        'Gadgets': 'Gadgets',
        'Internet': 'Internet',
        'Gaming': 'Gaming',
        'Cloud': 'Cloud',
        'Semiconductors': 'Semiconductors',
        'Web3': 'Web3',
        'Green Tech': 'Green Tech',
        'EdTech': 'EdTech',
        'HealthTech': 'HealthTech',
        'Autotech': 'Autotech',
        'Space Tech': 'Space Tech'
    };

    // Category API endpoint mapping
    const categoryEndpoints = {
        world: config.api.worldNews,
        india: config.api.indiaNews,
        finance: config.api.financeNews,
        education: config.api.educationNews,
        tech: config.api.techNews,
        business: config.api.businessNews,
        politics: config.api.politicsNews,
        sports: config.api.sportsNews,
        entertainment: config.api.entertainmentNews,
        health: config.api.healthNews
    };

    const displayName = categoryDisplayNames[categoryName] || categoryName;
    const apiEndpoint = categoryEndpoints[categoryName] || `/api/news/category/${categoryName}`;

    useEffect(() => {
        const fetchCategoryNews = async () => {
            setLoading(true);
            try {
                let endpoint;
                let isSubcategory = false;

                // Check if it's a tech subcategory
                const techSubcategories = ['AI', 'Cybersecurity', 'Quantum Computing', 'AR/VR', 'Edge Computing', '6G & IoT', 'Sustainable Tech', 'Gadgets', 'Internet', 'Gaming', 'Cloud', 'Semiconductors', 'Web3', 'Green Tech', 'EdTech', 'HealthTech', 'Autotech', 'Space Tech'];

                if (techSubcategories.includes(categoryName)) {
                    // Use subcategory endpoint for tech subcategories
                    endpoint = `${config.api.base}/api/news/subcategory/${encodeURIComponent(categoryName)}`;
                    isSubcategory = true;
                } else if (categoryName.toLowerCase() === 'tech') {
                    // Use Tech category endpoint
                    endpoint = `${config.api.base}/api/news/category/Tech`;
                } else {
                    // Use regular category endpoint for other categories
                    endpoint = `${config.api.base}/api/news/category/${categoryName}`;
                }

                console.log('CategoryNews - Endpoint:', endpoint);
                console.log('CategoryNews - Is subcategory:', isSubcategory);

                const response = await fetch(endpoint);
                console.log('CategoryNews - Response status:', response.status);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('CategoryNews - Received data:', data);

                // Extract news array based on response structure
                let newsArray = [];
                if (isSubcategory) {
                    // Subcategory response: { subcategory, total, news: [...] }
                    newsArray = data.news || [];
                } else {
                    // Category response: { category, total, news: [...] }
                    newsArray = data.news || [];
                }

                console.log('CategoryNews - News array:', newsArray);

                // Filter out invalid entries and remove duplicates
                const validNews = newsArray.filter(news =>
                    news &&
                    typeof news === 'object' &&
                    (news.title || news.headline) &&
                    news.title !== null &&
                    news.title !== undefined &&
                    news.title.trim() !== ''
                );

                const uniqueNews = validNews.filter((news, index, self) =>
                    index === self.findIndex(n =>
                        (n.title || n.headline) === (news.title || news.headline)
                    )
                );

                console.log('CategoryNews - Final unique news:', uniqueNews);
                setNewsList(uniqueNews);

            } catch (error) {
                console.error(`Error fetching ${categoryName} news:`, error);
                // Fallback to Tech category if it's a tech-related request
                try {
                    const fallbackEndpoint = `${config.api.base}/api/news/category/Tech`;
                    console.log('CategoryNews - Fallback endpoint:', fallbackEndpoint);

                    const fallbackResponse = await fetch(fallbackEndpoint);
                    if (fallbackResponse.ok) {
                        const fallbackData = await fallbackResponse.json();
                        const newsArray = fallbackData.news || [];

                        // Filter by subcategory if applicable
                        let filteredNews = newsArray;
                        if (categoryDisplayNames[categoryName] && categoryName !== 'tech') {
                            filteredNews = newsArray.filter(news =>
                                news.subcategory?.toLowerCase().includes(categoryName.toLowerCase()) ||
                                news.title?.toLowerCase().includes(categoryName.toLowerCase()) ||
                                news.summary?.toLowerCase().includes(categoryName.toLowerCase())
                            );
                        }

                        setNewsList(filteredNews.length > 0 ? filteredNews : newsArray.slice(0, 20));
                    } else {
                        setNewsList([]);
                    }
                } catch (fallbackError) {
                    console.error('Error fetching fallback news:', fallbackError);
                    setNewsList([]);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchCategoryNews();
    }, [categoryName]);

    const renderNewsCard = (news, index) => {
        // Validate news data before rendering
        if (!news || typeof news !== 'object') {
            return null;
        }

        const cardTypes = [NewsCard, FeaturedCard, CompactCard, FullImageCard, SideImageCard];
        const CardComponent = cardTypes[index % cardTypes.length];

        return (
            <CardComponent
                key={`${news.title || 'news'}-${index}`}
                id={news.id || `news-${index}`}
                title={news.title || 'No Title Available'}
                summary={news.summary || news.description || 'No summary available'}
                url={news.link || news.url || '#'}
                date={news.date || news.published_at || new Date().toISOString()}
                source_id={news.source_id || 'unknown'}
                source_name={news.source_name || 'Unknown Source'}
                category={news.category || categoryName}
                image={news.image || news.urlToImage || null}
            />
        );
    };

    return (
        <>
            <Helmet>
                <title>{`${displayName} News - Daily Brief Newsly`}</title>
                <meta name="description" content={`Stay updated with the latest ${displayName.toLowerCase()} news. Get breaking stories, analysis, and in-depth coverage in ${displayName.toLowerCase()}.`} />
                <meta name="keywords" content={`${displayName.toLowerCase()} news, ${categoryName} updates, breaking ${categoryName} news, ${displayName.toLowerCase()} stories${categoryName === 'india' ? ', indian news, national news' : ''}${categoryName === 'world' ? ', international news, global news' : ''}`} />

                {/* Open Graph Tags */}
                <meta property="og:title" content={`${displayName} News - Daily Brief Newsly`} />
                <meta property="og:description" content={`Stay updated with the latest ${displayName.toLowerCase()} news and breaking stories.`} />
                <meta property="og:url" content={`${config.SERVER_URL}/category/${categoryName}`} />
                <meta property="og:type" content="website" />
                <meta property="og:site_name" content="Daily Brief Newsly" />

                {/* Twitter Cards */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={`${displayName} News - Daily Brief Newsly`} />
                <meta name="twitter:description" content={`Latest ${displayName.toLowerCase()} news and updates.`} />

                {/* Structured Data */}
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "NewsMediaOrganization",
                        "name": "Daily Brief Newsly",
                        "url": `${config.SERVER_URL}/category/${categoryName}`,
                        "description": `${displayName} news and updates`,
                        "category": displayName
                    })}
                </script>
            </Helmet>
            <section className="brand-header">
                <div className="brand-container">
                    <h1 className="main-brand-title">
                        <span className="other-heading">{displayName} News</span>
                    </h1>
                </div>
            </section>
            <div className="all-news-container">
                {loading ? (
                    <div className="loading-section">
                        <p>Loading {displayName.toLowerCase()} news...</p>
                    </div>
                ) : newsList.length > 0 ? (
                    <>
                        {/* Featured News Section */}
                        {newsList.length > 0 && (
                            <section className="featured-news-section">
                                <div className="featured-news-grid">
                                    {newsList.slice(0, 3).map((news, idx) => (
                                        <FeaturedCard
                                            key={`featured-${idx}`}
                                            id={news.id || `news-${idx}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
                                            subcategory={news.subcategory || 'Tech'}
                                            summary={news.summary || news.description || 'No summary available'}
                                            source_id={news.source_id || 'unknown'}
                                            source_name={news.source_name || 'Unknown Source'}
                                            url={news.link || news.url || '#'}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Breaking News Section */}
                        {newsList.length > 3 && (
                            <section className="breaking-news-section">
                                <div className="breaking-news-grid">
                                    {newsList.slice(3, 9).map((news, idx) => (
                                        <CompactCard
                                            key={`breaking-${idx}`}
                                            id={news.id || `news-${idx + 3}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
                                            subcategory={news.subcategory || 'Tech'}
                                            summary={news.summary || news.description || 'No summary available'}
                                            source_id={news.source_id || 'unknown'}
                                            source_name={news.source_name || 'Unknown Source'}
                                            url={news.link || news.url || '#'}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Full Image Stories Section */}
                        {newsList.length > 9 && (
                            <section className="full-image-section">
                                <div className="full-image-grid">
                                    {newsList.slice(9, 12).map((news, idx) => (
                                        <FullImageCard
                                            key={`focus-${idx}`}
                                            id={news.id || `news-${idx + 9}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
                                            subcategory={news.subcategory || 'Tech'}
                                            summary={news.summary || news.description || 'No summary available'}
                                            source_id={news.source_id || 'unknown'}
                                            source_name={news.source_name || 'Unknown Source'}
                                            url={news.link || news.url || '#'}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Quick Reads Section */}
                        {newsList.length > 12 && (
                            <section className="quick-reads-section">
                                <div className="quick-reads-grid">
                                    {newsList.slice(12, 21).map((news, idx) => (
                                        <SideImageCard
                                            key={`quick-${idx}`}
                                            id={news.id || `news-${idx + 12}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
                                            subcategory={news.subcategory || 'Tech'}
                                            summary={news.summary || news.description || 'No summary available'}
                                            source_id={news.source_id || 'unknown'}
                                            source_name={news.source_name || 'Unknown Source'}
                                            url={news.link || news.url || '#'}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* More News Section */}
                        {newsList.length > 21 && (
                            <section className="more-news-section">
                                <div className="more-news-grid">
                                    {newsList.slice(20).map((news, idx) => (
                                        <NewsCard
                                            key={`more-${idx}`}
                                            id={news.id || `news-${idx + 20}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
                                            subcategory={news.subcategory || 'Tech'}
                                            summary={news.summary || news.description || 'No summary available'}
                                            source_id={news.source_id || 'unknown'}
                                            source_name={news.source_name || 'Unknown Source'}
                                            url={news.link || news.url || '#'}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </>
                ) : (
                    <div className="no-news-section">
                        <p>No {displayName.toLowerCase()} news available at the moment.</p>
                    </div>
                )}
            </div>
        </>
    );
}
