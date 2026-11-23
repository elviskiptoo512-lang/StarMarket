
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import api from "../services/api";
import "./Browse.css";

function Browse() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [searchParams, setSearchParams] = useSearchParams();

    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sort, setSort] = useState("newest");

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

    const toggleFilter = (value, selected, setSelected) => {
        setSelected(
            selected.includes(value)
                ? selected.filter((item) => item !== value)
                : [...selected, value]
        );
    };

    const clearFilters = () => {
        setSearch("");
        setSearchParams({});
        setSelectedCategories([]);
        setSelectedConditions([]);
        setMinPrice("");
        setMaxPrice("");
        setSort("newest");
    };

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (search.trim()) {
            const query = search.toLowerCase().trim();

            result = result.filter((product) =>
                `${product.title} ${product.description} ${product.category}`
                    .toLowerCase()
                    .includes(query)
            );
        }

        if (selectedCategories.length > 0) {
            result = result.filter((product) =>
                selectedCategories.includes(product.category)
            );
        }

        if (selectedConditions.length > 0) {
            result = result.filter((product) =>
                selectedConditions.includes(product.condition)
            );
        }

        if (minPrice !== "") {
            result = result.filter(
                (product) => Number(product.price) >= Number(minPrice)
            );
        }

        if (maxPrice !== "") {
            result = result.filter(
                (product) => Number(product.price) <= Number(maxPrice)
            );
        }

        if (sort === "low") {
            result.sort((a, b) => a.price - b.price);
        } else if (sort === "high") {
            result.sort((a, b) => b.price - a.price);
        } else {
            result.sort(
                (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
            );
        }

        return result;
    }, [
        products,
        search,
        selectedCategories,
        selectedConditions,
        minPrice,
        maxPrice,
        sort,
    ]);

    const handleSearch = (event) => {
        event.preventDefault();

        if (search.trim()) {
            setSearchParams({ search: search.trim() });
        } else {
            setSearchParams({});
        }
    };

    return (
        <main className="browse-page">
            <section className="browse-header">
                <div>
                    <p className="browse-label">STARMARKET</p>
                    <h1>Browse Products</h1>
                    <p>Find great deals from fellow Daystar students.</p>
                </div>

                <button className="filter-mobile" type="button">
                    <SlidersHorizontal size={18} />
                    Filters
                </button>
            </section>

            <section className="browse-search-section">
                <form className="browse-search" onSubmit={handleSearch}>
                    <Search size={20} />
                    <input
                        type="search"
                        placeholder="Search for products..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                    />
                    <button type="submit">Search</button>
                </form>
            </section>

            <section className="marketplace">
                <aside className="filter-sidebar">
                    <div className="filter-heading">
                        <h3>Filters</h3>
                        <button type="button" onClick={clearFilters}>
                            Clear all
                        </button>
                    </div>

                    <div className="filter-group">
                        <h4>Category</h4>
                        {["Electronics", "Books", "Fashion", "Furniture", "Other"].map(
                            (category) => (
                                <label key={category}>
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.includes(category)}
                                        onChange={() =>
                                            toggleFilter(
                                                category,
                                                selectedCategories,
                                                setSelectedCategories
                                            )
                                        }
                                    />
                                    {category}
                                </label>
                            )
                        )}
                    </div>

                    <div className="filter-group">
                        <h4>Condition</h4>
                        {["New", "Like New", "Good", "Fair"].map((condition) => (
                            <label key={condition}>
                                <input
                                    type="checkbox"
                                    checked={selectedConditions.includes(condition)}
                                    onChange={() =>
                                        toggleFilter(
                                            condition,
                                            selectedConditions,
                                            setSelectedConditions
                                        )
                                    }
                                />
                                {condition}
                            </label>
                        ))}
                    </div>

                    <div className="filter-group">
                        <h4>Price (KES)</h4>
                        <div className="price-inputs">
                            <input
                                type="number"
                                min="0"
                                placeholder="Min"
                                value={minPrice}
                                onChange={(event) => setMinPrice(event.target.value)}
                            />
                            <span>—</span>
                            <input
                                type="number"
                                min="0"
                                placeholder="Max"
                                value={maxPrice}
                                onChange={(event) => setMaxPrice(event.target.value)}
                            />
                        </div>
                    </div>
                </aside>

                <div className="products-section">
                    <div className="products-topbar">
                        <p>
                            <strong>{loading ? 0 : filteredProducts.length}</strong>{" "}
                            products found
                        </p>

                        <select
                            value={sort}
                            onChange={(event) => setSort(event.target.value)}
                        >
                            <option value="newest">Newest first</option>
                            <option value="low">Price: Low to High</option>
                            <option value="high">Price: High to Low</option>
                        </select>
                    </div>

                    {loading ? (
                        <p>Loading products...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : filteredProducts.length === 0 ? (
                        <p>No matching products found.</p>
                    ) : (
                        <div className="products-grid">
                            {filteredProducts.map((product) => (
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
