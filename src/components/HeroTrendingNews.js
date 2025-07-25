import React, { useEffect, useState } from 'react';
import { LargeCard } from "./news_cards/LargeCard";
import config from "../config/config";

export default function HeroTrendingNews() {
    const [trendingNews, setTrendingNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentNewsIndex, setCurrentNewsIndex] = useState(0);

    useEffect(() => {
        fetch(`${config.serverUrl}/api/news/fourTrending`)
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setTrendingNews(data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching hero news:', error);
                setLoading(false);
            });
    }, []);

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
        <div className="home-hero-section">
            {loading ? (
                <div className="loading">Loading trending news...</div>
            ) : trendingNews.length > 0 ? (
                <div className="hero-carousel">
                    <LargeCard
                        key={trendingNews[currentNewsIndex].id || currentNewsIndex}
                        title={trendingNews[currentNewsIndex].title}
                        image={trendingNews[currentNewsIndex].image}
                        date={trendingNews[currentNewsIndex].date}
                        category={trendingNews[currentNewsIndex].category}
                        summary={trendingNews[currentNewsIndex].summary}
                        source_id={trendingNews[currentNewsIndex].source_id}
                        source_name={trendingNews[currentNewsIndex].source_name}
                        url={trendingNews[currentNewsIndex].url}
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
                <div className="no-news">No trending news available</div>
            )}
        </div>
    );
}
