import React, { useEffect, useState } from 'react';
import NewsCard from './NewsCard';
import config from '../config/config';
import '../index.css';
export default function ShowThreeTrendingNews({ category }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${config.api.base}${config.api.news}/threeTrending`);
        const data = await response.json();
        setNewsList(data);
      } catch (error) {
        console.error('Error fetching news:', error);
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
