import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

dotenv.config();
const app = express();

// Middleware
app.use(express.json());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const PORT = process.env.PORT || 5000;


const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();
