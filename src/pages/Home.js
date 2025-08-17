import LatestNews from "../components/LatestNews";
import Subscribe from "../components/Subscribe";
import NewsDifferentType from "../components/NewsDifferentType";
import NewsTicker from "../components/NewsTicker";
import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../modern-theme.css';
import ShowFourTrendingNews from "../components/ShowFourTrendingNews";
import HeroTrendingNews from "../components/HeroTrendingNews";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Tech Brief Daily - Your Daily Dose of Technology News</title>
                <meta name="description" content="Stay informed with the latest technology news, AI developments, startup updates, and tech innovations. Your trusted source for curated tech content." />
                <meta name="keywords" content="tech news, technology, AI news, startup news, software development, tech innovations, programming, gadgets" />
            </Helmet>

            <div className="modern-home-container">
                {/* Hero Brand Section */}
                <section className="brand-header">
                    <div className="brand-container">
                        <h1 className="main-brand-title">
                            <span className="main-heading">Briefli News</span>
                        </h1>
                    </div>
                </section>

                {/* Dynamic Headline Ticker */}
                <NewsTicker />

                {/* Main Grid Layout */}
                <main className="news-grid-layout">
                    <div className="grid-container">
                        {/* Left Column - Featured News */}
                        <section className="grid-column main-column">
                            <HeroTrendingNews />
                            <LatestNews title="" type="latestFour" />
                        </section>

                        {/* Right Column - Category Sections */}
                        <aside className="grid-column sidebar-column">
                            {/* AI News Section */}
                            <section className="category-section ai-section">
                                <div className="category-content">
                                    <ShowFourTrendingNews />
                                </div>
                            </section>

                            {/* Trending Categories Widget */}
                            <section className="trending-categories">
                                <div className="category-header">
                                    <h3 className="category-title">
                                        Trending Topics
                                    </h3>
                                    <div className="category-line trending-line"></div>
                                </div>
                                <div className="trending-tags">
                                    <span className="trending-tag blockchain">Blockchain</span>
                                    <span className="trending-tag ai">Machine Learning</span>
                                    <span className="trending-tag iot">IoT Devices</span>
                                    <span className="trending-tag cyber">Cybersecurity</span>
                                    <span className="trending-tag space">Space Tech</span>
                                </div>
                            </section>

                            {/* Quick Stats Widget */}
                            <section className="tech-stats">
                                <div className="category-header">
                                    <h3 className="category-title">
                                        Tech Pulse
                                    </h3>
                                    <div className="category-line stats-line"></div>
                                </div>
                                <div className="stats-grid">
                                    <div className="stat-item">
                                        <span className="stat-number">2.4B</span>
                                        <span className="stat-label">Daily Users</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">156K</span>
                                        <span className="stat-label">AI Models</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">89%</span>
                                        <span className="stat-label">Cloud Adoption</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">$2.1T</span>
                                        <span className="stat-label">Tech Market</span>
                                    </div>
                                </div>
                            </section>
                        </aside>
                    </div>
                </main>

                {/* Categories Grid Section */}
                <section className="categories-grid-section">
                    <div className="section-header centered">
                        <h2 className="section-title">
                            Explore Tech Categories
                        </h2>
                        <p className="section-description">Dive deep into specific technology domains</p>
                    </div>
                    <NewsDifferentType />
                </section>

                {/* Newsletter Section */}
                <section className="newsletter-section">
                    <Subscribe />
                </section>
            </div>
        </>
    );
}