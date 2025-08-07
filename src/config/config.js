// Configuration file for the application - Tech News Focus
const config = {
  // API endpoints - All focused on tech news
  api: {
    base: process.env.REACT_APP_SERVER_URL || 'http://localhost:3000',
    news: '/api/news',
    sources: '/api/sources',
    latestNews: '/api/news/latest?category=Tech',
    latestFour: '/api/news/latestFour?category=Tech',
    six: '/api/news/six?category=Tech',
    fourTrending: '/api/news/fourTrending?category=Tech',
    // All endpoints now point to Tech category (capital T)
    techNews: '/api/news/category/Tech',
    // Tech subcategories - using subcategory parameter
    aiNews: '/api/news/subcategory/AI',
    cybersecurityNews: '/api/news/subcategory/Cybersecurity',
    quantumComputingNews: '/api/news/subcategory/Quantum Computing',
    arvrNews: '/api/news/subcategory/AR/VR',
    edgeComputingNews: '/api/news/subcategory/Edge Computing',
    sixGIoTNews: '/api/news/subcategory/6G & IoT',
    sustainableTechNews: '/api/news/subcategory/Sustainable Tech',
    gadgetsNews: '/api/news/subcategory/Gadgets',
    internetNews: '/api/news/subcategory/Internet',
    gamingNews: '/api/news/subcategory/Gaming',
    cloudNews: '/api/news/subcategory/Cloud',
    semiconductorsNews: '/api/news/subcategory/Semiconductors',
    web3News: '/api/news/subcategory/Web3',
    greenTechNews: '/api/news/subcategory/Green Tech',
    edTechNews: '/api/news/subcategory/EdTech',
    healthTechNews: '/api/news/subcategory/HealthTech',
    autotechNews: '/api/news/subcategory/Autotech',
    spaceTechNews: '/api/news/subcategory/Space Tech',
    // Keep original endpoints for admin/backend compatibility
    allNews: '/api/news',
    categories: '/api/news/categories/list',
    // Admin specific endpoints
    getAllNewsAdmin: "/api/news/admin/news", // Updated endpoint
  }
};

export default config;
