import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';

function Terms() {
    return (
        <>
            <Helmet>
                <title>Terms of Service - Daily Brief Newsly</title>
                <meta name="description" content="Terms of Service for Daily Brief Newsly - Rules and guidelines for using our news platform." />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="page-container">
                <div className="page-hero">
                    <h1 className="page-title">Terms of Service</h1>
                    <p className="page-subtitle">Rules and guidelines for using our platform</p>
                </div>

                <div className="content-card">
                    <div className="card-content">
                        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

                        <h2>1. Acceptance of Terms</h2>
                        <p>By accessing and using Daily Brief Newsly, you accept and agree to be bound by the terms and provisions of this agreement.</p>

                        <h2>2. Description of Service</h2>
                        <p>Daily Brief Newsly is a news aggregation platform that curates and presents news from various sources. We do not create original news content.</p>

                        <h2>3. User Responsibilities</h2>
                        <p>You are responsible for your use of the service and for any content you may share. You agree not to use the service for any unlawful purpose.</p>

                        <h2>4. Intellectual Property</h2>
                        <p>The service and its original content, features, and functionality are owned by Daily Brief Newsly and are protected by copyright and other intellectual property laws.</p>

                        <h2>5. Content Policy</h2>
                        <p>All news content is sourced from third-party publishers. We respect intellectual property rights and comply with fair use policies.</p>

                        <h2>6. Disclaimer</h2>
                        <p>The information on this website is provided on an "as is" basis. We make no warranties regarding the accuracy or completeness of any information.</p>

                        <h2>7. Limitation of Liability</h2>
                        <p>Daily Brief Newsly shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of the service.</p>

                        <h2>8. Termination</h2>
                        <p>We may terminate or suspend your access to the service immediately, without prior notice, for conduct that we believe violates these terms.</p>

                        <h2>9. Ads and Monetization</h2>
                        <p>We may display third-party advertisements (such as Google AdSense). We are not responsible for the content, accuracy, or reliability of any external ads.</p>

                        <h2>10. Prohibited Activities</h2>
                        <p>Do not attempt to reverse-engineer, scrape, or exploit the data presented on this site. Any misuse will be considered a violation of these terms.</p>

                        <h2>11. Changes to Terms</h2>
                        <p>We reserve the right to modify these terms at any time. Your continued use of the service after changes constitutes acceptance of the updated terms.</p>

                        <h2>12. Contact Information</h2>
                        <p>If you have any questions about these terms, please contact us at <strong>support@briefnewsly.org</strong>.</p>

                        <div className="closing-section">
                            <p className="closing-text">
                                By using our website, you acknowledge that you have read and understood these terms and agree to be bound by them.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Terms;
