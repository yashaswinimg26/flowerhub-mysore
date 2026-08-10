const mongoose = require('mongoose');

const FloristSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ownerName: { type: String, required: true },
  phone: { type: String, required: true },
  whatsappNumber: { type: String, required: true },
  area: { type: String, required: true }, // e.g. Gokulam, Kuvempunagar, VV Mohalla, Jayalakshmipuram, etc.
  address: { type: String, required: true },
  landmark: { type: String, default: '' },
  pincode: { type: String, default: '570001' },
  googleMapsUrl: { type: String, default: '' },
  officeHours: { type: String, default: '9:00 AM - 8:30 PM (All Days)' },
  acceptsOfficeVisits: { type: Boolean, default: true },
  bio: { type: String, required: true },
  experienceYears: { type: Number, default: 5 },
  startingPrice: { type: Number, required: true }, // in INR
  maxPrice: { type: Number, required: true }, // in INR
  specialties: [{ type: String }],
  coverImage: { type: String, required: true },
  portfolio: [{
    id: String,
    url: String,
    title: String,
    category: String,
    price: Number
  }],
  rating: { type: Number, default: 4.8 },
  reviewCount: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  whatsappInquiries: { type: Number, default: 0 },
  callInquiries: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  featured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Florist', FloristSchema);
