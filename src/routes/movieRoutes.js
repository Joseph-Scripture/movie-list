
import { Router } from 'express';
import { createMovie, getAllMovies, getMovieById, updateMovie, deleteMovie } from '../controllers/movieController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { validateRequest } from '../middleware/validateRequest.js';
import { createMovieSchema, updateMovieSchema } from '../validators/movieValidator.js';

const router = Router();

// Public routes (Optional: decide if viewing movies requires auth. Assuming yes for consistency, or maybe GET is public?)
// Let's make all protected for now as per the "creator" logic, or at least creation/modification.

router.get('/', getAllMovies);
router.get('/:id', getMovieById);

// Protected routes
router.use(authMiddleware);

router.post('/', validateRequest(createMovieSchema), createMovie);
router.put('/:id', validateRequest(updateMovieSchema), updateMovie);
router.delete('/:id', deleteMovie);

export default router;
