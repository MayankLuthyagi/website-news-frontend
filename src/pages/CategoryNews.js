import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import NewsCard from '../components/news_cards/NewsCard';
import FeaturedCard from '../components/news_cards/FeaturedCard';
import CompactCard from '../components/news_cards/CompactCard';
import FullImageCard from '../components/news_cards/FullImageCard';
import SideImageCard from '../components/news_cards/SideImageCard';
import '../index.css';
import { Helmet } from 'react-helmet-async';
import config from '../config/config';

export default function CategoryNews() {
    const { categoryName } = useParams();
    const [newsList, setNewsList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Category display names mapping
    const categoryDisplayNames = {
        world: 'World',
        india: 'National',
        finance: 'Finance',
        education: 'Education',
        tech: 'Technology',
        business: 'Business',
        politics: 'Politics',
        sports: 'Sports',
        entertainment: 'Entertainment',
        health: 'Health'
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
                // Use the specific API endpoint format: api/news/category/{name}
                const endpoint = `${config.api.base}/api/news/category/${categoryName}`;
                console.log('Fetching from endpoint:', endpoint);

                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('Received data:', data);

                // Ensure data is an array
                const newsArray = Array.isArray(data) ? data : (data.articles || data.data || []);

                // Remove duplicates based on title and filter out invalid entries
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

                setNewsList(uniqueNews);
            } catch (error) {
                console.error(`Error fetching ${categoryName} news:`, error);
                // Fallback to latest news if category-specific endpoint fails
                try {
                    const fallbackResponse = await fetch(`${config.api.base}${config.api.latestNews}`);
                    const fallbackData = await fallbackResponse.json();

                    const fallbackArray = Array.isArray(fallbackData) ? fallbackData : (fallbackData.articles || fallbackData.data || []);

                    const filteredNews = fallbackArray.filter(news =>
                        news &&
                        typeof news === 'object' &&
                        (news.title || news.headline) &&
                        (news.category?.toLowerCase().includes(categoryName.toLowerCase()) ||
                            (news.title || news.headline)?.toLowerCase().includes(categoryName.toLowerCase()) ||
                            (news.summary || news.description || news.content)?.toLowerCase().includes(categoryName.toLowerCase()))
                    );

                    setNewsList(filteredNews.length > 0 ? filteredNews : fallbackArray.slice(0, 20));
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

            <div className="all-news-container">
                <div className="all-news-header">
                    <h1>{displayName} News</h1>
                    <p>Stay informed with the latest {displayName.toLowerCase()} news and updates</p>
                </div>

                {loading ? (
                    <div className="loading-section">
                        <p>Loading {displayName.toLowerCase()} news...</p>
                    </div>
                ) : newsList.length > 0 ? (
                    <>
                        {/* Featured News Section */}
                        {newsList.length > 0 && (
                            <section className="featured-news-section">
                                <h2 className="section-title">Featured {displayName} Stories</h2>
                                <div className="featured-news-grid">
                                    {newsList.slice(0, 3).map((news, idx) => (
                                        <FeaturedCard
                                            key={`featured-${idx}`}
                                            id={news.id || `news-${idx}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
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
                                <h2 className="section-title">Breaking {displayName} News</h2>
                                <div className="breaking-news-grid">
                                    {newsList.slice(3, 9).map((news, idx) => (
                                        <CompactCard
                                            key={`breaking-${idx}`}
                                            id={news.id || `news-${idx + 3}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
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
                                <h2 className="section-title">{displayName} In Focus</h2>
                                <div className="full-image-grid">
                                    {newsList.slice(9, 12).map((news, idx) => (
                                        <FullImageCard
                                            key={`focus-${idx}`}
                                            id={news.id || `news-${idx + 9}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
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
                                <h2 className="section-title">{displayName} Quick Reads</h2>
                                <div className="quick-reads-grid">
                                    {newsList.slice(12, 20).map((news, idx) => (
                                        <SideImageCard
                                            key={`quick-${idx}`}
                                            id={news.id || `news-${idx + 12}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
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
                        {newsList.length > 20 && (
                            <section className="more-news-section">
                                <h2 className="section-title">More {displayName} Stories</h2>
                                <div className="more-news-grid">
                                    {newsList.slice(20).map((news, idx) => (
                                        <NewsCard
                                            key={`more-${idx}`}
                                            id={news.id || `news-${idx + 20}`}
                                            title={news.title || 'No Title Available'}
                                            image={news.image || news.urlToImage || null}
                                            date={news.date || news.published_at || new Date().toISOString()}
                                            category={news.category || categoryName}
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
