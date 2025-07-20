import React from 'react';
import { Helmet } from 'react-helmet-async';
import '../index.css';

function Contact() {
    return (
        <>
            <Helmet>
                <title>Contact Us - Daily Brief Newsly</title>
                <meta name="description" content="Get in touch with Daily Brief Newsly team. We value your feedback, partnership opportunities, and inquiries." />
                <meta name="keywords" content="contact us, daily brief newsly, support, partnership, feedback" />
            </Helmet>

            <div className="page-container">
                <div className="page-hero">
                    <h1 className="page-title">Contact Us</h1>
                    <p className="page-subtitle">We value your feedback, partnership opportunities, and inquiries</p>
                </div>

                <div className="content-card">
                    <div className="card-header">
                        <h2>Get in Touch</h2>
                    </div>

                    <div className="card-content">
                        <div className="contact-grid">
                            <div className="contact-item">
                                <div className="contact-icon email-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="contact-content">
                                    <h3>Email</h3>
                                    <p>support@briefnewsly.org</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon address-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M21 10C21 17 12 23 12 23S3 17 3 10C3 5.03 7.03 1 12 1S21 5.03 21 10Z" stroke="currentColor" strokeWidth="2" />
                                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                </div>
                                <div className="contact-content">
                                    <h3>Address</h3>
                                    <p>BriefNewsly Media<br />A-201, Digital Hub Lane<br />New Delhi, India</p>
                                </div>
                            </div>

                            <div className="contact-item">
                                <div className="contact-icon time-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                                        <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                                <div className="contact-content">
                                    <h3>Working Hours</h3>
                                    <p>Monday - Friday<br />10:00 AM - 6:00 PM IST</p>
                                </div>
                            </div>
                        </div>

                        <div className="publisher-notice">
                            <div className="notice-header">
                                <h3>For Publishers</h3>
                            </div>
                            <p>
                                If you are a publisher and believe your content is being used improperly
                                or you'd like to collaborate, please contact us immediately.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Contact;
