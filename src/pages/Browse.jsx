
import { useEffect, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import "./Browse.css";

function Browse() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");

                const formattedProducts = response.data.map((product) => ({
                    ...product,
                    id: product._id,
                }));

                setProducts(formattedProducts);
            } catch (err) {
                setError("Unable to load products. Please try again.");
                console.error("Product fetching error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="browse-page">
            <section className="browse-header">
                <div>
                    <p className="browse-label">STARMARKET</p>
                    <h1>Browse Products</h1>
                    <p>Find great deals from fellow Daystar students.</p>
                </div>

                <button className="filter-mobile">
                    <SlidersHorizontal size={18} />
                    Filters
                </button>
            </section>

            <section className="browse-search-section">
                <div className="browse-search">
                    <Search size={20} />
                    <input type="text" placeholder="Search for products..." />
                    <button>Search</button>
                </div>
            </section>

            <section className="marketplace">
                <aside className="filter-sidebar">
                    <div className="filter-heading">
                        <h3>Filters</h3>
                        <button>Clear all</button>
                    </div>

                    <div className="filter-group">
                        <h4>Category</h4>
                        {["Electronics", "Books", "Fashion", "Furniture", "Other"].map(
                            (category) => (
                                <label key={category}>
                                    <input type="checkbox" />
                                    {category}
                                </label>
                            )
                        )}
                    </div>

                    <div className="filter-group">
                        <h4>Condition</h4>
                        {["Like New", "Good", "Fair"].map((condition) => (
                            <label key={condition}>
                                <input type="checkbox" />
                                {condition}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h4>Price</h4>
                        <div className="price-inputs">
                            <input type="number" placeholder="Min" />
                            <span>—</span>
                            <input type="number" placeholder="Max" />
                        </div>
                    </div>
                </aside>

                <div className="products-section">
                    <div className="products-topbar">
                        <p>
                            <strong>{products.length}</strong> products found
                        </p>

                        <select>
                            <option>Newest first</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading products...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : products.length === 0 ? (
                        <p>No products available yet.</p>
                    ) : (
                        <div className="products-grid">
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </main>
    );
}

export default Browse;
