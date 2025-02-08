// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authroute from './routes/auth.route.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());

// Define port
const PORT = process.env.PORT || 5001;

// Routes
app.use('/api/auth', authroute);

// Start server
app.listen(PORT, () => {
    console.log('Server is running on PORT:' + PORT);
    connectDB();
});
