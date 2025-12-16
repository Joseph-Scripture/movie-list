
import { prisma } from '../config/db.js';

// Create a new movie
const createMovie = async (req, res) => {
    try {
        const { title, overview, genres, runtime, posterUrl, director, releaseyear } = req.body;
        const userId = req.user.id; 

        const movie = await prisma.movie.create({
            data: {
                title,
                overview,
                genres: genres || [],
                runtime,
                posterUrl,
                director,
                releaseyear,
                createdBy: userId
            }
        });

        return res.status(201).json({
            status: 'Success',
            data: { movie }
        });
    } catch (error) {
        console.error("Error in createMovie:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get all movies
const getAllMovies = async (req, res) => {
    try {

        const movies = await prisma.movie.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                creator: {
                    select: { name: true, email: true }
                }
            }
        });

        return res.status(200).json({
            status: 'Success',
            results: movies.length,
            data: { movies }
        });
    } catch (error) {
        console.error("Error in getAllMovies:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get single movie by ID
const getMovieById = async (req, res) => {
    try {
        const { id } = req.params;
        const movie = await prisma.movie.findUnique({
            where: { id },
            include: {
                creator: {
                    select: { name: true }
                }
            }
        });

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        return res.status(200).json({
            status: 'Success',
            data: { movie }
        });
    } catch (error) {
        console.error("Error in getMovieById:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update movie
const updateMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const movie = await prisma.movie.findUnique({ where: { id } });

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Check ownership
        if (movie.createdBy !== userId) {
            return res.status(403).json({ error: 'Not authorized to update this movie' });
        }

        const updatedMovie = await prisma.movie.update({
            where: { id },
            data: req.body
        });

        return res.status(200).json({
            status: 'Success',
            data: { movie: updatedMovie }
        });

    } catch (error) {
        console.error("Error in updateMovie:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete movie
const deleteMovie = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const movie = await prisma.movie.findUnique({ where: { id } });

        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        // Check ownership
        if (movie.createdBy !== userId) {
            return res.status(403).json({ error: 'Not authorized to delete this movie' });
        }

        await prisma.movie.delete({ where: { id } });

        return res.status(200).json({
            status: 'Success',
            message: 'Movie deleted successfully'
        });
    } catch (error) {
        console.error("Error in deleteMovie:", error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

export { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie };
