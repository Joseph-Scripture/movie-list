import 'dotenv/config'
import express from 'express';
import {connectDB} from './config/db.js'



const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))

// Routes






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