// const express = require('express');
import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
// connectDB();
dotenv.config();
import authroute from './routes/auth.route.js';

app.use(express.json());
const app = express();
const PORT = process.env.PORT || 5001;
app.use('/api/auth', authroute);
app.listen(PORT, () => {
    console.log('Server is running on PORT:' + PORT);
    connectDB();
});