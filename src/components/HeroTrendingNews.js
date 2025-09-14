import React, { useEffect, useState } from 'react';
import ModernNewsCard from "./news_cards/ModernNewsCard";
import config from "../config/config";

export default function HeroTrendingNews() {
    const [trendingNews, setTrendingNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    useEffect(() => {
        const fetchTrendingNews = async () => {
            try {
                // Try Tech trending news first
                const endpoint = `${config.api.base}/api/news/getTrendingNews?category=Tech&limit=4`;

                const response = await fetch(endpoint);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Check if we have actual data
                if (Array.isArray(data) && data.length > 0) {
                    setTrendingNews(data);
                } else {
                    // Try category endpoint as secondary option
                    const categoryEndpoint = `${config.api.base}/api/news/category/Tech?limit=4`;

                    const categoryResponse = await fetch(categoryEndpoint);
                    if (categoryResponse.ok) {
                        const categoryData = await categoryResponse.json();

                        // Check if we have actual tech news
                        if (categoryData.news && categoryData.news.length > 0) {
                            setTrendingNews(categoryData.news.slice(0, 4));
                        } else {
                            setTrendingNews([]);
                        }
                    } else {
                        setTrendingNews([]);
                    }
                }
            } catch (error) {
                // Don't fallback to other categories - just show empty
                setTrendingNews([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTrendingNews();
    }, []);
    const getImageSource = (news) => {
      if (news.image && news.image.trim() !== "") {
        return news.image;
      }
      return "/images/Tech.png"; // fallback image
    };
    // Auto-slide effect
    useEffect(() => {
        if (trendingNews.length > 0) {
            const interval = setInterval(() => {
                setCurrentNewsIndex((prevIndex) =>
                    (prevIndex + 1) % trendingNews.length
                );
            }, 5000); // Change every 5 seconds

            return () => clearInterval(interval);
        }
    }, [trendingNews.length]);

    return (
        <div className="hero-trending-section">
            {loading ? (
                <div className="loading">Loading trending tech news...</div>
            ) : trendingNews.length > 0 ? (
                <div className="hero-carousel-modern">
                    <ModernNewsCard
                        key={trendingNews[currentNewsIndex].id || currentNewsIndex}
                        id={trendingNews[currentNewsIndex].id}
                        title={trendingNews[currentNewsIndex].title}
                        image={getImageSource(trendingNews[currentNewsIndex])}
                        date={trendingNews[currentNewsIndex].date}
                        category={trendingNews[currentNewsIndex].category}
                        summary={trendingNews[currentNewsIndex].summary}
                        source_id={trendingNews[currentNewsIndex].source_id}
                        source_name={trendingNews[currentNewsIndex].source_name}
                        url={trendingNews[currentNewsIndex].link}
                        variant="hero"
                    />

                    {/* Navigation dots */}
                    <div className="carousel-dots">
                        {trendingNews.map((_, index) => (
                            <button
                                key={index}
                                className={`dot ${index === currentNewsIndex ? 'active' : ''}`}
                                onClick={() => setCurrentNewsIndex(index)}
                                aria-label={`Go to news ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div className="no-tech-news-hero">
                    <div className="no-news-content">
                        <h2>No Tech News Available</h2>
                        <p>We're currently updating our technology news database.</p>
                        <p>Please check back soon for the latest tech updates and innovations.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
