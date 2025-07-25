import LatestNews from "../components/LatestNews";
import Subscribe from "../components/Subscribe";
import NewsDifferentType from "../components/NewsDifferentType";
import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';
import ShowFourTrendingNews from "../components/ShowFourTrendingNews";
import HeroTrendingNews from "../components/HeroTrendingNews";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Daily Brief Newsly - Your Daily Dose of Curated News</title>
                <meta name="description" content="Stay informed with curated news from trusted global sources. Get the latest world, national, tech, and sports news with AI-enhanced summaries." />
                <meta name="keywords" content="daily news, breaking news, world news, national news, tech news, sports news, curated news" />
            </Helmet>

            <div className="home-container">
                {/* Hero Section with Trending News Carousel */}
                <HeroTrendingNews />

                <main className="home-main-content">
                    {/* Latest News Section */}
                    <section className="home-section">
                        <LatestNews title="Latest News" type="latestFour" />
                    </section>

                    {/* Trending News Section */}
                    <section className="home-section">
                        <ShowFourTrendingNews />
                    </section>

                    {/* Categories Section */}
                    <section className="home-section">
                        <div className="section-header">
                            <h2 className="section-title">Browse by Category</h2>
                            <p className="section-subtitle">Discover news from different categories</p>
                        </div>
                        <NewsDifferentType />
                    </section>
                </main>
            </div>
        </>
    );
}