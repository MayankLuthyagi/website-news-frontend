import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';

function Disclaimer() {
    return (
        <>
            <Helmet>
                <title>Disclaimer - Daily Brief Newsly</title>
                <meta name="description" content="Disclaimer for Daily Brief Newsly - Content attribution and liability limitations." />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="page-container">
                <div className="page-hero">
                    <h1 className="page-title">Disclaimer</h1>
                    <p className="page-subtitle">Content attribution and liability information</p>
                </div>

                <div className="content-card">
                    <div className="card-content">
                        <h2>Content Attribution</h2>
                        <p>Daily Brief Newsly is a news aggregation platform that collects and curates news from various publicly available sources. All news articles, summaries, and related content are sourced from third-party publishers and news organizations.</p>

                        <h2>Fair Use Policy</h2>
                        <p>We operate under fair use principles, providing brief summaries and excerpts of news articles with proper attribution to original sources. Users are encouraged to visit the original source for complete articles.</p>

                        <h2>Accuracy of Information</h2>
                        <p>While we strive to provide accurate and up-to-date information, we do not guarantee the accuracy, completeness, or reliability of any content on our platform. All information is provided "as is" without warranty of any kind.</p>

                        <h2>Third-Party Content</h2>
                        <p>We are not responsible for the content, accuracy, or opinions expressed in articles from third-party sources. The views expressed in these articles do not necessarily reflect our own views or opinions.</p>

                        <h2>Copyright Notice</h2>
                        <p>If you are a copyright owner and believe that your content has been used inappropriately, please contact us immediately at support@briefnewsly.org with details of the alleged infringement.</p>

                        <h2>External Links</h2>
                        <p>Our platform contains links to external websites. We are not responsible for the content, privacy policies, or practices of these external sites.</p>

                        <h2>No Professional Advice</h2>
                        <p>The information provided on this platform is for general informational purposes only and should not be considered as professional, legal, financial, or medical advice.</p>

                        <h2>Changes to Disclaimer</h2>
                        <p>We reserve the right to modify this disclaimer at any time without prior notice. Please review this page periodically for updates.</p>

                        <h2>Contact Us</h2>
                        <p>For any questions regarding this disclaimer or to report content issues, please contact us at support@briefnewsly.org</p>

                        <h2>For Content Creators & Publishers</h2>
                        <p>If you're a content creator or publisher and would like your feed removed or better credited, please contact us at <strong>support@briefnewsly.org</strong>. We are committed to working with publishers to ensure fair representation and proper attribution of their work.</p>

                        <h2>Our Ethical Commitment</h2>
                        <p>We believe in ethical journalism and supporting the original creators of news content. Our platform serves as a discovery tool that drives traffic back to publishers.</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Disclaimer;
