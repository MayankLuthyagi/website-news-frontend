import TrendingNews from "../components/ShowTrendingNews";
import NewsDifferentType from "../components/NewsDifferentType";
import NewsTicker from "../components/NewsTicker";
import { Helmet } from 'react-helmet-async';
import ShowTodayNews from "../components/ShowTodayNews";

export default function Home() {
    return (
        <>
            <Helmet>
                <title>Tech Brief Daily - Your Daily Dose of Technology News</title>
                <meta name="description" content="Stay informed with the latest technology news, AI developments, startup updates, and tech innovations. Your trusted source for curated tech content." />
                <meta name="keywords" content="tech news, technology, AI news, startup news, software development, tech innovations, programming, gadgets" />
            </Helmet>

            <div className="modern-home-container">
                {/* Hero Brand Section */}
                <section className="brand-header">
                    <div className="brand-container">
                        <h1 className="main-brand-title">
                            <span className="main-heading">Briefli News</span>
                        </h1>
                    </div>
                </section>

                {/* Dynamic Headline Ticker */}
                <NewsTicker />

                {/* Main Grid Layout */}
                <main className="news-grid-layout">
                    <div className="grid-container">
                        {/* Left Column - Featured News */}
                        <section className="grid-column main-column">
                            <TrendingNews/>
                        </section>

                        {/* Right Column - Category Sections */}
                        <aside className="grid-column sidebar-column">
                            {/* AI News Section */}
                            <section className="category-section ai-section">
                                <div className="category-content">
                                    <ShowTodayNews  />
                                </div>
                            </section>

                        </aside>
                    </div>
                </main>

                {/* Categories Grid Section */}
                <section className="categories-grid-section">
                    <NewsDifferentType />
                </section>
            </div>
        </>
    );
}