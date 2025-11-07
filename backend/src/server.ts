import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173'
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Prof backend is running!' });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('Backend server running on http://localhost:' + PORT);
    console.log('Prof is ready to help students!');
  });
});
