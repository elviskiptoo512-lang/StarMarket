
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import "./Home.css";

function Home() {
    const [search, setSearch] = useState("");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");
                setProducts(response.data.slice(0, 4).map((product) => ({
                    ...product,
                    id: product._id,
                })));
            } catch (error) {
                console.error("Unable to load featured products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const handleSearch = (event) => {
        event.preventDefault();

        if (search.trim()) {
            navigate(`/browse?search=${encodeURIComponent(search.trim())}`);
        } else {
            navigate("/browse");
        }
    };

    return (
        <main className="home">
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

                    <form className="hero-search" onSubmit={handleSearch}>
                        <Search size={21} />
                        <input
                            type="search"
                            placeholder="Search for phones, books, clothes..."
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            aria-label="Search marketplace products"
                        />
                        <button type="submit">Search</button>
                    </form>

                    <div className="hero-actions">
                        <Link to="/browse" className="primary-button">
                            Browse Products
                            <ArrowRight size={18} />
                        </Link>

                        <Link to="/add-product" className="secondary-button">
                            + Sell an Item
                        </Link>
                    </div>

                    <div className="hero-trust">
                        <span>✓</span>
                        Exclusive to verified Daystar University students
                    </div>
                </div>
            </section>

            <section className="featured-section">
                <div className="featured-header">
                    <div>
                        <p className="featured-label">DISCOVER</p>
                        <h2>Featured Products</h2>
                        <p>Explore the latest items listed by fellow students.</p>
                    </div>

                    <Link to="/browse" className="featured-view-all">
                        View All <ArrowRight size={17} />
                    </Link>
                </div>

                {loading ? (
                    <p className="featured-message">Loading products...</p>
                ) : products.length === 0 ? (
                    <p className="featured-message">
                        No products available yet. Be the first to list an item!
                    </p>
                ) : (
                    <div className="featured-grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Home;
