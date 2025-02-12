// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authroute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import messageroute from './routes/message.route.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

// Define port
const PORT = process.env.PORT || 5001;

// Routes
app.use('/api/auth', authroute);
app.use('/api/messages', messageroute);

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
    })
);

// Start server
app.listen(PORT, () => {
    console.log('Server is running on PORT:' + PORT);
    connectDB();
});
