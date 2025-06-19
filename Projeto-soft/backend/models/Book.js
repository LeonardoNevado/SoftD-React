const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  publishYear: {
    type: Number,
    required: true
  },
  isbn: {
    type: String,
    required: true,
    unique: true
  },
  available: {
    type: Boolean,
    default: true
  },
  rentalPrice: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);