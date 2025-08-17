import React, { useEffect, useState } from 'react';
import ModernNewsCard from './news_cards/ModernNewsCard';
import config from '../config/config';
import '../modern-theme.css';
export default function ShowThreeTrendingNews({ category }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Try Tech trending news first
        const endpoint = `${config.api.base}/api/news/fourTrending?category=Tech&limit=4`;
        console.log('ShowFourTrendingNews - Tech endpoint:', endpoint);

        const response = await fetch(endpoint);
        console.log('ShowFourTrendingNews - Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('ShowFourTrendingNews - Tech data:', data);

        // Check if we have actual data
        if (Array.isArray(data) && data.length > 0) {
          setNewsList(data);
        } else {
          // Try category endpoint as secondary option
          const categoryResponse = await fetch(`${config.api.base}/api/news/category/Tech?limit=4`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            console.log('ShowFourTrendingNews - Category data:', categoryData);

            // Check if we have actual tech news
            if (categoryData.news && categoryData.news.length > 0) {
              setNewsList(categoryData.news.slice(0, 4));
            } else {
              console.log('No tech trending news found in database');
              setNewsList([]);
            }
          } else {
            setNewsList([]);
          }
        }
      } catch (error) {
        console.error('Error fetching trending tech news:', error);
        // Don't fallback to other categories - just show empty
        setNewsList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]); // <-- add category here
  return (
    <>
      <div className='latest-news-header'>
        <a href="/latest-news">Trending</a>
      </div>
      <div className="news-grid">
        {loading ? (
          <p>Loading news...</p>
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
              variant="compact"
            />
          ))
        ) : (
          <div className="no-news-message">
            <p>No trending Tech news available at the moment.</p>
            <p>Check back soon for the latest technology trends.</p>
          </div>
        )}
      </div>
    </>
  );
}
