import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';

function About() {
    return (
        <>
            <Helmet>
                <title>About Us - Daily Brief Newsly</title>
                <meta name="description" content="Learn about Daily Brief Newsly - Your daily dose of curated news from trusted sources with AI-enhanced summaries." />
                <meta name="keywords" content="about us, news portal, daily brief newsly, curated news, AI news" />
            </Helmet>

            <div className="page-container">
                <div className="page-hero">
                    <h1 className="page-title">About Us</h1>
                    <p className="page-subtitle">Your Daily Dose of Curated News</p>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2>Welcome to Daily Brief Newsly</h2>
                    </div>

                    <div className="card-content">
                        <p>
                            At daily.briefnewsly.org, we bring you a concise and intelligently summarized
                            collection of the most relevant news from across the globe. We source our news
                            from trusted publishers through publicly available RSS feeds and enhance the
                            reading experience using cutting-edge AI tools to generate engaging and
                            SEO-optimized headlines and summaries.
                        </p>

                        <div className="mission-section">
                            <h3 className="section-title">Our Mission:</h3>
                            <p className="mission-text">
                                To make news consumption faster, smarter, and more accessible while giving
                                due credit to original sources.
                            </p>
                        </div>

                        <div className="how-it-works-section">
                            <h3 className="section-title">How It Works:</h3>
                            <div className="steps-container">
                                <div className="step-item">
                                    <div className="step-icon">1</div>
                                    <div className="step-content">
                                        <h4>Curated Sources</h4>
                                        <p>We curate news using verified RSS feeds from trusted publishers.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">2</div>
                                    <div className="step-content">
                                        <h4>AI Enhancement</h4>
                                        <p>AI rewrites help summarize and format content in an engaging manner.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">3</div>
                                    <div className="step-content">
                                        <h4>Original Credit</h4>
                                        <p>We link back to the original publisher for the full article — respecting both copyright and traffic redirection.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="closing-section">
                            <p className="closing-text">
                                Whether you're a casual reader or a daily news addict, we aim to make your
                                morning scroll lighter and smarter.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default About;
