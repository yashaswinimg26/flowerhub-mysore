const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  floristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Florist', required: true },
  customerName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  eventType: { type: String, required: true },
  comment: { type: String, required: true },
  verifiedEvent: { type: Boolean, default: true },
  date: { type: String, default: () => new Date().toISOString().split('T')[0] }
}, { timestamps: true });

module.exports = mongoose.model('Review', ReviewSchema);
