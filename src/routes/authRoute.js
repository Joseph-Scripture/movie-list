import {Router} from 'express';
const router = Router();
import {register} from '../controllers/authController.js';


// Register Route
router.post('/register', register);

export default router;