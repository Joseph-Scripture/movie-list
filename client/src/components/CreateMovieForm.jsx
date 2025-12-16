
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Movies.css';

const CreateMovieForm = ({ onClose, onMovieCreated }) => {
    const [formData, setFormData] = useState({
        title: '',
        director: '',
        releaseyear: new Date().getFullYear(),
        posterUrl: '',
        runtime: '',
        genres: '',
        overview: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Transform genres string "Action, Comedy" -> ["Action", "Comedy"]
            const genresArray = formData.genres.split(',').map(g => g.trim()).filter(Boolean);

            const payload = {
                ...formData,
                genres: genresArray.length ? genresArray : undefined,
                runtime: formData.runtime ? parseInt(formData.runtime) : undefined,
                releaseyear: parseInt(formData.releaseyear),
                posterUrl: formData.posterUrl || undefined
            };

            await axios.post('/movies', payload);
            onMovieCreated();
            onClose();
        } catch (err) {
            console.error(err);
            // Handle array of errors from Zod if present, or generic
            const msg = err.response?.data?.message || err.response?.data?.error || "Failed to create movie";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Add New Movie</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>

                {error && <div className="error-msg">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">Title</label>
                            <input
                                className="form-input"
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Director</label>
                            <input
                                className="form-input"
                                value={formData.director}
                                onChange={e => setFormData({ ...formData, director: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div className="form-group">
                            <label className="form-label">Release Year</label>
                            <input
                                className="form-input"
                                type="number"
                                value={formData.releaseyear}
                                onChange={e => setFormData({ ...formData, releaseyear: e.target.value })}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Runtime (min)</label>
                            <input
                                className="form-input"
                                type="number"
                                value={formData.runtime}
                                onChange={e => setFormData({ ...formData, runtime: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Poster URL (Optional)</label>
                        <input
                            className="form-input"
                            value={formData.posterUrl}
                            onChange={e => setFormData({ ...formData, posterUrl: e.target.value })}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Genres (comma separated)</label>
                        <input
                            className="form-input"
                            value={formData.genres}
                            onChange={e => setFormData({ ...formData, genres: e.target.value })}
                            placeholder="Action, Sci-Fi, Drama"
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Overview</label>
                        <textarea
                            className="form-input"
                            rows="4"
                            value={formData.overview}
                            onChange={e => setFormData({ ...formData, overview: e.target.value })}
                        ></textarea>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="btn" disabled={loading}>
                            {loading ? 'Creatng...' : 'Create Movie'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateMovieForm;
