import React, { useEffect, useState } from 'react';
import NewsCard from './news_cards/NewsCard';
import config from '../config/config';
import '../index.css';
export default function ShowThreeTrendingNews({ category }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const endpoint = `${config.api.base}/api/news/fourTrending`;
        console.log('ShowFourTrendingNews - API base URL:', config.api.base);
        console.log('ShowFourTrendingNews - Full endpoint URL:', endpoint);

        const response = await fetch(endpoint);
        console.log('ShowFourTrendingNews - Response status:', response.status);

        const data = await response.json();
        console.log('ShowFourTrendingNews - Received data:', data);
        setNewsList(data);
      } catch (error) {
        console.error('Error fetching trending news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [category]); // <-- add category here
  return (
    <>
      <div className='latest-news-header'>
        <h2>{"Trending News"}</h2>
        <a href="/latest-news">View All</a>
      </div>
      <div className="news-grid">
        {loading ? (
          <p>Loading news...</p>
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
          <p>No news available.</p>
        )}
      </div>
    </>
  );
}
