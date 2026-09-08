import { Link } from "react-router-dom";
import { Bell, Heart, MessageCircle, Plus, User } from "lucide-react";
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">

                {/* Logo */}
                <Link to="/" className="navbar-logo">
                    <span className="logo-star">★</span>
                    <span>StarMarket</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="navbar-links">
                    <Link to="/">Home</Link>
                    <Link to="/browse">Browse</Link>
                    <Link to="/categories">Categories</Link>
                    <Link to="/favorites">
                        <Heart size={18} />
                        Favorites
                    </Link>
                    <Link to="/messages">
                        <MessageCircle size={18} />
                        Messages
                    </Link>
                </div>

                {/* Right Side */}
                <div className="navbar-actions">

                    <Link to="/notifications" className="icon-button">
                        <Bell size={20} />
                    </Link>

                    <Link to="/profile" className="profile-button">
                        <User size={18} />
                        <span>Profile</span>
                    </Link>

                    <Link to="/sell" className="sell-button">
                        <Plus size={18} />
                        <span>Sell an Item</span>
                    </Link>

                </div>

            </div>
        </nav>
    );
}

export default Navbar;
