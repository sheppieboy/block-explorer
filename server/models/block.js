const mongoose = require('mongoose');
const BlockSchema = new mongoose.Schema({
  hash: {
    type: String,
    required: true,
  },
  parentHash: {
    type: String,
    required: true,
  },
  number: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Number,
    required: true,
  },
  nonce: {
    type: String,
    required: true,
  },
  difficulty: {
    type: Number,
    required: true,
  },
});

const Block = mongoose.model('Block', BlockSchema);

module.exports = Block;
