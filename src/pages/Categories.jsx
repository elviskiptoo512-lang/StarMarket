
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import "./Categories.css";

const categories = [
    "Electronics",
    "Books",
    "Fashion",
    "Furniture",
    "Other",
];

function Categories() {
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("Electronics");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get("/products");

                setProducts(
                    response.data.map((product) => ({
                        ...product,
                        id: product._id,
                    }))
                );
            } catch (err) {
                setError("Unable to load products. Please try again.");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = products.filter(
        (product) => product.category === selectedCategory
    );

    return (
        <main className="categories-page">
            <section className="categories-header">
                <p className="categories-label">STARMARKET</p>
                <h1>Explore Categories</h1>
                <p>Find exactly what you need from fellow Daystar students.</p>
            </section>

            <section className="category-tabs">
                {categories.map((category) => (
                    <button
                        key={category}
                        className={selectedCategory === category ? "active" : ""}
                        onClick={() => setSelectedCategory(category)}
                        type="button"
                    >
                        {category}
                    </button>
                ))}
            </section>

            <section className="category-products">
                <div className="category-products-header">
                    <h2>{selectedCategory}</h2>
                    <span>{filteredProducts.length} products</span>
                </div>

                {loading ? (
                    <p>Loading products...</p>
                ) : error ? (
                    <p>{error}</p>
                ) : filteredProducts.length === 0 ? (
                    <div className="category-empty">
                        <h3>No products in this category yet.</h3>
                        <p>Check another category or explore all products.</p>
                        <Link to="/browse">Browse all products</Link>
                    </div>
                ) : (
                    <div className="category-products-grid">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </main>
    );
}

export default Categories;
