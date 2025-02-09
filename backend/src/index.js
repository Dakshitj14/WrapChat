// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authroute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import messageroute from './routes/message.route.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Define port
const PORT = process.env.PORT || 5001;

// Routes
app.use('/api/auth', authroute);
app.use('/api/messages', messageroute);

// Start server
app.listen(PORT, () => {
    console.log('Server is running on PORT:' + PORT);
    connectDB();
});
