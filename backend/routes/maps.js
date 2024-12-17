const express = require('express');
const router = express.Router();
const Map = require('../models/Map');

// Get all maps (public only)
router.get('/', async (req, res) => {
  try {
    const maps = await Map.find({ public: true }).populate('creatorId', 'username');
    res.status(200).json(maps);
  } catch (error) {
    console.error('Get maps error:', error);
    res.status(500).json({ message: 'Server error fetching maps.' });
  }
});

// Get map by ID
router.get('/:id', async (req, res) => {
  try {
    const map = await Map.findById(req.params.id);
    if (!map) {
      return res.status(404).json({ message: 'Map not found.' });
    }
    res.status(200).json(map);
  } catch (error) {
    console.error('Get map by ID error:', error);
    res.status(500).json({ message: 'Server error fetching map.' });
  }
});

// Create new map
router.post('/', async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const { name, description, bubbles, connections } = req.body;
    if (!name || !description) {
      return res.status(400).json({ message: 'Name and description are required.' });
    }

    const map = new Map({
      creatorId: req.session.userId,
      name,
      description,
      bubbles: bubbles || [],
      connections: connections || [],
    });

    await map.save();
    res.status(201).json(map);
  } catch (error) {
    console.error('Create map error:', error);
    res.status(500).json({ message: 'Server error creating map.' });
  }
});

// Update map
router.put('/:id', async (req, res) => {
  try {
    const map = await Map.findById(req.params.id);
    if (!map) {
      return res.status(404).json({ message: 'Map not found.' });
    }

    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    if (map.creatorId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Unauthorized to edit this map.' });
    }

    const { name, description, bubbles, connections, public: isPublic } = req.body;
    if (name !== undefined) map.name = name;
    if (description !== undefined) map.description = description;
    if (bubbles !== undefined) map.bubbles = bubbles;
    if (connections !== undefined) map.connections = connections;
    if (typeof isPublic === 'boolean') map.public = isPublic;

    await map.save();
    res.status(200).json(map);
  } catch (error) {
    console.error('Update map error:', error);
    res.status(500).json({ message: 'Server error updating map.' });
  }
});

// Delete map
router.delete('/:id', async (req, res) => {
  try {
    console.log('Delete map request:', req.params.id, 'User:', req.session.userId);
    if (!req.session.userId) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }

    const map = await Map.findById(req.params.id);
    if (!map) return res.status(404).json({ message: 'Map not found.' });

    if (map.creatorId.toString() !== req.session.userId) {
      return res.status(403).json({ message: 'Unauthorized to delete this map.' });
    }

    await Map.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Map deleted successfully.' });
  } catch (error) {
    console.error('Delete map error:', error);
    res.status(500).json({ message: 'Server error deleting map.' });
  }
});

module.exports = router;
