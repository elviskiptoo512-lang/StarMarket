import { ArrowLeft, Send, User } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import products from "../data/products";
import "./Messages.css";
import { useState } from "react";

function Messages() {
    const [searchParams] = useSearchParams();
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const seller = searchParams.get("seller");
    const productId = searchParams.get("product");

    const product = products.find(
        (item) => item.id === Number(productId)
    );
    const sendMessage = () => {
        if (!message.trim()) return;

        setMessages((current) => [...current, message.trim()]);
        setMessage("");
    };

    return (
        <main className="messages-page">
            <div className="messages-container">

                <div className="messages-header">
                    <p className="messages-label">STARMARKET</p>
                    <h1>Messages</h1>
                    <p>Chat with buyers and sellers in the Daystar community.</p>
                </div>

                <section className="messages-layout">

                    <aside className="conversations-panel">
                        <div className="conversations-heading">
                            <h2>Conversations</h2>
                        </div>

                        {seller && product ? (
                            <div className="conversation-item active">
                                <div className="conversation-avatar">
                                    {seller.charAt(0)}
                                </div>

                                <div>
                                    <strong>{seller}</strong>
                                    <span>{product.title}</span>
                                </div>
                            </div>
                        ) : (
                            <div className="empty-conversations">
                                <User size={22} />
                                <h3>No conversations yet</h3>
                                <Link to="/browse">Browse Products</Link>
                            </div>
                        )}
                    </aside>

                    <section className="chat-panel">

                        {seller && product ? (
                            <>
                                <div className="chat-header">
                                    <div className="conversation-avatar">
                                        {seller.charAt(0)}
                                    </div>

                                    <div>
                                        <strong>{seller}</strong>
                                        <span>Daystar Verified Seller</span>
                                    </div>
                                </div>

                                <div className="chat-product">
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                    />

                                    <div>
                                        <strong>{product.title}</strong>
                                        <span>
                                            KSh {product.price.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="chat-messages">
                                    {messages.map((item, index) => (
                                        <div key={index} className="message-bubble buyer-message">
                                            {item}
                                        </div>
                                    ))}
                                </div>


                                <div className="message-input-area">
                                    <input
                                        type="text"
                                        placeholder="Write a message..."
                                        value={message}
                                        onChange={(event) => setMessage(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                sendMessage();
                                            }
                                        }}
                                    />

                                    <button onClick={sendMessage}>
                                        <Send size={18} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="chat-empty">
                                <h2>Select a conversation</h2>
                                <p>Choose a conversation to start chatting.</p>
                            </div>
                        )}

                    </section>

                </section>
            </div>
        </main >
    );
}

export default Messages;