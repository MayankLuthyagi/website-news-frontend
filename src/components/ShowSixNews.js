import React, { useEffect, useState } from 'react';
import ModernNewsCard from './news_cards/ModernNewsCard';
import config from '../config/config';
import '../modern-theme.css';
export default function ShowThreeNews({ category }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      setError(null);
      try {
        console.log(`Fetching news for tech subcategory: ${category}`);

        // First try subcategory-specific tech news
        let endpoint = `${config.api.base}/api/news/subcategory/${encodeURIComponent(category)}?limit=6`;
        console.log('ShowSixNews - Subcategory endpoint:', endpoint);

        let response = await fetch(endpoint);
        console.log('ShowSixNews - Subcategory response status:', response.status);

        if (response.ok) {
          const data = await response.json();
          console.log(`ShowSixNews - ${category} subcategory data:`, data);

          // Extract news array from subcategory response
          const newsArray = data.news || [];
          if (newsArray.length > 0) {
            setNewsList(newsArray.slice(0, 6));
            setLoading(false);
            return;
          }
        }

        // Fallback to Tech category with subcategory filter
        endpoint = `${config.api.base}/api/news/category/Tech?subcategory=${encodeURIComponent(category)}&limit=6`;
        console.log('ShowSixNews - Category fallback endpoint:', endpoint);

        response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          console.log('ShowSixNews - Category fallback data:', data);

          const newsArray = data.news || [];
          if (newsArray.length > 0) {
            setNewsList(newsArray.slice(0, 6));
          } else {
            console.log(`No tech news found for subcategory: ${category}`);
            setNewsList([]);
          }
        } else {
          console.log('Category fallback also failed');
          setNewsList([]);
        }

      } catch (error) {
        console.error(`Error fetching ${category} tech news:`, error);
        setNewsList([]);
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
          <ModernNewsCard
            key={news.id || idx}
            id={news.id}
            title={news.title}
            image={news.image}
            date={news.date}
            category={news.category}
            summary={news.summary}
            source_id={news.source_id}
            source_name={news.source_name}
            url={news.link}
            variant="default"
          />
        ))
      ) : (
        <div className="no-news-message">
          <p>No {category} tech news available at the moment.</p>
          <p>Check back soon for updates in this technology category.</p>
        </div>
      )}
    </div>

  );
}
