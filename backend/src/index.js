// const express = require('express');
import express from 'express';
import authroute from './routes/auth.route.js';

const app = express();
app.use('/api/auth', authroute);
app.listen(5001, () => {
    console.log('Server is running on port 5001');
});