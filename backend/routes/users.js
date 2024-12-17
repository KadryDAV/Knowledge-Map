const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Map = require('../models/Map');

// Get user's maps
router.get('/:id/maps', async (req, res) => {
  try {
    const maps = await Map.find({ creatorId: req.params.id });
    res.status(200).json(maps);
  } catch (error) {
    console.error('Get user maps error:', error);
    res.status(500).json({ message: 'Server error fetching user maps.' });
  }
});

// Get user's saved maps
router.get('/:id/saved-maps', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('savedMaps');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user.savedMaps);
  } catch (error) {
    console.error('Get user saved maps error:', error);
    res.status(500).json({ message: 'Server error fetching saved maps.' });
  }
});

// Save a map to user's profile
router.post('/:id/save-map', async (req, res) => {
  try {
    if (req.session.userId !== req.params.id) {
      return res.status(403).json({ message: 'Unauthorized to save map for this user.' });
    }

    const { mapId } = req.body;

    // Validate mapId
    const map = await Map.findById(mapId);
    if (!map) {
      return res.status(404).json({ message: 'Map not found.' });
    }

    const user = await User.findById(req.params.id);
    if (!user.savedMaps.includes(mapId)) {
      user.savedMaps.push(mapId);
      await user.save();
    }

    res.status(200).json({ message: 'Map saved successfully.' });
  } catch (error) {
    console.error('Save map error:', error);
    res.status(500).json({ message: 'Server error saving map.' });
  }
});

module.exports = router;
