import React, { useEffect, useState } from 'react';
import Navbar from './include/Navbar';
import NewsCard from './components/NewsCard';
import Footer from './include/Footer';
import './App.css';
import Subscribe from './components/Subscribe';
import LatestNews from './components/LatestNews';
import AllLatestNews from './pages/AllLatestNews';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import ScrollToTop from './components/ScrollToTop';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

function NewsDetailWrapper() {
  const { title } = useParams();
  return <NewsDetail key={title} />;
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ScrollToTop />
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/latest-news" element={<AllLatestNews />} />
          <Route path="/news-detail" element={<NewsDetail />} />
          <Route path="/news-detail/:title" element={<NewsDetailWrapper />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          {/* ...other routes */}
        </Routes>
        <Footer />
      </Router>
    </HelmetProvider>
  );
}

export default App;
