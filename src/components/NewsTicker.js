import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import config from '../config/config';
import '../modern-theme.css';

export default function NewsTicker() {
    const [tickerNews, setTickerNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTickerNews = async () => {
            try {
                // Fetch latest 5 news articles for the ticker
                const response = await fetch(`${config.api.base}${config.api.news}/latestFive?category=Tech`);

                if (!response.ok) {
                    // Try alternative endpoint
                    const categoryResponse = await fetch(`${config.api.base}/api/news/category/Tech?limit=5`);
                    if (categoryResponse.ok) {
                        const categoryData = await categoryResponse.json();
                        if (Array.isArray(categoryData) && categoryData.length > 0) {
                            setTickerNews(categoryData.slice(0, 5));
                        } else if (categoryData.news && Array.isArray(categoryData.news)) {
                            setTickerNews(categoryData.news.slice(0, 5));
                        }
                    }
                } else {
                    const data = await response.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setTickerNews(data.slice(0, 5));
                    } else if (data.news && Array.isArray(data.news)) {
                        setTickerNews(data.news.slice(0, 5));
                    }
                }
            } catch (error) {
                console.error('Error fetching ticker news:', error);
                // Fallback to some default headlines if API fails
                setTickerNews([
                    {
                        _id: 'fallback1',
                        title: "Latest Technology News Loading...",
                        slug: 'tech-news-loading'
                    },
                    {
                        _id: 'fallback2',
                        title: "Breaking: Tech Updates Coming Soon",
                        slug: 'tech-updates-soon'
                    },
                    {
                        _id: 'fallback3',
                        title: "Stay Tuned for Real-Time Headlines",
                        slug: 'real-time-headlines'
                    }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchTickerNews();
    }, []);

    // Handle click on news item
    const handleNewsClick = (newsItem) => {
        // Create URL-friendly title with dashes
        const urlFriendlyTitle = newsItem.title.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with dashes
            .replace(/-+/g, '-') // Replace multiple dashes with single dash
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing dashes

        // Navigate to news detail page using title-based route
        navigate(`/news/${urlFriendlyTitle}`, {
            state: {
                newsData: newsItem
            }
        });
    };

    // Create clickable ticker content
    const renderTickerContent = () => {
        if (loading) {
            return (
                <span className="ticker-item non-clickable">
                    Loading latest news headlines...
                </span>
            );
        }

        if (tickerNews.length === 0) {
            return (
                <span className="ticker-item non-clickable">
                    No news available at the moment • Stay tuned for updates •
                </span>
            );
        }

        return tickerNews.map((news, index) => (
            <React.Fragment key={news._id || news.id || index}>
                <span
                    className="ticker-item clickable"
                    onClick={() => handleNewsClick(news)}
                    title={`Click to read: ${news.title}`}
                >
                    {news.title}
                </span>
                {index < tickerNews.length - 1 && <span className="ticker-separator"> • </span>}
                {index === tickerNews.length - 1 && <span className="ticker-separator"> • </span>}
            </React.Fragment>
        ));
    };

    return (
        <section className="headline-ticker">
            <div className="ticker-container">
                <div className="ticker-content">
                    <div className="ticker-text">
                        {renderTickerContent()}
                    </div>
                </div>
            </div>
        </section>
    );
}
