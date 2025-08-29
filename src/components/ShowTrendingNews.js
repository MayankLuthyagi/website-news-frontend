import React, { useEffect, useState } from 'react';
import ModernNewsCard from './news_cards/ModernNewsCard';
import config from '../config/config';
import '../modern-theme.css';
export default function TrendingNews({ title, type }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // First try the specific endpoint
        const response = await fetch(`${config.api.base}${config.api.news}/getTrendingNews?category=Tech&limit=11`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('LatestNews - Tech data:', data);

        // If data is an array and has items, use it
        if (Array.isArray(data) && data.length > 0) {
          setNewsList(data);
        } else {
          // Try the category endpoint as secondary option
          const categoryResponse = await fetch(`${config.api.base}/api/news/category/Tech?limit=10 `);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            console.log('LatestNews - Category data:', categoryData);

            // Check if we have actual tech news
            if (categoryData.news && categoryData.news.length > 0) {
              setNewsList(categoryData.news);
            } else {
              // No tech news available - show empty array
              console.log('No tech news found in database');
              setNewsList([]);
            }
          } else {
            setNewsList([]);
          }
        }
      } catch (error) {
        console.error('Error fetching tech news:', error);
        // Don't fallback to other categories - just show empty
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [type]);
      const getImageSource = (news) => {
      if (news.image && news.image.trim() !== "") {
        return news.image;
      }
      return "/images/Tech.png"; // fallback image
    };
  return (
    <div>
      <div className="news-grid">
        {loading ? (
          <p>Loading news...</p>
        ) : newsList.length > 0 ? (
          newsList.map((news, idx) => (
            <ModernNewsCard
              key={news.id || idx}
              id={news.id}
              title={news.title}
              image={getImageSource(news)}
              date={news.date}
              category={news.category}
              subcategory={news.subcategory}
              summary={news.summary}
              source_id={news.source_id}
              source_name={news.source_name}
              url={news.link}
              variant={idx === 0 ? 'featured' : 'default'}
            />
          ))
        ) : (
          <div className="no-news-message">
            <p>No Tech news available at the moment.</p>
            <p>Please check back later for the latest technology updates.</p>
          </div>
        )}
      </div>
    </div>
  );
}
