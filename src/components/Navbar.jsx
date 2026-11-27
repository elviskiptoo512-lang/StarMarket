
import { Link, useNavigate } from "react-router-dom";
import { Bell, Heart, MessageCircle, Plus, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                    <span className="logo-star">★</span>
                    <span>StarMarket</span>
                </Link>

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

                <div className="navbar-actions">
                    {isAuthenticated ? (
                        <>
                            <Link to="/notifications" className="icon-button">
                                <Bell size={20} />
                            </Link>

                            <Link to="/profile" className="profile-button">
                                <User size={18} />
                                <span>{user?.name}</span>
                            </Link>

                            <Link to="/add-product" className="sell-button">
                                <Plus size={18} />
                                <span>Sell an Item</span>
                            </Link>

                            <button
                                onClick={handleLogout}
                                className="logout-button"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="login-button">
                                Login
                            </Link>

                            <Link to="/register" className="sell-button">
                                Register
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
