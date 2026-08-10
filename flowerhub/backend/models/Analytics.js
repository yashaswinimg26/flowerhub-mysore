const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  floristId: { type: mongoose.Schema.Types.ObjectId, ref: 'Florist', required: true },
  type: { type: String, enum: ['view', 'whatsapp_inquiry', 'call_inquiry'], required: true },
  eventType: { type: String }, // optional e.g. Wedding, Haldi, etc.
  timestamp: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
