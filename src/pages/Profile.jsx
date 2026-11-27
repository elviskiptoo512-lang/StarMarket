
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
    User,
    Mail,
    Phone,
    MapPin,
    Pencil,
    Save,
    X,
    Camera,
    Package,
} from "lucide-react";
import api from "../services/api";
import "./Profile.css";

function Profile() {
    const [user, setUser] = useState(null);
    const [products, setProducts] = useState([]);

    const [editingProduct, setEditingProduct] = useState(null);
    const [productForm, setProductForm] = useState({
        title: "",
        description: "",
        price: "",
        category: "",
        condition: "",
        location: "",
    });
    const [productActionError, setProductActionError] = useState("");
    const [productActionSuccess, setProductActionSuccess] = useState("");
    const [productSaving, setProductSaving] = useState(false);

    const [loading, setLoading] = useState(true);
    const [listingsLoading, setListingsLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [uploadingImage, setUploadingImage] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [imageError, setImageError] = useState("");
    const [listingsError, setListingsError] = useState("");

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        location: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await api.get("/auth/me");
                setUser(response.data.user);
            } catch (err) {
                setError(
                    err.response?.data?.message ||
                    "Unable to load your profile."
                );
            } finally {
                setLoading(false);
            }
        };

        const fetchMyListings = async () => {
            try {
                const response = await api.get("/products/mine");
                setProducts(response.data);
            } catch (err) {
                setListingsError(
                    err.response?.data?.message ||
                    "Unable to load your listings."
                );
            } finally {
                setListingsLoading(false);
            }
        };

        fetchProfile();
        fetchMyListings();
    }, []);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setImageError("Please select a valid image.");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setImageError("Image must be smaller than 5MB.");
            return;
        }

        const imageData = new FormData();
        imageData.append("image", file);

        try {
            setUploadingImage(true);
            setImageError("");

            const response = await api.post(
                "/auth/me/photo",
                imageData
            );

            setUser((prev) => ({
                ...prev,
                profileImage: response.data.profileImage,
            }));
        } catch (err) {
            setImageError(
                err.response?.data?.message ||
                "Unable to upload profile picture."
            );
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product._id);

        setProductForm({
            title: product.title || "",
            description: product.description || "",
            price: product.price || "",
            category: product.category || "",
            condition: product.condition || "",
            location: product.location || "",
        });

        setProductActionError("");
        setProductActionSuccess("");
    };

    const handleProductChange = (e) => {
        setProductForm({
            ...productForm,
            [e.target.name]: e.target.value,
        });
    };

    const handleUpdateProduct = async (e) => {
        e.preventDefault();

        try {
            setProductSaving(true);
            setProductActionError("");
            setProductActionSuccess("");

            const response = await api.put(
                `/products/${editingProduct}`,
                {
                    ...productForm,
                    price: Number(productForm.price),
                }
            );

            setProducts((prev) =>
                prev.map((product) =>
                    product._id === editingProduct
                        ? response.data
                        : product
                )
            );

            setEditingProduct(null);
            setProductActionSuccess("Product updated successfully.");
        } catch (err) {
            setProductActionError(
                err.response?.data?.message ||
                "Unable to update product."
            );
        } finally {
            setProductSaving(false);
        }
    };

    const handleMarkSold = async (productId) => {
        try {
            setProductActionError("");
            setProductActionSuccess("");

            const response = await api.put(
                `/products/${productId}`,
                { status: "Sold" }
            );

            setProducts((prev) =>
                prev.map((product) =>
                    product._id === productId
                        ? response.data
                        : product
                )
            );

            setProductActionSuccess("Product marked as sold.");
        } catch (err) {
            setProductActionError(
                err.response?.data?.message ||
                "Unable to update product status."
            );
        }
    };

    const handleDeleteProduct = async (productId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            setProductActionError("");
            setProductActionSuccess("");

            await api.delete(`/products/${productId}`);

            setProducts((prev) =>
                prev.filter((product) => product._id !== productId)
            );

            setProductActionSuccess("Product deleted successfully.");
        } catch (err) {
            setProductActionError(
                err.response?.data?.message ||
                "Unable to delete product."
            );
        }
    };

    const handleEdit = () => {
        setFormData({
            name: user.name || "",
            phone: user.phone || "",
            location: user.location || "",
        });

        setError("");
        setSuccess("");
        setEditing(true);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setSaving(true);
        setError("");
        setSuccess("");

        try {
            const response = await api.put("/auth/me", formData);

            setUser(response.data.user);
            setEditing(false);
            setSuccess("Your profile has been updated successfully.");
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update your profile."
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="profile-loading">
                Loading your profile...
            </div>
        );
    }

    if (error && !user) {
        return <div className="profile-error">{error}</div>;
    }

    if (!user) return null;

    return (
        <main className="profile-page">

            <section className="profile-header">

                <div className="profile-avatar-wrapper">
                    <div className="profile-avatar">
                        {user.profileImage ? (
                            <img src={user.profileImage} alt="Profile" />
                        ) : (
                            <User size={42} />
                        )}
                    </div>

                    <label className="change-photo-button">
                        <Camera size={16} />
                        {uploadingImage ? "Uploading..." : "Change Photo"}

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploadingImage}
                            hidden
                        />
                    </label>
                </div>

                <div className="profile-heading">
                    <h1>{user.name}</h1>
                    <p>StarMarket Student Member</p>

                    <span className="profile-role">
                        {user.role === "admin"
                            ? "Administrator"
                            : "Student"}
                    </span>
                </div>

                {!editing && (
                    <button
                        className="edit-profile-button"
                        onClick={handleEdit}
                    >
                        <Pencil size={16} />
                        Edit Profile
                    </button>
                )}

            </section>

            {imageError && (
                <div className="profile-error">{imageError}</div>
            )}

            {error && (
                <div className="profile-error">{error}</div>
            )}

            {success && (
                <div className="profile-success">{success}</div>
            )}

            {editing ? (
                <section className="profile-details">
                    <h2>Edit Personal Information</h2>

                    <form onSubmit={handleSave} className="profile-form">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                        <label>Phone Number</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter your phone number"
                        />

                        <label>Campus Location</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="e.g. Athi River Campus"
                        />

                        <div className="profile-form-actions">
                            <button
                                type="submit"
                                className="save-profile-button"
                                disabled={saving}
                            >
                                <Save size={17} />
                                {saving ? "Saving..." : "Save Changes"}
                            </button>

                            <button
                                type="button"
                                className="cancel-profile-button"
                                onClick={() => {
                                    setEditing(false);
                                    setError("");
                                }}
                                disabled={saving}
                            >
                                <X size={17} />
                                Cancel
                            </button>
                        </div>
                    </form>
                </section>
            ) : (
                <section className="profile-details">
                    <h2>Personal Information</h2>

                    <div className="profile-detail">
                        <Mail size={20} />
                        <div>
                            <span>Email Address</span>
                            <p>{user.email}</p>
                        </div>
                    </div>

                    <div className="profile-detail">
                        <Phone size={20} />
                        <div>
                            <span>Phone Number</span>
                            <p>{user.phone || "Not added yet"}</p>
                        </div>
                    </div>

                    <div className="profile-detail">
                        <MapPin size={20} />
                        <div>
                            <span>Campus Location</span>
                            <p>{user.location || "Not added yet"}</p>
                        </div>
                    </div>
                </section>
            )}

            {/* My Listings */}
            <section className="my-listings-section">
                <div className="my-listings-header">
                    {productActionError && (
                        <p className="listings-error">{productActionError}</p>
                    )}

                    {productActionSuccess && (
                        <p className="profile-success">{productActionSuccess}</p>
                    )}
                    <div>
                        <h2>My Listings</h2>
                        <p>Manage products you have posted on StarMarket.</p>
                    </div>

                    <span className="listings-count">
                        {products.length} Products
                    </span>
                </div>

                {listingsLoading ? (
                    <p className="listings-message">
                        Loading your listings...
                    </p>
                ) : listingsError ? (
                    <p className="listings-error">{listingsError}</p>
                ) : products.length === 0 ? (
                    <div className="empty-listings">
                        <Package size={42} />
                        <h3>No listings yet</h3>
                        <p>You haven't posted any products yet.</p>
                        <Link to="/add-product">
                            List Your First Product
                        </Link>
                    </div>
                ) : (
                    <div className="my-listings-grid">
                        {products.map((product) => (
                            <article
                                className="my-listing-card"
                                key={product._id}
                            >
                                <Link
                                    to={`/product/${product._id}`}
                                    className="my-listing-image"
                                >
                                    {product.images?.length > 0 ? (
                                        <img
                                            src={product.images[0]}
                                            alt={product.title}
                                        />
                                    ) : (
                                        <div className="listing-no-image">
                                            <Package size={35} />
                                        </div>
                                    )}
                                </Link>

                                <div className="my-listing-info">

                                    {editingProduct === product._id && (
                                        <form
                                            className="edit-listing-form"
                                            onSubmit={handleUpdateProduct}
                                        >
                                            <h3>Edit Product</h3>

                                            <input
                                                name="title"
                                                value={productForm.title}
                                                onChange={handleProductChange}
                                                placeholder="Product title"
                                                required
                                            />

                                            <textarea
                                                name="description"
                                                value={productForm.description}
                                                onChange={handleProductChange}
                                                placeholder="Description"
                                                required
                                            />

                                            <input
                                                type="number"
                                                name="price"
                                                value={productForm.price}
                                                onChange={handleProductChange}
                                                placeholder="Price"
                                                min="0"
                                                required
                                            />

                                            <input
                                                name="category"
                                                value={productForm.category}
                                                onChange={handleProductChange}
                                                placeholder="Category"
                                                required
                                            />

                                            <select
                                                name="condition"
                                                value={productForm.condition}
                                                onChange={handleProductChange}
                                                required
                                            >
                                                <option value="">Select condition</option>
                                                <option value="New">New</option>
                                                <option value="Like New">Like New</option>
                                                <option value="Good">Good</option>
                                                <option value="Fair">Fair</option>
                                            </select>

                                            <input
                                                name="location"
                                                value={productForm.location}
                                                onChange={handleProductChange}
                                                placeholder="Location"
                                                required
                                            />

                                            <div className="edit-listing-actions">
                                                <button type="submit" disabled={productSaving}>
                                                    {productSaving ? "Saving..." : "Save Changes"}
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setEditingProduct(null)}
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </form>
                                    )}

                                    <span className="listing-category">
                                        {product.category}
                                    </span>

                                    <h3>{product.title}</h3>

                                    <strong>
                                        KSh {Number(product.price).toLocaleString("en-KE")}
                                    </strong>

                                    <span
                                        className={`listing-status ${product.status?.toLowerCase()}`}
                                    >
                                        {product.status}
                                    </span>

                                    <div className="listing-actions">
                                        <Link
                                            to={`/product/${product._id}`}
                                            className="view-listing-link"
                                        >
                                            View Product
                                        </Link>

                                        <button
                                            className="edit-listing-button"
                                            onClick={() => handleEditProduct(product)}
                                        >
                                            <Pencil size={15} />
                                            Edit
                                        </button>

                                        {product.status !== "Sold" && (
                                            <button
                                                className="sold-listing-button"
                                                onClick={() => handleMarkSold(product._id)}
                                            >
                                                Mark as Sold
                                            </button>
                                        )}

                                        <button
                                            className="delete-listing-button"
                                            onClick={() => handleDeleteProduct(product._id)}
                                        >
                                            <X size={15} />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

        </main>
    );
}

export default Profile;
