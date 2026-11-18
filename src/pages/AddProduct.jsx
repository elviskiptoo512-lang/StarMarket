
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AddProduct.css";

function AddProduct() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        location: "",
        seller: "",
        image: "",
        negotiable: false,
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;

        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            await api.post("/products", {
                ...formData,
                price: Number(formData.price),
                images: formData.image ? [formData.image] : [],
            });

            alert("Product listed successfully!");
            navigate("/browse");
        } catch (error) {
            console.error("Product creation error:", error);
            alert(error.response?.data?.message || "Unable to list product.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="add-product-page">
            <div className="add-product-container">
                <h1>List a Product</h1>
                <p>Sell your items to fellow Daystar students.</p>

                <form onSubmit={handleSubmit}>
                    <label>Product Title</label>
                    <input
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. HP Laptop"
                        required
                    />

                    <label>Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe your product..."
                        required
                    />

                    <label>Price (KSh)</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        min="0"
                        required
                    />

                    <label>Category</label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select category</option>
                        <option>Electronics</option>
                        <option>Books</option>
                        <option>Fashion</option>
                        <option>Furniture</option>
                        <option>Other</option>
                    </select>

                    <label>Condition</label>
                    <select
                        name="condition"
                        value={formData.condition}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select condition</option>
                        <option>New</option>
                        <option>Like New</option>
                        <option>Good</option>
                        <option>Fair</option>
                    </select>

                    <label>Location</label>
                    <input
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        placeholder="e.g. Athi River Campus"
                        required
                    />

                    <label>Seller Name</label>
                    <input
                        name="seller"
                        value={formData.seller}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                    />

                    <label>Product Image URL</label>
                    <input
                        type="url"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://example.com/image.jpg"
                    />

                    <label className="negotiable-option">
                        <input
                            type="checkbox"
                            name="negotiable"
                            checked={formData.negotiable}
                            onChange={handleChange}
                        />
                        Price is negotiable
                    </label>

                    <button type="submit" disabled={loading}>
                        {loading ? "Publishing..." : "Publish Product"}
                    </button>
                </form>
            </div>
        </main>
    );
}

export default AddProduct;
