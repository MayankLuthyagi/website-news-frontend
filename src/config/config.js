// Configuration file for the application
const config = {
  // API endpoints
  api: {
    base: process.env.REACT_APP_SERVER_URL || 'https://website-news-backend.onrender.com',
    news: '/api/news',
    sources: '/api/sources',
    latestNews: '/api/news/latest',
    // Main navigation categories
    worldNews: '/api/news/category/world',
    indiaNews: '/api/news/category/india',
    // Dropdown categories
    financeNews: '/api/news/category/finance',
    educationNews: '/api/news/category/education',
    techNews: '/api/news/category/tech',
    businessNews: '/api/news/category/business',
    politicsNews: '/api/news/category/politics',
    sportsNews: '/api/news/category/sports',
    entertainmentNews: '/api/news/category/entertainment',
    healthNews: '/api/news/category/health'
  }
};

export default config;
