const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const mapRoutes = require('./routes/maps');
const userRoutes = require('./routes/users');
const session = require('express-session');
const MongoStore = require('connect-mongo');
require('dotenv').config();

const app = express();

app.set('trust proxy', 1);

// CORS Middleware
app.use(
  cors({
    origin: 'https://knowledge-map-front.onrender.com', // Frontend URL
    credentials: true, // Allow cookies
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
      secure: process.env.NODE_ENV === 'production', // Secure only in production
      httpOnly: true, // Prevent client-side JavaScript access
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    },
  })
);

// Root Route for Testing
app.get('/', (req, res) => {
  res.send('Backend is live!');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/maps', mapRoutes);
app.use('/api/users', userRoutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB Connected');
    app.listen(3001, () => {
      console.log('Server is running on port 3001');
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
