import { Router } from "express";
const router = Router();
import { addToWatchlist, removeFromWatchList, updateWatchlist, getWatchlist } from "../controllers/watchlistController.js";
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { addToWatchlistSchema } from '../validators/watchlistValidator.js';


router.use(authMiddleware)
router.get('/', getWatchlist);
router.post('/', validateRequest(addToWatchlistSchema), addToWatchlist);
router.delete('/:id', removeFromWatchList);
router.put('/:id', validateRequest(addToWatchlistSchema), updateWatchlist);


export default router;