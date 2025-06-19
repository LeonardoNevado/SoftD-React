const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  rentalDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'returned'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rental', rentalSchema);