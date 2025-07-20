// Configuration file for the application
const config = {
  // Server URL - can be overridden by environment variables
  serverUrl: process.env.REACT_APP_SERVER_URL || 'http://localhost:3000',

  // API endpoints
  api: {
    base: process.env.REACT_APP_SERVER_URL || '',
    news: '/api/news',
    sources: '/api/sources',
    latestNews: '/api/news/latest'
  }
};

export default config;
