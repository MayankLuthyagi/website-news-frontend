import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';

function Privacy() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - Daily Brief Newsly</title>
                <meta name="description" content="Privacy Policy for Daily Brief Newsly - Learn how we handle your data and protect your privacy." />
                <meta name="keywords" content="privacy policy, data protection, Daily Brief Newsly, user privacy" />
            </Helmet>

            <div className="page-container">
                <div className="page-hero">
                    <h1 className="page-title">Privacy Policy</h1>
                    <p className="page-subtitle">Your Privacy Matters to Us</p>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2>Privacy Policy</h2>
                    </div>

                    <div className="card-content">
                        <p>
                            At daily.briefnewsly.org, your privacy is important to us.
                        </p>

                        <div className="mission-section">
                            <h3 className="section-title">1. Information We Collect:</h3>
                            <p className="mission-text">
                                We do not collect personal data unless explicitly provided by you via email or contact forms.
                                Basic analytics (e.g., browser, region, traffic source) may be tracked anonymously to improve user experience.
                            </p>
                        </div>

                        <div className="how-it-works-section">
                            <div className="steps-container">
                                <div className="step-item">
                                    <div className="step-icon">2</div>
                                    <div className="step-content">
                                        <h4>Use of Cookies</h4>
                                        <p>We use cookies to enhance website functionality and serve relevant ads via Google AdSense.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">3</div>
                                    <div className="step-content">
                                        <h4>Third-party Services</h4>
                                        <p>We use third-party tools such as Google AdSense, RSS feeds, and analytics services which may collect usage data under their own terms.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">4</div>
                                    <div className="step-content">
                                        <h4>Data Sharing</h4>
                                        <p>We do not sell or share your personal data with any third parties for marketing.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">5</div>
                                    <div className="step-content">
                                        <h4>External Links</h4>
                                        <p>Our site may include external links to full news articles. These are attributed clearly and marked appropriately. We are not responsible for the privacy practices of these websites.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">6</div>
                                    <div className="step-content">
                                        <h4>Consent</h4>
                                        <p>By using our website, you consent to our privacy policy.</p>
                                    </div>
                                </div>

                                <div className="step-item">
                                    <div className="step-icon">7</div>
                                    <div className="step-content">
                                        <h4>Updates</h4>
                                        <p>We may update this policy periodically. Latest update: 20 July 2025</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="closing-section">
                            <p className="closing-text">
                                If you have any questions about this Privacy Policy, please contact us at support@briefnewsly.org
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Privacy;
