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
                <title>Tech Brief Daily - Your Daily Dose of Technology News</title>
                <meta name="description" content="Stay informed with the latest technology news, AI developments, startup updates, and tech innovations. Your trusted source for curated tech content." />
                <meta name="keywords" content="tech news, technology, AI news, startup news, software development, tech innovations, programming, gadgets" />
            </Helmet>

            <div className="home-container">
                {/* Hero Section with Trending Tech News Carousel */}
                <HeroTrendingNews />

                <main className="home-main-content">
                    {/* Latest Tech News Section */}
                    <section className="home-section">
                        <LatestNews title="Latest Tech News" type="latestFour" />
                    </section>

                    {/* Trending Tech News Section */}
                    <section className="home-section">
                        <ShowFourTrendingNews />
                    </section>

                    {/* Tech Categories Section */}
                    <section className="home-section">
                        <div className="section-header">
                            <h2 className="section-title">Technology News</h2>
                            <p className="section-subtitle">Discover the latest in technology and innovation</p>
                        </div>
                        <NewsDifferentType />
                    </section>
                </main>
            </div>
        </>
    );
}