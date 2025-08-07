import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';

function Privacy() {
    return (
        <>
            <Helmet>
                <title>Privacy Policy - Daily Brief Newsly</title>
                <meta name="description" content="Privacy Policy for Daily Brief Newsly - How we collect, use, and protect your personal information." />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="page-container">
                <div className="page-hero">
                    <h1 className="page-title">Privacy Policy</h1>
                    <p className="page-subtitle">How we collect, use, and protect your information</p>
                </div>

                <div className="content-card">
                    <div className="card-content">
                        <p><strong>Last updated:</strong> {new Date().toLocaleDateString()}</p>

                        <h2>1. Information We Collect</h2>
                        <p>We collect information you provide directly to us, such as when you subscribe to our newsletter or contact us. We also automatically collect certain information when you visit our website.</p>

                        <h2>2. How We Use Your Information</h2>
                        <p>We use the information we collect to provide, maintain, and improve our services, send you newsletters and updates, and respond to your inquiries.</p>

                        <h2>3. Information Sharing</h2>
                        <p>We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy.</p>

                        <h2>4. Cookies and Tracking</h2>
                        <p>We use cookies and similar technologies to enhance your experience, analyze site usage, and assist in our marketing efforts.</p>

                        <h2>5. Third-Party Services</h2>
                        <p>Our website may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties.</p>

                        <h2>6. Data Security</h2>
                        <p>We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.</p>

                        <h2>7. Your Rights</h2>
                        <p>You have the right to access, update, or delete your personal information. You may also opt out of receiving promotional communications from us.</p>

                        <h2>8. Children's Privacy</h2>
                        <p>Our services are not directed to children under 13. We do not knowingly collect personal information from children under 13.</p>

                        <h2>9. External Links</h2>
                        <p>Our site may include external links to full news articles. These are clearly attributed. We are not responsible for the privacy practices of these websites.</p>

                        <h2>10. Consent</h2>
                        <p>By using our website, you consent to our privacy policy.</p>

                        <h2>11. Updates</h2>
                        <p>We may update this policy periodically. Latest update: {new Date().toLocaleDateString()}</p>

                        <h2>12. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at <strong>support@briefnewsly.org</strong>.</p>

                        <div className="closing-section">
                            <p className="closing-text">
                                If you have any questions about this Privacy Policy, please don’t hesitate to contact us at the email address above.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Privacy;
