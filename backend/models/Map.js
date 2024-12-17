const mongoose = require('mongoose');

const BubbleSchema = new mongoose.Schema({
  id: String,
  text: String,
  description: String,
  resources: [String],
});

const ConnectionSchema = new mongoose.Schema({
  source: String,
  target: String,
});

const MapSchema = new mongoose.Schema({
  creatorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: String,
  description: String,
  bubbles: [BubbleSchema],
  connections: [ConnectionSchema],
  public: { type: Boolean, default: false } // Add this line
});

module.exports = mongoose.model('Map', MapSchema);
