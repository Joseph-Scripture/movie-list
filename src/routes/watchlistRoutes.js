import { Router } from "express";
const router = Router();
import { addToWatchlist } from "../controllers/watchlistController.js";
import {authMiddleware} from '../middleware/authMiddleware.js'

router.use(authMiddleware)
router.post('/', addToWatchlist);


export default router;