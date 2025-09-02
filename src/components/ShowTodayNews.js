import React, { useEffect, useState } from 'react';
import SideModernNewsCard from './news_cards/SideModernNewsCard';
import config from '../config/config';
import '../modern-theme.css';
export default function ShowTodayNews({ category }) {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Try Tech trending news first
        const endpoint = `${config.api.base}/api/news/getTodayNews?category=Tech&limit=40`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        // Check if we have actual data
        if (Array.isArray(data) && data.length > 0) {
          setNewsList(data);
        } else {
          // Try category endpoint as secondary option
          const categoryResponse = await fetch(`${config.api.base}/api/news/category/Tech?limit=40`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();

            // Check if we have actual tech news
            if (categoryData.news && categoryData.news.length > 0) {
              setNewsList(categoryData.news);
            } else {
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

    const getImageSource = (news) => {
      if (news.image && news.image.trim() !== "") {
        return news.image;
      }
      return "/images/Tech.png"; // fallback image
    };
  return (
    <>

      <div className="news-grid">
        {loading ? (
          <p>Loading news...</p>
        ) : newsList.length > 0 ? (
          newsList.map((news, idx) => (
            <SideModernNewsCard
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
