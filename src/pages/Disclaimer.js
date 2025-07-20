import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';

function Disclaimer() {
    return (
        <>
            <Helmet>
                <title>Disclaimer - Daily Brief Newsly</title>
                <meta name="description" content="Disclaimer for Daily Brief Newsly - Important information about our news aggregation and content policies." />
                <meta name="keywords" content="disclaimer, news aggregation, Daily Brief Newsly, content policy" />
            </Helmet>

            <div className="page-container">
                <div className="page-hero">
                    <h1 className="page-title">Disclaimer</h1>
                    <p className="page-subtitle">Important Information About Our Content</p>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2>Content Disclaimer</h2>
                    </div>

                    <div className="card-content">
                        <div className="mission-section">
                            <h3 className="section-title">Content Attribution:</h3>
                            <p className="mission-text">
                                All news content on this site is curated using public RSS feeds and rewritten by AI for
                                summarization purposes. We do not claim ownership of original reporting. Full credit and
                                links are provided.
                            </p>
                        </div>

                        <div className="how-it-works-section">
                            <h3 className="section-title">How We Handle Content:</h3>
                            <div className="steps-container">
                                <div className="step-item">
                                    <div className="step-icon">📰</div>
                                    <div className="step-content">
                                        <h4>RSS Feed Sources</h4>
                                        <p>We aggregate news from publicly available RSS feeds provided by established news organizations and publishers.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">🤖</div>
                                    <div className="step-content">
                                        <h4>AI Summarization</h4>
                                        <p>Our AI tools create summaries and enhanced headlines to improve readability while maintaining the core message of the original content.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">🔗</div>
                                    <div className="step-content">
                                        <h4>Source Attribution</h4>
                                        <p>Every article includes clear attribution to the original publisher with direct links to the full article on their website.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">⚖️</div>
                                    <div className="step-content">
                                        <h4>Copyright Respect</h4>
                                        <p>We respect copyright laws and fair use principles. We provide only brief summaries and always direct traffic back to the original publishers.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="publisher-notice">
                            <div className="notice-header">
                                <h3>For Content Creators & Publishers:</h3>
                            </div>
                            <p>
                                If you're a content creator or publisher and would like your feed removed or better credited,
                                please contact us at <strong>support@briefnewsly.org</strong>. We are committed to working with
                                publishers to ensure fair representation and proper attribution of their work.
                            </p>
                        </div>

                        <div className="closing-section">
                            <p className="closing-text">
                                We believe in ethical journalism and supporting the original creators of news content.
                                Our platform serves as a discovery tool that drives traffic back to publishers.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Disclaimer;
