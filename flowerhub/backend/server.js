const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const floristRoutes = require('./routes/floristRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const Florist = require('./models/Florist');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/florists', floristRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/analytics', analyticsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'FlowerHub Mysuru API', time: new Date() });
});

// Auto-seed dataset if DB is empty
const autoSeedIfEmpty = async () => {
  try {
    const count = await Florist.countDocuments();
    if (count === 0) {
      console.log('[AutoSeed] Database is empty. Seeding initial Mysuru florists with office details...');
      const sampleFlorists = [
        {
          name: "Chamundeshwari Royal Floral Decorators",
          ownerName: "Nagaraju Gowda",
          phone: "+91 98451 22341",
          whatsappNumber: "919845122341",
          area: "Gokulam",
          address: "#142, 3rd Stage, Contour Road Main",
          landmark: "Opposite Gokulam Park & Near Doctors Corner",
          pincode: "570002",
          googleMapsUrl: "https://maps.google.com/?q=Gokulam+3rd+Stage+Mysuru",
          officeHours: "9:00 AM - 8:30 PM (Mon - Sat)",
          acceptsOfficeVisits: true,
          bio: "Mysuru's premier traditional jasmine & marigold wedding stage decorator with 18+ years experience in royal South Indian Mandaps and Jasmine (Kakada) entry gates.",
          experienceYears: 18,
          startingPrice: 25000,
          maxPrice: 250000,
          specialties: ["Wedding", "Haldi/Mehendi", "Gruhapravesha", "Temple Puja"],
          coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
          portfolio: [
            { id: "101", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", title: "Grand Mysuru Wedding Mandap Decor", category: "Wedding", price: 120000 },
            { id: "102", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80", title: "Bright Yellow Haldi Flower Arch", category: "Haldi/Mehendi", price: 35000 },
            { id: "103", url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80", title: "Traditional Gruhapravesha Garland Gate", category: "Gruhapravesha", price: 28000 }
          ],
          rating: 4.9,
          reviewCount: 48,
          views: 1420,
          whatsappInquiries: 230,
          callInquiries: 115,
          isAvailable: true,
          featured: true
        },
        {
          name: "Sri Lakshmi Venkateshwara Floral Arts",
          ownerName: "K. Venkatesh",
          phone: "+91 99002 44119",
          whatsappNumber: "919900244119",
          area: "Kuvempunagar",
          address: "Shop #8, M-Block Commercial Complex Main Road",
          landmark: "Behind Kuvempunagar Bus Depot",
          pincode: "570023",
          googleMapsUrl: "https://maps.google.com/?q=Kuvempunagar+Mysuru",
          officeHours: "8:30 AM - 9:00 PM (All Days)",
          acceptsOfficeVisits: true,
          bio: "Specialists in budget-friendly housewarming, baby shower (Seemantha), and birthday backdrop floral hangings. Fresh flowers sourced directly from Mysuru Devaraja Market daily.",
          experienceYears: 12,
          startingPrice: 8000,
          maxPrice: 85000,
          specialties: ["Gruhapravesha", "Birthday", "Haldi/Mehendi", "Temple Puja"],
          coverImage: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
          portfolio: [
            { id: "201", url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80", title: "Fresh Rose & Lily Backdrop", category: "Gruhapravesha", price: 18000 },
            { id: "202", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80", title: "Colorful Birthday Floral Stage", category: "Birthday", price: 15000 }
          ],
          rating: 4.7,
          reviewCount: 34,
          views: 980,
          whatsappInquiries: 145,
          callInquiries: 78,
          isAvailable: true,
          featured: false
        },
        {
          name: "Mysuru Blossom Heritage Events",
          ownerName: "Deepak & Priya",
          phone: "+91 97410 88233",
          whatsappNumber: "919741088233",
          area: "Jayalakshmipuram",
          address: "Suite 304, Heritage Plaza, Kalidasa Road",
          landmark: "Above Cafe Coffee Day, Kalidasa Road",
          pincode: "570012",
          googleMapsUrl: "https://maps.google.com/?q=Kalidasa+Road+Jayalakshmipuram+Mysuru",
          officeHours: "10:00 AM - 7:30 PM (Mon - Sat)",
          acceptsOfficeVisits: true,
          bio: "Luxury eco-friendly floral styling using exotic orchids, roses, and carnations blended with Mysuru Mallige. Perfect for destination weddings & high-end receptions.",
          experienceYears: 9,
          startingPrice: 40000,
          maxPrice: 500000,
          specialties: ["Wedding", "Corporate", "Haldi/Mehendi"],
          coverImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
          portfolio: [
            { id: "301", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80", title: "Pastel Orchid & Rose Canopy", category: "Wedding", price: 210000 },
            { id: "302", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", title: "Grand Reception Stage Entrance", category: "Wedding", price: 160000 }
          ],
          rating: 4.95,
          reviewCount: 62,
          views: 2150,
          whatsappInquiries: 340,
          callInquiries: 190,
          isAvailable: true,
          featured: true
        },
        {
          name: "Devaraja Fresh Flora Decorators",
          ownerName: "Mahadeva Swamy",
          phone: "+91 94480 33120",
          whatsappNumber: "919448033120",
          area: "VV Mohalla",
          address: "#45, Vani Vilas Water Works Road",
          landmark: "Near Vani Vilas Water Tank & Post Office",
          pincode: "570002",
          googleMapsUrl: "https://maps.google.com/?q=VV+Mohalla+Mysuru",
          officeHours: "7:00 AM - 9:00 PM (All Days)",
          acceptsOfficeVisits: true,
          bio: "Direct-from-market fresh flower garlands, car decoration for groom, and stage flower work. Known for crisp timings and 100% natural flower guarantee.",
          experienceYears: 22,
          startingPrice: 5000,
          maxPrice: 60000,
          specialties: ["Temple Puja", "Gruhapravesha", "Wedding", "Birthday"],
          coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
          portfolio: [
            { id: "401", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", title: "Traditional Marigold Temple Entrance", category: "Temple Puja", price: 12000 },
            { id: "402", url: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80", title: "Groom Car Floral Wrapping", category: "Wedding", price: 8000 }
          ],
          rating: 4.6,
          reviewCount: 29,
          views: 740,
          whatsappInquiries: 98,
          callInquiries: 62,
          isAvailable: true,
          featured: false
        },
        {
          name: "Golden Petals Decor & Lighting",
          ownerName: "Srinivas Rao",
          phone: "+91 98801 55677",
          whatsappNumber: "919880155677",
          area: "Vijayanagar",
          address: "#89, Water Tank Road, 2nd Stage",
          landmark: "Opposite Royal Comforts Hotel",
          pincode: "570017",
          googleMapsUrl: "https://maps.google.com/?q=Vijayanagar+2nd+Stage+Mysuru",
          officeHours: "9:30 AM - 8:00 PM (Mon - Sat)",
          acceptsOfficeVisits: true,
          bio: "Combining brilliant fairy light draping with cascading floral chandeliers. Ideal for night receptions, Sangeet nights, and anniversary galas.",
          experienceYears: 10,
          startingPrice: 20000,
          maxPrice: 180000,
          specialties: ["Haldi/Mehendi", "Wedding", "Birthday", "Corporate"],
          coverImage: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
          portfolio: [
            { id: "501", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80", title: "Illuminated Sangeet Stage with Tulips", category: "Haldi/Mehendi", price: 55000 },
            { id: "502", url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80", title: "Corporate Gala Flower Archway", category: "Corporate", price: 42000 }
          ],
          rating: 4.8,
          reviewCount: 41,
          views: 1120,
          whatsappInquiries: 180,
          callInquiries: 90,
          isAvailable: true,
          featured: true
        }
      ];
      await Florist.insertMany(sampleFlorists);
      console.log('[AutoSeed] Sample Mysuru florists auto-seeded with office locations!');
    }
  } catch (err) {
    console.error('[AutoSeed] Error during auto-seeding:', err.message);
  }
};

// Start Server after connecting to DB
connectDB().then(() => {
  autoSeedIfEmpty();
  app.listen(PORT, () => {
    console.log(`[FlowerHub API] Server running on http://localhost:${PORT}`);
  });
});
