import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js'; // Assuming this path is correct
import doctorRoutes from './routes/doctorRoutes.js';
dotenv.config();
const app = express();
// app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // <-- Secure way
app.use(cors()); // <-- Debugging method to allow all origins

// 1.2. BODY PARSER: Essential for reading JSON data (username, email, password) from the frontend.
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);

const PORT = process.env.PORT || 5000;


const startServer = async () => {
    await connectDB();
    
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
};

startServer();