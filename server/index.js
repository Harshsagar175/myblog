const express = require('express');
const cors = require('cors');
const { connect } = require('mongoose');
require('dotenv').config();
const upload = require('express-fileupload');

const userRoutes = require('./routes/userRoutes');
const postRoutes = require('./routes/postRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middleware to parse incoming JSON requests
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));

// CORS configuration
app.use(cors());

// File upload middleware
app.use(upload());

// Serve static files from the "uploads" directory
app.use('/uploads', express.static(__dirname + '/uploads'));

// API routes
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Connect to MongoDB and start the server
const startServer = () => {
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server started on port ${process.env.PORT || 5000}`);
    });
};
connect(process.env.MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        startServer();
    })
    .catch(error => {
        console.error('Failed to connect to MongoDB', error);
        // process.exit(1); // Exit the process with an error code
    });
