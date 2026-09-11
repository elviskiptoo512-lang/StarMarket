
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    Heart,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Star,
} from "lucide-react";

import products from "../data/products";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [showOffer, setShowOffer] = useState(false);
    const [offer, setOffer] = useState("");

    const product = products.find(
        (item) => item.id === Number(id)
    );

    if (!product) {
        return (
            <main className="product-not-found">
                <h1>Product Not Found</h1>

                <p>
                    Sorry, we couldn't find the product you're looking for.
                </p>

                <Link to="/browse">
                    <ArrowLeft size={18} />
                    Back to Browse
                </Link>
            </main>
        );
    }

    const handleSendOffer = () => {
        if (!offer) return;

        alert(
            `Offer of KSh ${Number(offer).toLocaleString()} sent to ${product.seller}`
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

                {/* Product Gallery */}
                <div className="product-gallery">

                    <div className="main-product-image">

                        <img
                            src={product.images[selectedImage]}
                            alt={product.title}
                        />

                        <button
                            className={`details-favorite ${isFavorite ? "active" : ""
                                }`}
                            onClick={() => setIsFavorite(!isFavorite)}
                            aria-label="Add to favorites"
                        >
                            <Heart
                                size={21}
                                fill={isFavorite ? "currentColor" : "none"}
                            />
                        </button>

                        <span
                            className={`details-status ${product.status.toLowerCase()}`}
                        >
                            {product.status}
                        </span>

                    </div>

                    <div className="product-thumbnails">

                        {product.images.map((image, index) => (
                            <button
                                key={index}
                                className={`thumbnail ${selectedImage === index ? "selected" : ""
                                    }`}
                                onClick={() => setSelectedImage(index)}
                            >
                                <img
                                    src={image}
                                    alt={`${product.title} ${index + 1}`}
                                />
                            </button>
                        ))}

                    </div>

                </div>

                {/* Product Information */}
                <div className="product-details-info">

                    <span className="details-category">
                        {product.category}
                    </span>

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

                        <span>
                            Condition: {product.condition}
                        </span>

                        <span className="location-meta">
                            <MapPin size={14} />
                            {product.location}
                        </span>

                    </div>

                    <div className="description-section">

                        <h3>Description</h3>

                        <p>{product.description}</p>

                    </div>

                    {/* Actions */}
                    <div className="details-actions">

                        <button
                            className="contact-button"
                            onClick={() =>
                                navigate(
                                    `/messages?seller=${encodeURIComponent(
                                        product.seller
                                    )}&product=${product.id}`
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

                    {/* Seller */}
                    <div className="seller-card">

                        <div className="seller-avatar-large">
                            {product.seller.charAt(0)}
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

                                <Star
                                    size={15}
                                    fill="currentColor"
                                />

                                <strong>{product.rating}</strong>

                                <span>Seller rating</span>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* Make Offer Modal */}
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

                        <label htmlFor="offer">
                            Your Offer (KSh)
                        </label>

                        <input
                            id="offer"
                            type="number"
                            placeholder={product.price}
                            value={offer}
                            onChange={(event) =>
                                setOffer(event.target.value)
                            }
                        />

                        <button
                            className="submit-offer"
                            onClick={handleSendOffer}
                        >
                            Send Offer
                        </button>

                    </div>

                </div>
            )}

        </main>
    );
}

export default ProductDetails;
