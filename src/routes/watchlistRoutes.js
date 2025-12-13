import { Router } from "express";
const router = Router();
import { addToWatchlist } from "../controllers/watchlistController.js";


router.post('/', addToWatchlist);

export default router;