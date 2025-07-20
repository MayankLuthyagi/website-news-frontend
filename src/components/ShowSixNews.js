import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import config from '../config/config';
import '../index.css';
export default function ShowThreeNews({ category }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching news for category: ${category}`);
        const response = await fetch(`${config.api.base}${config.api.news}/six?category=${category}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setNewsList(data);
      } catch (error) {
        console.error(`No news available for ${category} category.`);
        setError(`No news available for ${category} category.`);
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchNews();
    }
  }, [category]);
  return (

    <div className="news-grid">
      {loading ? (
        <p>Loading news...</p>
      ) : error ? (
        <div className="error-message">
          <p>{error}</p>
        </div>
      ) : newsList.length > 0 ? (
        newsList.map((news, idx) => (
          <NewsCard
            key={idx}
            id={news.id}
            title={news.title}
            image={news.image}
            date={news.date}
            category={news.category}
            summary={news.summary}
            source_id={news.source_id}
            source_name={news.source_name}
            url={news.link}
          />
        ))
      ) : (
        <p>No news available for {category} category.</p>
      )}
    </div>

  );
}
