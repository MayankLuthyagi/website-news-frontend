import React, { useEffect, useState } from 'react';
import NewsCard from '../components/NewsCard';
import '../index.css';
import { Helmet } from 'react-helmet-async';
import config from '../config/config';
export default function AllLatestNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch(`${config.api.base}${config.api.latestNews}`);
        const data = await response.json();
        setNewsList(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  return (
    <>
      <Helmet>
        <title>All Latest News - Your News Portal</title>
        <meta name="description" content="Stay updated with all the latest news from around the world. Get breaking news, trending stories, and in-depth coverage on politics, technology, sports, and more." />
        <meta name="keywords" content="latest news, breaking news, world news, politics, technology, sports, entertainment, business news" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="All Latest News - Your News Portal" />
        <meta property="og:description" content="Stay updated with all the latest news from around the world. Get breaking news, trending stories, and in-depth coverage." />
        <meta property="og:image" content={`${config.SERVER_URL}/images/news-og-image.jpg`} />
        <meta property="og:url" content={`${config.SERVER_URL}/latest-news`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Your News Portal" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All Latest News - Your News Portal" />
        <meta name="twitter:description" content="Stay updated with all the latest news from around the world." />
        <meta name="twitter:image" content={`${config.SERVER_URL}/images/news-og-image.jpg`} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={`${config.SERVER_URL}/latest-news`} />
      </Helmet>
      <div className="main-content">
        <h2>All Latest News</h2>
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
      </div>
    </>
  );
}