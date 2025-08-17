import '../modern-theme.css';

export default function Subscribe() {
    return (
        <div className='modern-subscribe'>
            <div className='subscribe-container'>
                <div className='subscribe-content'>
                    <div className='subscribe-badge'>
                        <span>🚀 Join Our Community</span>
                    </div>
                    <h2 className='subscribe-title'>
                        Never Miss a <span className='gradient-text'>Tech Update</span>
                    </h2>
                    <p className='subscribe-description'>
                        Get curated technology news, AI breakthroughs, and startup insights delivered to your inbox weekly.
                    </p>
                    <div className='subscribe-form'>
                        <div className='email-input-container'>
                            <svg className='email-icon' width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
                                <path d="m2 7 10 6 10-6" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className='email-input'
                                aria-label="Email address"
                            />
                        </div>
                        <button className='subscribe-btn' type="submit">
                            Subscribe
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <path d="M5 12h14" stroke="currentColor" strokeWidth="2" />
                                <path d="m12 5 7 7-7 7" stroke="currentColor" strokeWidth="2" />
                            </svg>
                        </button>
                    </div>
                    <div className='subscribe-benefits'>
                        <div className='benefit-item'>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>Weekly tech digest</span>
                        </div>
                        <div className='benefit-item'>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>No spam, unsubscribe anytime</span>
                        </div>
                        <div className='benefit-item'>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2" />
                            </svg>
                            <span>Exclusive tech insights</span>
                        </div>
                    </div>
                </div>
                <div className='subscribe-visual'>
                    <div className='tech-graphics'>
                        <div className='floating-icon ai-icon'>🤖</div>
                        <div className='floating-icon cloud-icon'>☁️</div>
                        <div className='floating-icon rocket-icon'>🚀</div>
                        <div className='floating-icon chip-icon'>💻</div>
                    </div>
                </div>
            </div>
        </div>
    );
}