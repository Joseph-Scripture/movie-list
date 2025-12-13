import 'dotenv/config'
import express from 'express';
import { connectDB } from './config/db.js'

if (!process.env.JWT_SECRET) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
  process.exit(1);
}

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// Routes
import authRoutes from './routes/authRoute.js'
import watchlistRoutes from './routes/watchlistRoutes.js'
app.use('/api', authRoutes)
app.use('/watchlist', watchlistRoutes)







connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`Server running on port ${process.env.PORT || 3000}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server due to database error:', error);
    process.exit(1);
  });