const mongoose = require('mongoose');
const Florist = require('./models/Florist');
const Review = require('./models/Review');
const connectDB = require('./config/db.js');

const sampleFlorists = [
  {
    name: "Chamundeshwari Royal Floral Decorators",
    ownerName: "Nagaraju Gowda",
    phone: "+91 98451 22341",
    whatsappNumber: "919845122341",
    area: "Gokulam",
    address: "#142, 3rd Stage, Contour Road Main, Gokulam, Mysuru",
    landmark: "Opposite Gokulam Park & Near Doctors Corner",
    pincode: "570002",
    googleMapsUrl: "https://maps.google.com/?q=Gokulam+3rd+Stage+Mysuru",
    officeHours: "9:00 AM - 8:30 PM (Mon - Sat)",
    acceptsOfficeVisits: true,
    responseTime: "Within 2 hours",
    bio: "Mysuru's premier traditional jasmine & marigold wedding stage decorator with 18+ years experience in royal South Indian Mandaps and Jasmine (Kakada) entry gates.",
    experienceYears: 18,
    startingPrice: 25000,
    maxPrice: 250000,
    specialties: ["Weddings", "Birthdays", "Corporate", "Anniversaries", "Haldi/Mehendi"],
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    portfolio: [
      { id: "101", url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80", title: "Grand Mysuru Wedding Mandap Decor", category: "Weddings", price: 120000 },
      { id: "102", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80", title: "Bright Yellow Haldi Flower Arch", category: "Haldi/Mehendi", price: 35000 },
      { id: "103", url: "https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=800&q=80", title: "Traditional Gruhapravesha Garland Gate", category: "Weddings", price: 28000 },
      { id: "104", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80", title: "Royal Purple Orchid Reception Stage", category: "Weddings", price: 150000 },
      { id: "105", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", title: "Pastel Rose Birthday Canopy", category: "Birthdays", price: 22000 },
      { id: "106", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80", title: "Corporate Gala Entrance Gate", category: "Corporate", price: 65000 },
      { id: "107", url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80", title: "Anniversary Rose Wall Backdrop", category: "Anniversaries", price: 40000 },
      { id: "108", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80", title: "Colorful Balloon & Flower Stage", category: "Birthdays", price: 18000 },
      { id: "109", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", title: "Mysuru Temple Lotus Garland Gate", category: "Weddings", price: 32000 },
      { id: "110", url: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80", title: "Groom Car Jasmine Wrapping", category: "Weddings", price: 12000 },
      { id: "111", url: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80", title: "Red Rose Palace Pillars", category: "Weddings", price: 180000 },
      { id: "112", url: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80", title: "Bamboo Eco Marigold Arch", category: "Haldi/Mehendi", price: 26000 }
    ],
    rating: 4.8,
    reviewCount: 23,
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
    address: "Shop #8, M-Block Commercial Complex Main Road, Kuvempunagar, Mysuru",
    landmark: "Behind Kuvempunagar Bus Depot",
    pincode: "570023",
    googleMapsUrl: "https://maps.google.com/?q=Kuvempunagar+Mysuru",
    officeHours: "8:30 AM - 9:00 PM (All Days)",
    acceptsOfficeVisits: true,
    responseTime: "Within 1 hour",
    bio: "Specialists in budget-friendly housewarming, baby shower (Seemantha), and birthday backdrop floral hangings. Fresh flowers sourced directly from Mysuru Devaraja Market daily.",
    experienceYears: 12,
    startingPrice: 8000,
    maxPrice: 85000,
    specialties: ["Birthdays", "Anniversaries", "Weddings", "Corporate"],
    coverImage: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=1200&q=80",
    portfolio: [
      { id: "201", url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&w=800&q=80", title: "Fresh Rose & Lily Backdrop", category: "Weddings", price: 18000 },
      { id: "202", url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=800&q=80", title: "Colorful Birthday Floral Stage", category: "Birthdays", price: 15000 },
      { id: "203", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", title: "Anniversary Red Heart Roses", category: "Anniversaries", price: 24000 },
      { id: "204", url: "https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80", title: "Haldi Flower Umbrella Decor", category: "Weddings", price: 16000 }
    ],
    rating: 4.9,
    reviewCount: 38,
    views: 980,
    whatsappInquiries: 145,
    callInquiries: 78,
    isAvailable: true,
    featured: true
  },
  {
    name: "Mysuru Blossom Heritage Events",
    ownerName: "Deepak & Priya",
    phone: "+91 97410 88233",
    whatsappNumber: "919741088233",
    area: "Jayalakshmipuram",
    address: "Suite 304, Heritage Plaza, Kalidasa Road, Jayalakshmipuram, Mysuru",
    landmark: "Above Cafe Coffee Day, Kalidasa Road",
    pincode: "570012",
    googleMapsUrl: "https://maps.google.com/?q=Kalidasa+Road+Jayalakshmipuram+Mysuru",
    officeHours: "10:00 AM - 7:30 PM (Mon - Sat)",
    acceptsOfficeVisits: true,
    responseTime: "Within 30 mins",
    bio: "Luxury eco-friendly floral styling using exotic orchids, roses, and carnations blended with Mysuru Mallige. Perfect for destination weddings & high-end corporate receptions.",
    experienceYears: 9,
    startingPrice: 40000,
    maxPrice: 500000,
    specialties: ["Weddings", "Corporate", "Anniversaries", "Birthdays"],
    coverImage: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=1200&q=80",
    portfolio: [
      { id: "301", url: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80", title: "Pastel Orchid & Rose Canopy", category: "Weddings", price: 210000 },
      { id: "302", url: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80", title: "Grand Reception Stage Entrance", category: "Weddings", price: 160000 },
      { id: "303", url: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80", title: "Corporate Annual Gala Archway", category: "Corporate", price: 95000 }
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
    address: "#45, Vani Vilas Water Works Road, VV Mohalla, Mysuru",
    landmark: "Near Vani Vilas Water Tank & Post Office",
    pincode: "570002",
    googleMapsUrl: "https://maps.google.com/?q=VV+Mohalla+Mysuru",
    officeHours: "7:00 AM - 9:00 PM (All Days)",
    acceptsOfficeVisits: true,
    responseTime: "Within 2 hours",
    bio: "Direct-from-market fresh flower garlands, car decoration for groom, and stage flower work. Known for crisp timings and 100% natural flower guarantee.",
    experienceYears: 22,
    startingPrice: 5000,
    maxPrice: 60000,
    specialties: ["Weddings", "Birthdays", "Corporate"],
    coverImage: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=1200&q=80",
    portfolio: [
      { id: "401", url: "https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80", title: "Traditional Marigold Temple Entrance", category: "Weddings", price: 12000 },
      { id: "402", url: "https://images.unsplash.com/photo-1508615039623-a25605d2b022?auto=format&fit=crop&w=800&q=80", title: "Groom Car Floral Wrapping", category: "Weddings", price: 8000 }
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
    address: "#89, Water Tank Road, 2nd Stage, Vijayanagar, Mysuru",
    landmark: "Opposite Royal Comforts Hotel",
    pincode: "570017",
    googleMapsUrl: "https://maps.google.com/?q=Vijayanagar+2nd+Stage+Mysuru",
    officeHours: "9:30 AM - 8:00 PM (Mon - Sat)",
    acceptsOfficeVisits: true,
    responseTime: "Within 1 hour",
    bio: "Combining brilliant fairy light draping with cascading floral chandeliers. Ideal for night receptions, Sangeet nights, and anniversary galas.",
    experienceYears: 10,
    startingPrice: 20000,
    maxPrice: 180000,
    specialties: ["Anniversaries", "Weddings", "Birthdays", "Corporate"],
    coverImage: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=1200&q=80",
    portfolio: [
      { id: "501", url: "https://images.unsplash.com/photo-1532712938310-34cb3982ef74?auto=format&fit=crop&w=800&q=80", title: "Illuminated Sangeet Stage with Tulips", category: "Weddings", price: 55000 },
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

const sampleReviews = [
  {
    customerName: "Sujatha R. (Gokulam)",
    rating: 5,
    eventType: "Weddings",
    comment: "Nagaraju Avaru decorated our daughter's wedding mandap in Lalitha Mahal Palace. The jasmine aroma and royal finish was magnificent! Highly recommended."
  },
  {
    customerName: "Pradeep Kumar (Kuvempunagar)",
    rating: 5,
    eventType: "Birthdays",
    comment: "Very prompt service for our daughter's 1st birthday event. Arrived at 4:30 AM fresh with flowers and completed before the guests arrived. Super clean!"
  },
  {
    customerName: "Ananya Hegde (Jayalakshmipuram)",
    rating: 5,
    eventType: "Anniversaries",
    comment: "The yellow and orange marigold backdrop for our 25th anniversary function looked so vibrant in all photos! FlowerHub made contacting them effortless."
  }
];

const seedData = async () => {
  await connectDB();
  try {
    await Florist.deleteMany({});
    await Review.deleteMany({});
    console.log('[Seed] Cleared old dataset.');

    const createdFlorists = await Florist.insertMany(sampleFlorists);
    console.log(`[Seed] Successfully inserted ${createdFlorists.length} Mysuru florists with expanded portfolio gallery & reviews!`);

    const firstFloristId = createdFlorists[0]._id;
    const reviewsToSave = sampleReviews.map(r => ({ ...r, floristId: firstFloristId }));
    await Review.insertMany(reviewsToSave);
    console.log('[Seed] Successfully inserted sample reviews!');

    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    process.exit(1);
  }
};

seedData();
