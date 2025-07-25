import React, { useEffect, useState } from 'react';
import NewsCard from '../components/news_cards/NewsCard';
import FeaturedCard from '../components/news_cards/FeaturedCard';
import CompactCard from '../components/news_cards/CompactCard';
import FullImageCard from '../components/news_cards/FullImageCard';
import SideImageCard from '../components/news_cards/SideImageCard';
import '../index.css';
import { Helmet } from 'react-helmet-async';
import config from '../config/config';
export default function AllLatestNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const endpoint = `${config.api.base}${config.api.latestNews}`;
        console.log('AllLatestNews - Config object:', config);
        console.log('AllLatestNews - API base URL:', config.api.base);
        console.log('AllLatestNews - Full endpoint URL:', endpoint);

        const response = await fetch(endpoint);
        console.log('AllLatestNews - Response status:', response.status);

        const data = await response.json();
        // Remove duplicates based on title
        const uniqueNews = data.filter((news, index, self) =>
          index === self.findIndex(n => n.title === news.title)
        );
        setNewsList(uniqueNews);
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
      <div className="all-news-container">
        <div className="all-news-header">
          <h1>All Latest News</h1>
          <p>Stay updated with comprehensive news coverage from multiple sources</p>
        </div>

        {loading ? (
          <div className="loading-section">
            <p>Loading news...</p>
          </div>
        ) : newsList.length > 0 ? (
          <>
            {/* Featured News Section */}
            <section className="featured-news-section">
              <h2 className="section-title">Featured Stories</h2>
              <div className="featured-news-grid">
                {newsList.slice(0, 3).map((news, idx) => (
                  <FeaturedCard
                    key={`featured-${idx}`}
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
                ))}
              </div>
            </section>

            {/* Breaking News Section */}
            <section className="breaking-news-section">
              <h2 className="section-title">Breaking News</h2>
              <div className="breaking-news-grid">
                {newsList.slice(3, 9).map((news, idx) => (
                  <CompactCard
                    key={`breaking-${idx}`}
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
                ))}
              </div>
            </section>

            {/* Full Image Stories Section */}
            <section className="full-image-section">
              <h2 className="section-title">In Focus</h2>
              <div className="full-image-grid">
                {newsList.slice(9, 12).map((news, idx) => (
                  <FullImageCard
                    key={`focus-${idx}`}
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
                ))}
              </div>
            </section>

            {/* Quick Reads Section */}
            <section className="quick-reads-section">
              <h2 className="section-title">Quick Reads</h2>
              <div className="quick-reads-grid">
                {newsList.slice(12, 20).map((news, idx) => (
                  <SideImageCard
                    key={`quick-${idx}`}
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
                ))}
              </div>
            </section>

            {/* More News Section */}
            <section className="more-news-section">
              <h2 className="section-title">More Stories</h2>
              <div className="more-news-grid">
                {newsList.slice(20).map((news, idx) => (
                  <NewsCard
                    key={`more-${idx}`}
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
                ))}
              </div>
            </section>
          </>
        ) : (
          <div className="no-news-section">
            <p>No news available at the moment.</p>
          </div>
        )}
      </div>
    </>
  );
}