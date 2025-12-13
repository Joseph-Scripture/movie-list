import { prisma } from "../config/db.js";


const addToWatchlist = async (req, res) => {
    try {
        const { movieId, status, rating, notes } = req.body;
        const userId = req.user.id;

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
        });

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
        });

        return res.status(201).json({
            status: 'Success',
            message: "Watchlist item added successfully",
            data: {
                watchListItem
            }
        });
    } catch (error) {
        console.error("Error in addToWatchlist:", error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
};
const removeFromWatchList = async (req, res) => {
    try {
        const movieId = req.params.id;
        const watchListItem = await prisma.watchListItem.findUnique({
            where:{id:movieId}
        })
        if(!watchListItem){
            return res.status(404).json({error:"Watchlist item not found"})
        }
        if(watchListItem.userId !== req.user.id){
            return res.status(403).json({error:"You are not authorized to remove this item"})
        }
        await prisma.watchListItem.delete({
            where:{id:movieId}
        })
       
        return res.status(200).json({
            status:"Success",
            message:"Watchlist item removed successfully"
        })
    } catch (error) {
        console.error("Error in removeFromWatchList:", error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message })
    }
}
export { addToWatchlist, removeFromWatchList }