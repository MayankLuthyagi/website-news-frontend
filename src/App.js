import React from 'react';
import Navbar from './include/Navbar';
import Footer from './include/Footer';
import './App.css';
import AllLatestNews from './pages/AllLatestNews';
import Home from './pages/Home';
import NewsDetail from './pages/NewsDetail';
import About from './pages/About';
import Contact from './pages/Contact';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Disclaimer from './pages/Disclaimer';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import CategoryNews from './pages/CategoryNews';
import ScrollToTop from './components/ScrollToTop';
import { ThemeProvider } from './contexts/ThemeContext';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

function NewsDetailWrapper() {
  const { title } = useParams();
  return <NewsDetail key={title} />;
}

function NewsDetailIdWrapper() {
  const { id } = useParams();
  return <NewsDetail key={id} />;
}

function App() {
  return (
    <HelmetProvider>
      <ThemeProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes (without navbar/footer) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Regular Routes (with navbar/footer) */}
            <Route path="/*" element={
              <>
                <Navbar />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/latest-news" element={<AllLatestNews />} />
                  <Route path="/news-detail" element={<NewsDetail />} />
                  <Route path="/news-detail/:title" element={<NewsDetailWrapper />} />
                  <Route path="/news/:title" element={<NewsDetailWrapper />} />
                  <Route path="/category/:categoryName" element={<CategoryNews />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/disclaimer" element={<Disclaimer />} />
                </Routes>
                <Footer />
              </>
            } />
          </Routes>
        </Router>
      </ThemeProvider>
    </HelmetProvider>
  );
}

export default App;
