
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Movies.css';

const Watchlist = () => {
    const { user, logout } = useContext(AuthContext);
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchWatchlist = async () => {
        try {
            const res = await axios.get('/watchlist');
            // structure is: { status: 'Success', results: N, data: { watchlist: [...] } }
            setWatchlist(res.data.data.watchlist);
        } catch (error) {
            console.error("Error fetching watchlist:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (id) => {
        if (!confirm("Are you sure you want to remove this from your watchlist?")) return;
        try {
            await axios.delete(`/watchlist/${id}`);
            // Optimistically remove from state
            setWatchlist(prev => prev.filter(item => item.id !== id));
        } catch (error) {
            console.error(error);
            alert("Failed to remove item");
        }
    };

    const handleLogout = () => {
        logout();
    };

    useEffect(() => {
        fetchWatchlist();
    }, []);

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETED': return 'var(--success-color)';
            case 'WATCHING': return 'var(--accent-color)';
            case 'DROPPED': return 'var(--error-color)';
            default: return 'var(--text-secondary)';
        }
    };

    return (
        <div>
            {/* Header/Nav (Repeated for now, could be a component) */}
            <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', padding: '20px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>MovieLisst</h1>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Link to="/" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'var(--text-primary)', border: 'none' }}>Discover</Link>
                        <Link to="/watchlist" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--accent-color)' }}>My Watchlist</Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '40px 20px' }}>
                <h2 style={{ marginBottom: '30px' }}>Your Watchlist</h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
                ) : watchlist.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '50px', color: 'var(--text-secondary)' }}>
                        <p>Your watchlist is empty.</p>
                        <Link to="/" style={{ color: 'var(--accent-color)', marginTop: '10px', display: 'inline-block' }}>Go find some movies!</Link>
                    </div>
                ) : (
                    <div className="movie-grid">
                        {watchlist.map(item => (
                            <div key={item.id} className="movie-card">
                                <img
                                    src={item.movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Poster"}
                                    alt={item.movie.title}
                                    className="movie-poster"
                                />
                                <div className="movie-content">
                                    <h3 className="movie-title">{item.movie.title}</h3>

                                    <div style={{ margin: '10px 0', fontSize: '0.9rem' }}>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: 'rgba(255,255,255,0.1)',
                                            color: getStatusColor(item.status),
                                            fontWeight: 'bold',
                                            marginRight: '10px'
                                        }}>
                                            {item.status}
                                        </span>
                                        {item.rating && <span style={{ color: '#fbbf24' }}>★ {item.rating}/10</span>}
                                    </div>

                                    <div className="movie-meta">
                                        <span>Added: {new Date(item.createdAt).toLocaleDateString()}</span>
                                    </div>

                                    <div className="movie-actions">
                                        <button
                                            className="btn btn-secondary"
                                            style={{ width: '100%', fontSize: '0.9rem', borderColor: 'var(--error-color)', color: 'var(--error-color)' }}
                                            onClick={() => handleRemove(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Watchlist;
