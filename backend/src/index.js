// Import necessary modules
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authroute from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import messageroute from './routes/message.route.js';
import bodyParser from 'body-parser';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Middleware
app.use(bodyParser.json({ limit: "10mb" })); // Increase JSON payload limit
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true })); // Increase URL-encoded payload limit
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

// Start server
app.listen(PORT, () => {
    console.log('Server is running on PORT:' + PORT);
    connectDB();
});
