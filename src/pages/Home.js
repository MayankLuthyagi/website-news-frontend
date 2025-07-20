import LatestNews from "../components/LatestNews";
import Subscribe from "../components/Subscribe";
import NewsDifferentType from "../components/NewsDifferentType";
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';
import ShowThreeTrendingNews from "../components/ShowThreeTrendingNews";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Daily Brief Newsly - Your Daily Dose of Curated News</title>
                <meta name="description" content="Stay informed with curated news from trusted global sources. Get the latest world, national, tech, and sports news with AI-enhanced summaries." />
                <meta name="keywords" content="daily news, breaking news, world news, national news, tech news, sports news, curated news" />
            </Helmet>

            <div className="home-container">
                {/* Hero Section with Subscribe */}
                <div className="home-hero-section">
                    <Subscribe />
                </div>

                <main className="home-main-content">
                    {/* Latest News Section */}
                    <section className="home-section">
                        <div className="section-card">
                            <LatestNews title="Latest News" type="latestThree" />
                        </div>
                    </section>

                    {/* Trending News Section */}
                    <section className="home-section">
                        <div className="section-card">
                            <ShowThreeTrendingNews />
                        </div>
                    </section>

                    {/* Categories Section */}
                    <section className="home-section">
                        <div className="section-card">
                            <div className="section-header">
                                <h2 className="section-title">Browse by Category</h2>
                                <p className="section-subtitle">Discover news from different categories</p>
                            </div>
                            <NewsDifferentType />
                        </div>
                    </section>
                </main>
            </div>
        </>
    );
}