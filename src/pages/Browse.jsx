import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import "./Browse.css";

function Browse() {
    return (
        <main className="browse-page">

            {/* Header */}
            <section className="browse-header">
                <div>
                    <p className="browse-label">STARMARKET</p>

                    <h1>Browse Products</h1>

                    <p>
                        Find great deals from fellow Daystar students.
                    </p>
                </div>

                <button className="filter-mobile">
                    <SlidersHorizontal size={18} />
                    Filters
                </button>
            </section>

            {/* Search */}
            <section className="browse-search-section">
                <div className="browse-search">
                    <Search size={20} />

                    <input
                        type="text"
                        placeholder="Search for products..."
                    />

                    <button>Search</button>
                </div>
            </section>

            {/* Marketplace */}
            <section className="marketplace">

                {/* Filters */}
                <aside className="filter-sidebar">

                    <div className="filter-heading">
                        <h3>Filters</h3>
                        <button>Clear all</button>
                    </div>

                    <div className="filter-group">
                        <h4>Category</h4>

                        <label>
                            <input type="checkbox" />
                            Electronics
                        </label>

                        <label>
                            <input type="checkbox" />
                            Books
                        </label>

                        <label>
                            <input type="checkbox" />
                            Fashion
                        </label>

                        <label>
                            <input type="checkbox" />
                            Furniture
                        </label>

                        <label>
                            <input type="checkbox" />
                            Other
                        </label>
                    </div>

                    <div className="filter-group">
                        <h4>Condition</h4>

                        <label>
                            <input type="checkbox" />
                            Like New
                        </label>

                        <label>
                            <input type="checkbox" />
                            Good
                        </label>

                        <label>
                            <input type="checkbox" />
                            Fair
                        </label>
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

                {/* Products */}
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

                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                product={product}
                            />
                        ))}
                    </div>
                </div>

            </section>

        </main>
    );
}

export default Browse;