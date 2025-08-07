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
        // Fetch Tech latest news using correct API structure
        const endpoint = `${config.api.base}/api/news/latest?category=Tech`;
        console.log('AllLatestNews - Tech endpoint:', endpoint);

        const response = await fetch(endpoint);
        console.log('AllLatestNews - Response status:', response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('AllLatestNews - Tech data:', data);

        // Check if we have actual tech news data
        if (Array.isArray(data) && data.length > 0) {
          // Remove duplicates based on title
          const uniqueNews = data.filter((news, index, self) =>
            index === self.findIndex(n => n.title === news.title)
          );
          setNewsList(uniqueNews);
        } else {
          // Try category endpoint as secondary option
          const categoryResponse = await fetch(`${config.api.base}/api/news/category/Tech`);
          if (categoryResponse.ok) {
            const categoryData = await categoryResponse.json();
            console.log('AllLatestNews - Category data:', categoryData);

            // Check if we have actual tech news
            if (categoryData.news && categoryData.news.length > 0) {
              const uniqueNews = categoryData.news.filter((news, index, self) =>
                index === self.findIndex(n => n.title === news.title)
              );
              setNewsList(uniqueNews);
            } else {
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
  }, []);

  return (
    <>
      <Helmet>
        <title>All Latest Tech News - Tech Brief Daily</title>
        <meta name="description" content="Stay updated with all the latest technology news. Get breaking tech news, trending stories, and in-depth coverage on AI, startups, gadgets, and innovation." />
        <meta name="keywords" content="latest tech news, breaking tech news, technology, AI, startups, gadgets, software, innovation, programming" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="All Latest Tech News - Tech Brief Daily" />
        <meta property="og:description" content="Stay updated with all the latest technology news. Get breaking tech news, trending stories, and in-depth coverage." />
        <meta property="og:image" content={`${config.api.base}/images/tech-og-image.jpg`} />
        <meta property="og:url" content={`${config.api.base}/latest-news`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Tech Brief Daily" />

        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="All Latest Tech News - Tech Brief Daily" />
        <meta name="twitter:description" content="Stay updated with all the latest technology news from around the world." />
        <meta name="twitter:image" content={`${config.api.base}/images/tech-og-image.jpg`} />

        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="canonical" href={`${config.api.base}/latest-news`} />
      </Helmet>
      <div className="all-news-container">
        <div className="all-news-header">
          <h1>All Latest Tech News</h1>
          <p>Stay updated with comprehensive technology news coverage from multiple sources</p>
        </div>

        {loading ? (
          <div className="loading-section">
            <p>Loading news...</p>
          </div>
        ) : newsList.length > 0 ? (
          <>
            {/* Featured News Section */}
            <section className="featured-news-section">
              <h2 className="section-title">Featured Tech Stories</h2>
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
              <h2 className="section-title">Breaking Tech News</h2>
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
              <h2 className="section-title">Tech In Focus</h2>
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
            <div className="no-news-message">
              <h3>No Tech News Available</h3>
              <p>We're currently updating our technology news database.</p>
              <p>Please check back soon for the latest tech updates and innovations.</p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}