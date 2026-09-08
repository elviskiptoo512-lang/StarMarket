import { Link } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import "./Home.css";

function Home() {
    return (
        <main className="home">

            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">

                    <div className="hero-badge">
                        <span>★</span>
                        Daystar University Student Marketplace
                    </div>

                    <h1>
                        Buy & Sell Within
                        <span> the Daystar Community</span>
                    </h1>

                    <p>
                        Find great deals from fellow Daystar students.
                        Buy, sell, negotiate, and connect with your campus community.
                    </p>

                    {/* Search */}
                    <div className="hero-search">
                        <Search size={21} />

                        <input
                            type="text"
                            placeholder="Search for phones, books, clothes..."
                        />

                        <button type="button">
                            Search
                        </button>
                    </div>

                    {/* Hero Buttons */}
                    <div className="hero-actions">

                        <Link to="/browse" className="primary-button">
                            Browse Products
                            <ArrowRight size={18} />
                        </Link>

                        <Link to="/sell" className="secondary-button">
                            + Sell an Item
                        </Link>

                    </div>

                    {/* Trust Message */}
                    <div className="hero-trust">
                        <span>✓</span>
                        Exclusive to verified Daystar University students
                    </div>

                </div>
            </section>

        </main>
    );
}

export default Home;

