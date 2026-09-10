import { ArrowLeft, Send, User, Package } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import "./Messages.css";

function Messages() {
    const [searchParams] = useSearchParams();

    const seller = searchParams.get("seller");
    const productId = searchParams.get("product");
    return (
        <main className="messages-page">

            <div className="messages-container">

                <div className="messages-header">
                    <div>
                        <p className="messages-label">STARMARKET</p>
                        <h1>Messages</h1>
                        <p>Chat with buyers and sellers in the Daystar community.</p>
                    </div>
                </div>

                <section className="messages-layout">

                    {/* Conversations */}
                    <aside className="conversations-panel">

                        <div className="conversations-heading">
                            <h2>Conversations</h2>
                        </div>

                        <div className="empty-conversations">
                            {seller ? (
                                <>
                                    <div className="empty-icon">
                                        <User size={22} />
                                    </div>

                                    <h3>Message {seller}</h3>

                                    <p>
                                        Start a conversation about this product.
                                    </p>

                                    <div className="selected-product">
                                        <Package size={15} />
                                        Product #{productId}
                                    </div>

                                    <button className="start-chat-button">
                                        Start Conversation
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="empty-icon">
                                        <User size={22} />
                                    </div>

                                    <h3>No conversations yet</h3>

                                    <p>
                                        Your conversations with buyers and sellers
                                        will appear here.
                                    </p>

                                    <Link to="/browse">
                                        <ArrowLeft size={16} />
                                        Browse Products
                                    </Link>
                                </>
                            )}
                        </div>

                    </aside>

                    {/* Chat */}
                    <section className="chat-panel">

                        <div className="chat-empty">
                            <div className="chat-icon">
                                <Send size={24} />
                            </div>

                            <h2>Select a conversation</h2>

                            <p>
                                Choose a conversation from the left to start
                                chatting.
                            </p>
                        </div>

                    </section>

                </section>

            </div>

        </main>
    );
}

export default Messages;