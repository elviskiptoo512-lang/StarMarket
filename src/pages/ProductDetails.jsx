
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Star,
} from "lucide-react";

import api from "../services/api";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showOffer, setShowOffer] = useState(false);
    const [offer, setOffer] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`/products/${id}`);
                setProduct({
                    ...response.data,
                    id: response.data._id,
                });
            } catch (err) {
                console.error("Product fetching error:", err);
                setError("Unable to load this product.");
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <main className="product-not-found">Loading product...</main>;
    }

    if (error || !product) {
        return (
            <main className="product-not-found">
                <h1>Product Not Found</h1>
                <p>{error || "Sorry, we couldn't find this product."}</p>
                <Link to="/browse">
                    <ArrowLeft size={18} />
                    Back to Browse
                </Link>
            </main>
        );
    }

    const handleSendOffer = () => {
        const amount = Number(offer);

        if (!amount || amount <= 0) {
            alert("Please enter a valid offer amount.");
            return;
        }

        navigate(
            `/messages?seller=${encodeURIComponent(product.seller)}&product=${product.id}&offer=${amount}`
        );

        setShowOffer(false);
        setOffer("");
    };

    return (
        <main className="product-details-page">
            <Link to="/browse" className="back-button">
                <ArrowLeft size={18} />
                Back to Browse
            </Link>

            <section className="product-details-container">
                <div className="product-gallery">
                    <div className="main-product-image">
                        {product.images?.length > 0 ? (
                            <img
                                src={product.images[selectedImage]}
                                alt={product.title}
                            />
                        ) : (
                            <p>No product image available</p>
                        )}

                        <button
                            className={`details-favorite ${isFavorite ? "active" : ""}`}
                            onClick={() => setIsFavorite(!isFavorite)}
                            aria-label="Add to favorites"
                        >
                            <Heart
                                size={21}
                                fill={isFavorite ? "currentColor" : "none"}
                            />
                        </button>

                        <span className={`details-status ${product.status.toLowerCase()}`}>
                            {product.status}
                        </span>
                    </div>

                    <div className="product-thumbnails">
                        {product.images?.map((image, index) => (
                            <button
                                key={index}
                                className={`thumbnail ${selectedImage === index ? "selected" : ""}`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img src={image} alt={`${product.title} ${index + 1}`} />
                            </button>
                        ))}
                    </div>
                </div>

                <div className="product-details-info">
                    <span className="details-category">{product.category}</span>

                    <h1>{product.title}</h1>

                    <div className="details-price">
                        KSh {product.price.toLocaleString()}
                    </div>

                    {product.negotiable && (
                        <span className="negotiable-badge">
                            Price negotiable
                        </span>
                    )}

                    <div className="details-meta">
                        <span>Condition: {product.condition}</span>

                        <span className="location-meta">
                            <MapPin size={14} />
                            {product.location}
                        </span>
                    </div>

                    <div className="description-section">
                        <h3>Description</h3>
                        <p>{product.description}</p>
                    </div>

                    <div className="details-actions">
                        <button
                            className="contact-button"
                            onClick={() =>
                                navigate(
                                    `/messages?seller=${encodeURIComponent(product.seller)}&product=${product.id}`
                                )
                            }
                        >
                            <MessageCircle size={18} />
                            Contact Seller
                        </button>

                        <button
                            className="offer-button"
                            onClick={() => setShowOffer(true)}
                        >
                            Make an Offer
                        </button>
                    </div>

                    <div className="seller-card">
                        <div className="seller-avatar-large">
                            {product.seller?.charAt(0) || "S"}
                        </div>

                        <div className="seller-card-info">
                            <div className="seller-name">
                                <strong>{product.seller}</strong>

                                {product.verified && (
                                    <span>
                                        <ShieldCheck size={15} />
                                        Daystar Verified
                                    </span>
                                )}
                            </div>

                            <div className="seller-rating-large">
                                <Star size={15} fill="currentColor" />
                                <strong>{product.rating ?? "New"}</strong>
                                <span>Seller rating</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {showOffer && (
                <div className="offer-overlay">
                    <div className="offer-modal">
                        <button
                            className="offer-close"
                            onClick={() => setShowOffer(false)}
                            aria-label="Close offer"
                        >
                            ×
                        </button>

                        <h2>Make an Offer</h2>
                        <p>{product.title}</p>

                        <label htmlFor="offer">Your Offer (KSh)</label>

                        <input
                            id="offer"
                            type="number"
                            placeholder={product.price}
                            value={offer}
                            onChange={(event) => setOffer(event.target.value)}
                        />

                        <button className="submit-offer" onClick={handleSendOffer}>
                            Send Offer
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}

export default ProductDetails;
