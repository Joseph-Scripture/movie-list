
import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import CreateMovieForm from '../components/CreateMovieForm';
import AuthContext from '../context/AuthContext';
import { Link } from 'react-router-dom';
import '../styles/Movies.css';

const Home = () => {
    const { user, logout } = useContext(AuthContext);
    const [movies, setMovies] = useState([]);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState(null); // { message: string, type: 'success' | 'error' }

    const fetchMovies = async () => {
        try {
            const res = await axios.get('/movies');
            setMovies(res.data.data.movies);
        } catch (error) {
            console.error("Error fetching movies:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddToWatchlist = async (movieId) => {
        try {
            await axios.post('/watchlist', {
                movieId: movieId,
                status: 'PLANNED'
            });
            showToast("Movie added to watchlist!", "success");
        } catch (error) {
            const msg = error.response?.data?.error || "Failed to add to watchlist";
            showToast(msg, "error");
        }
    };

    const showToast = (message, type) => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    const handleLogout = () => {
        logout();
    };

    return (
        <div>
            {/* Header/Nav */}
            <header style={{ borderBottom: '1px solid var(--border-color)', backgroundColor: 'var(--card-bg)', padding: '20px 0' }}>
                <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link to="/" style={{ textDecoration: 'none' }}>
                        <h1 style={{ color: 'var(--accent-color)', fontSize: '1.5rem' }}>MovieLisst</h1>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <Link to="/" className="btn" style={{ padding: '8px 16px', fontSize: '0.9rem', backgroundColor: 'var(--card-bg)', border: '1px solid var(--accent-color)' }}>Discover</Link>
                        <Link to="/watchlist" className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem', color: 'var(--text-primary)', border: 'none' }}>My Watchlist</Link>
                        <button onClick={handleLogout} className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>Logout</button>
                    </div>
                </div>
            </header>

            <main className="container" style={{ padding: '40px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                    <h2>Discover Movies</h2>
                    <button className="btn" onClick={() => setShowCreateModal(true)}>
                        + Add Movie
                    </button>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>
                ) : (
                    <div className="movie-grid">
                        {movies.map(movie => (
                            <div key={movie.id} className="movie-card">
                                <img
                                    src={movie.posterUrl || "https://via.placeholder.com/300x450?text=No+Poster"}
                                    alt={movie.title}
                                    className="movie-poster"
                                />
                                <div className="movie-content">
                                    <h3 className="movie-title">{movie.title}</h3>
                                    <div className="movie-meta">
                                        <span>{movie.releaseyear}</span>
                                        <span>{movie.runtime ? `${movie.runtime} min` : ''}</span>
                                    </div>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '10px' }}>
                                        {movie.genres.slice(0, 3).map((g, i) => (
                                            <span key={i} className="badge">{g}</span>
                                        ))}
                                    </div>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                        {movie.overview || "No description available."}
                                    </p>

                                    {/* Add to Watchlist Action */}
                                    <div className="movie-actions">
                                        <button
                                            className="btn btn-liquid"
                                            style={{ width: '100%', fontSize: '0.9rem' }}
                                            onClick={() => handleAddToWatchlist(movie.id)}
                                        >
                                            Add to Watchlist
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Toast Notification */}
            {toast && (
                <div style={{
                    position: 'fixed',
                    bottom: '30px',
                    right: '30px',
                    backgroundColor: toast.type === 'error' ? 'var(--error-color)' : 'var(--success-color)',
                    color: 'white',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    zIndex: 2000,
                    animation: 'fadeIn 0.3s ease-out'
                }}>
                    {toast.message}
                </div>
            )}

            {showCreateModal && (
                <CreateMovieForm
                    onClose={() => setShowCreateModal(false)}
                    onMovieCreated={fetchMovies}
                />
            )}
        </div>
    );
};

export default Home;
