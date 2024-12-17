const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const mapRoutes = require('./routes/maps');
const userRoutes = require('./routes/users');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config(); // Load environment variables

const app = express();

// CORS Middleware
app.use(
  cors({
    origin: 'https://knowledge-map-front.onrender.com', // Your live frontend URL
    credentials: true, // Allow credentials (cookies, sessions)
  })
);

// Body Parser Middleware
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: {
      secure: true, // Set to true for HTTPS (Render uses HTTPS by default)
      sameSite: 'lax', // Prevent cross-site request issues
    },
  })
);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/users', userRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected');
    // Start the server only after successful DB connection
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
