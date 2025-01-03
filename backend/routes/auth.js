const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

// Sign up
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Validate username (at least 3 chars)
    if (username.length < 3) {
      return res.status(400).json({
        message: 'Username must be at least 3 characters long.'
      });
    }

    // Validate password length (at least 6 chars)
    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password must be at least 6 characters long.'
      });
    }

    // Validate at least one uppercase character
    const uppercaseRegex = /[A-Z]/;
    if (!uppercaseRegex.test(password)) {
      return res.status(400).json({
        message: 'Password must contain at least one uppercase character.'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(password, 10);

    // Create new user
    const user = new User({ username, email, password: hashedPwd });
    await user.save();

    // Set session
    req.session.userId = user._id;

    return res.status(201).json({ user });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ message: 'Server error during signup.' });
  }
});

// Log in route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Check if user is locked out
    if (user.isLockedOut) {
      const lockDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
      const timeElapsed = Date.now() - new Date(user.lockoutStartTime).getTime();

      if (timeElapsed < lockDuration) {
        const minutesLeft = Math.ceil((lockDuration - timeElapsed) / 60000);
        return res.status(403).json({
          message: `Account is locked. Try again in ${minutesLeft} minutes.`,
        });
      }

      // Reset lockout status after the lockout period expires
      user.isLockedOut = false;
      user.loginAttempts = 0;
      user.lockoutStartTime = null;
      await user.save();
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.loginAttempts += 1;

      if (user.loginAttempts >= 5) {
        user.isLockedOut = true;
        user.lockoutStartTime = Date.now();
        await user.save();
        return res.status(403).json({
          message: 'Account locked due to too many failed login attempts.',
        });
      }

      await user.save(); // Save after incrementing login attempts
      return res.status(401).json({ message: 'Invalid email or password.' });
    }

    // Successful login Resets attempts and lockout status
    user.loginAttempts = 0;
    user.isLockedOut = false;
    user.lockoutStartTime = null;
    await user.save();

    // Set session
    req.session.userId = user._id;

    res.status(200).json({ user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
});



// Log out
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
      return res.status(500).json({ message: 'Server error during logout.' });
    }
    res.clearCookie('connect.sid'); // Name may vary based on session configuration
    res.status(200).json({ message: 'Logged out successfully.' });
  });
});

// Get current user
router.get('/user', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const user = await User.findById(req.session.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user.' });
  }
});

module.exports = router;
