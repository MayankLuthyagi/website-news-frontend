import React, { useEffect, useState } from 'react';
import ModernNewsCard from '../components/news_cards/ModernNewsCard';
import SideModernNewsCard from '../components/news_cards/SideModernNewsCard';
import '../index.css';

import { Helmet } from 'react-helmet-async';
import { useTheme } from '../contexts/ThemeContext';
import config from '../config/config';

export default function AllLatestNews() {
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // Fetch Tech latest news using correct API structure
        const endpoint = `${config.api.base}/api/news/getLatestNews?category=Tech&limit=1000`;

        const response = await fetch(endpoint);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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

            // Check if we have actual tech news
            if (categoryData.news && categoryData.news.length > 0) {
              const uniqueNews = categoryData.news.filter((news, index, self) =>
                index === self.findIndex(n => n.title === news.title)
              );
              setNewsList(uniqueNews);
            } else {
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

  // Calculate the midpoint to divide the news list equally
  const midpoint = Math.ceil(newsList.length / 5);
  const getImageSource = (news) => {
    if (news.image && news.image.trim() !== "") {
      return news.image;
    }
    return "/images/Tech.png"; // fallback image
  };
  return (
    <>
      <Helmet>
        <title>Latest Tech News - Tech Brief Daily</title>
        <meta name="description" content="Stay updated with all the latest technology news. Get breaking tech news, trending stories, and in-depth coverage on AI, startups, gadgets, and innovation." />
        <meta name="keywords" content="latest tech news, breaking tech news, technology, AI, startups, gadgets, software, innovation, programming" />

        {/* Open Graph Tags */}
        <meta property="og:title" content="All Latest Tech News - Tech Brief Daily" />
        <meta property="og:description" content="Stay updated with all the latest technology news. Get breaking tech news, trending stories, and in-depth coverage." />
        <meta property="og:image" content={`${config.api.base}/images/tech-og-image.jpg`} />
        <meta property="og:url" content={`${config.api.base}/getLatestNews`} />
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
        <link rel="canonical" href={`${config.api.base}/getLatestNews`} />
      </Helmet>
      <div className="modern-home-container">
        {/* Brand Header Section */}
        <section className="brand-header">
          <div className="brand-container">
            <h1 className="main-brand-title">
              <span className="other-heading">Latest News</span>
            </h1>
          </div>
        </section>

        {loading ? (
          <div className="loading-section modern-loading">
            <div className="loading-spinner"></div>
            <p>Loading latest tech news...</p>
          </div>
        ) : newsList.length > 0 ? (
          <main className="news-grid-layout">
            <div className="grid-container">
              {/* Featured News Section - First Half */}
              <section className="news-section featured-section">
                <div className="modern-grid featured-grid">
                  {newsList.slice(0, midpoint).map((news, idx) => (
                    <ModernNewsCard
                      key={`featured-${idx}`}
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
                      variant="featured"
                    />
                  ))}
                </div>
              </section>

              {/* Breaking News Section - Second Half */}
              <section className="news-section breaking-section">
                <div className="modern-grid compact-grid">
                  {newsList.slice(midpoint).map((news, idx) => (
                    <SideModernNewsCard
                      key={`breaking-${idx}`}
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
                  ))}
                </div>
              </section>
            </div>
          </main>
        ) : (
          <div className="empty-state-section">
            <div className="empty-state-container">
              <div className="empty-state-icon">📰</div>
              <h3 className="empty-state-title">No Tech News Available</h3>
              <p className="empty-state-description">
                We're currently updating our technology news database.
                <br />
                Please check back soon for the latest tech updates and innovations.
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
}