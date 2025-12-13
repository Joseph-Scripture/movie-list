import { prisma } from "../config/db.js";


const addToWatchlist = async (req, res) => {
    try {
        const { movieId, status, rating, notes, userId } = req.body;

        if (!userId || !movieId) {
            return res.status(400).json({ error: 'UserId and MovieId are required' });
        }

        const movie = await prisma.movie.findUnique({ where: { id: movieId } });
        if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
        }

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const existingItem = await prisma.watchListItem.findUnique({
            where: {
                userId_movieId: {
                    userId,
                    movieId
                }
            },

        })
        if (existingItem) {
            return res.status(400).json({ error: 'Movie already in watchlist' });
        }
        const watchListItem = await prisma.watchListItem.create({
            data: {
                userId,
                movieId,
                status: status || "PLANNED",
                rating,
                notes
            }
        })
        return res.status(201).json({
            status: 'Success',
            data: {
                watchListItem
            }
        })
    } catch (error) {
        console.error("Error in addToWatchlist:", error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message })
    }
}
export { addToWatchlist }