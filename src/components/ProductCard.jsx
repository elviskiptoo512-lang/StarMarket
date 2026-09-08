import { Heart, MapPin, Star } from "lucide-react";
import "./ProductCard.css";

function ProductCard({ product }) {
    return (
        <article className="product-card">

            {/* Product Image */}
            <div className="product-image-container">
                <img
                    src={product.image}
                    alt={product.title}
                    className="product-image"
                />

                <button
                    className="favorite-button"
                    aria-label="Add to favorites"
                >
                    <Heart size={18} />
                </button>

                <span className={`status-badge ${product.status.toLowerCase()}`}>
                    {product.status}
                </span>
            </div>

            {/* Product Information */}
            <div className="product-info">

                <div className="product-category">
                    {product.category}
                </div>

                <h3 className="product-title">
                    {product.title}
                </h3>

                <div className="product-price">
                    KSh {product.price.toLocaleString()}
                </div>

                <div className="product-details">

                    <span className="product-condition">
                        {product.condition}
                    </span>

                    <span className="product-location">
                        <MapPin size={14} />
                        {product.location}
                    </span>

                </div>

                {/* Seller */}
                <div className="product-seller">

                    <div className="seller-avatar">
                        {product.seller.charAt(0)}
                    </div>

                    <div className="seller-info">
                        <span>{product.seller}</span>

                        <div className="seller-rating">
                            <Star size={13} fill="currentColor" />
                            {product.rating}
                        </div>
                    </div>

                    {product.verified && (
                        <span className="verified-badge">
                            ✓ Verified
                        </span>
                    )}

                </div>

            </div>

        </article>
    );
}

export default ProductCard;