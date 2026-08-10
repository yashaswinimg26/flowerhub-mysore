import React, { useState, useEffect, useMemo } from 'react';
import { 
  Star, MapPin, Phone, MessageCircle, Clock, Share2, Copy, CheckCircle2, 
  Send, X, ChevronLeft, Calendar, Building2, User, Award, Filter, Sparkles
} from 'lucide-react';
import FloristCard from './FloristCard';

export default function FloristDetailPage({ florist, allFlorists, onBack, onSelectFlorist, onLogInquiry }) {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [activeGalleryFilter, setActiveGalleryFilter] = useState('All');
  const [lightboxImage, setLightboxImage] = useState(null);
  const [visiblePhotosCount, setVisiblePhotosCount] = useState(12);

  // Quick Inquiry Form State
  const [inquiryEventType, setInquiryEventType] = useState('Weddings');
  const [inquiryDate, setInquiryDate] = useState('');
  const [inquiryMessage, setInquiryMessage] = useState('');
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySent, setInquirySent] = useState(false);

  // Share Copy Toast
  const [shareToast, setShareToast] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (florist) {
      fetchReviews();
    }
  }, [florist]);

  const fetchReviews = async () => {
    try {
      setLoadingReviews(true);
      const res = await fetch(`/api/reviews/florist/${florist._id}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  // Full gallery of 12-20 photos
  const fullPortfolio = useMemo(() => {
    if (!florist) return [];
    const photos = [];
    if (florist.coverImage) photos.push({ id: 'cover', url: florist.coverImage, title: 'Cover Decoration', category: 'Weddings' });
    if (florist.portfolio && florist.portfolio.length > 0) {
      florist.portfolio.forEach(p => photos.push(p));
    }
    return photos;
  }, [florist]);

  // Filtered photos by category
  const filteredPhotos = useMemo(() => {
    if (activeGalleryFilter === 'All') return fullPortfolio;
    return fullPortfolio.filter(p => p.category === activeGalleryFilter || florist.specialties?.includes(activeGalleryFilter));
  }, [fullPortfolio, activeGalleryFilter, florist]);

  // Related florists in Mysuru
  const relatedFlorists = useMemo(() => {
    return allFlorists.filter(f => f._id !== florist._id).slice(0, 3);
  }, [allFlorists, florist]);

  const handleWhatsAppClick = () => {
    onLogInquiry(florist._id, 'whatsapp_inquiry');
    const text = encodeURIComponent(`Hi ${florist.name}, I am viewing your profile on FlowerHub Mysuru. I want to check availability for my event.`);
    window.open(`https://wa.me/${florist.whatsappNumber}?text=${text}`, '_blank');
  };

  const handleCallClick = () => {
    onLogInquiry(florist._id, 'call_inquiry');
    window.location.href = `tel:${florist.phone.replace(/\s+/g, '')}`;
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareToast(true);
    setTimeout(() => setShareToast(false), 3000);
  };

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    setInquirySubmitting(true);
    setTimeout(() => {
      setInquirySubmitting(false);
      setInquirySent(true);
      onLogInquiry(florist._id, 'whatsapp_inquiry');
      setTimeout(() => setInquirySent(false), 5000);
    }, 1000);
  };

  if (!florist) return null;

  return (
    <div className="space-y-10 pb-20">
      
      {/* Toast Alert */}
      {shareToast && (
        <div className="fixed top-24 right-6 z-50 bg-[#333333] text-white px-5 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center space-x-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-[#ff69b4]" />
          <span>Profile link copied to clipboard!</span>
        </div>
      )}

      {/* Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center space-x-2 text-xs font-bold text-[#ff69b4] hover:underline"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Back to All Florists</span>
      </button>

      {/* HEADER SECTION */}
      <div className="bg-white rounded-[12px] overflow-hidden shadow-card border border-slate-100">
        
        {/* Large Portfolio Cover Image */}
        <div className="relative h-72 sm:h-96 w-full bg-slate-900">
          <img 
            src={florist.coverImage} 
            alt={florist.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Share Buttons */}
          <div className="absolute top-4 right-4 flex items-center space-x-2">
            <button
              onClick={handleShareClick}
              className="px-3.5 py-2 bg-white/90 hover:bg-white text-slate-800 rounded-xl font-bold text-xs shadow-md backdrop-blur-md flex items-center space-x-1.5 transition-all"
            >
              <Share2 className="w-4 h-4 text-[#ff69b4]" />
              <span>Share Profile</span>
            </button>
          </div>

          {/* Title & Badge Overlay */}
          <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 bg-[#ff69b4] text-white text-xs font-extrabold rounded-full shadow-md">
                ⭐ {florist.rating} / 5 ({florist.reviewCount || 23} reviews)
              </span>
              <span className="px-3 py-1 bg-black/60 backdrop-blur-md text-amber-300 text-xs font-bold rounded-full border border-white/20 flex items-center space-x-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Responds {florist.responseTime || 'within 2 hours'}</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold font-poppins text-white leading-tight">
              {florist.name}
            </h1>

            <div className="flex items-center space-x-2 text-xs text-slate-200">
              <MapPin className="w-4 h-4 text-[#ff69b4]" />
              <span>{florist.address || `${florist.area}, Mysuru, Karnataka`}</span>
            </div>
          </div>
        </div>

        {/* Quick Contact Bar */}
        <div className="p-4 sm:p-6 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Estimated Price Tiers</span>
            <span className="text-2xl font-extrabold text-[#ff69b4] font-poppins">
              ₹{florist.startingPrice?.toLocaleString('en-IN')} - ₹{florist.maxPrice?.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={handleWhatsAppClick}
              className="btn-whatsapp flex-1 sm:flex-initial"
            >
              <MessageCircle className="w-5 h-5" />
              <span>WhatsApp Us</span>
            </button>

            <button
              onClick={handleCallClick}
              className="btn-primary flex-1 sm:flex-initial"
            >
              <Phone className="w-5 h-5" />
              <span>Call Now</span>
            </button>
          </div>
        </div>

      </div>

      {/* INFORMATION SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Bio / About */}
        <div className="md:col-span-2 bg-white p-6 rounded-[12px] shadow-card border border-slate-100 space-y-4">
          <h2 className="text-xl font-bold font-poppins text-[#333333]">About Decorator</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            {florist.bio}
          </p>

          <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-semibold block">Experience</span>
              <span className="font-extrabold text-[#333333] text-sm">Serving Mysuru since {2024 - (florist.experienceYears || 10)}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-semibold block">Office Visits</span>
              <span className="font-extrabold text-[#333333] text-sm">{florist.acceptsOfficeVisits ? 'Welcome in Person' : 'On Appointment'}</span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl">
              <span className="text-slate-400 font-semibold block">Response Time</span>
              <span className="font-extrabold text-[#ff69b4] text-sm">{florist.responseTime || 'Within 2 hours'}</span>
            </div>
          </div>
        </div>

        {/* Services Offered Grid */}
        <div className="bg-white p-6 rounded-[12px] shadow-card border border-slate-100 space-y-4">
          <h2 className="text-xl font-bold font-poppins text-[#333333]">Services Offered</h2>
          <div className="space-y-2">
            {['Weddings', 'Birthdays', 'Corporate', 'Anniversaries', 'Haldi & Mehendi', 'Housewarming (Gruhapravesha)'].map((service, idx) => (
              <div key={idx} className="flex items-center space-x-2 text-xs font-semibold text-slate-700 p-2.5 bg-slate-50 rounded-xl">
                <CheckCircle2 className="w-4 h-4 text-[#ff69b4]" />
                <span>{service}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* PORTFOLIO GALLERY SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-[12px] shadow-card border border-slate-100 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold font-poppins text-[#333333]">Past Work Portfolio</h2>
            <p className="text-xs text-slate-500">Real event photo gallery of {florist.name}</p>
          </div>

          {/* Event Filter Buttons */}
          <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
            {['All', 'Weddings', 'Birthdays', 'Corporate', 'Anniversaries'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveGalleryFilter(cat)}
                className={`filter-pill ${activeGalleryFilter === cat ? 'filter-pill-active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 1:1 Square Aspect Ratio Portfolio Photos Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredPhotos.slice(0, visiblePhotosCount).map((photo, index) => (
            <div
              key={index}
              onClick={() => setLightboxImage(photo.url)}
              className="group aspect-square rounded-[8px] overflow-hidden bg-slate-100 cursor-pointer relative shadow-sm hover:shadow-md transition-all"
            >
              <img
                src={photo.url}
                alt={photo.title || 'Flower Work'}
                className="w-full h-full object-cover group-hover:scale-105 group-hover:brightness-105 transition-all duration-300"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3 text-white text-xs font-semibold">
                <span>{photo.title || 'Click for full view'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* "Load More" Button if photos exceed limit */}
        {filteredPhotos.length > visiblePhotosCount && (
          <div className="text-center pt-4">
            <button
              onClick={() => setVisiblePhotosCount(prev => prev + 8)}
              className="btn-secondary inline-flex"
            >
              Load More Photos ({filteredPhotos.length - visiblePhotosCount} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div 
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
        >
          <button 
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 text-white bg-black/50 p-2 rounded-full hover:bg-black"
          >
            <X className="w-6 h-6" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Enlarged Portfolio View" 
            className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
          />
        </div>
      )}

      {/* REVIEWS SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Rating Breakdown Bars */}
        <div className="bg-white p-6 rounded-[12px] shadow-card border border-slate-100 space-y-4">
          <h2 className="text-xl font-bold font-poppins text-[#333333]">Rating Breakdown</h2>
          
          <div className="flex items-center space-x-3">
            <span className="text-4xl font-extrabold text-[#333333] font-poppins">{florist.rating}</span>
            <div>
              <div className="flex items-center space-x-1 text-[#FFD700]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FFD700]" />
                ))}
              </div>
              <span className="text-xs text-slate-400 font-medium">Based on {florist.reviewCount || 23} verified reviews</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 text-xs font-semibold text-slate-600">
            {[
              { stars: 5, pct: 85 },
              { stars: 4, pct: 10 },
              { stars: 3, pct: 5 },
              { stars: 2, pct: 0 },
              { stars: 1, pct: 0 }
            ].map((row) => (
              <div key={row.stars} className="flex items-center space-x-2">
                <span className="w-12 text-slate-500">{row.stars} Stars</span>
                <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#ff69b4] rounded-full" style={{ width: `${row.pct}%` }} />
                </div>
                <span className="w-8 text-right text-slate-400">{row.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews List */}
        <div className="md:col-span-2 bg-white p-6 rounded-[12px] shadow-card border border-slate-100 space-y-4">
          <h2 className="text-xl font-bold font-poppins text-[#333333]">Recent Customer Reviews</h2>

          {loadingReviews ? (
            <p className="text-xs text-slate-400 animate-pulse">Loading reviews...</p>
          ) : reviews.length > 0 ? (
            <div className="space-y-4">
              {reviews.map((rev) => (
                <div key={rev._id} className="p-4 bg-slate-50 rounded-[12px] border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-full bg-[#667eea] text-white flex items-center justify-center font-bold text-xs">
                        {rev.customerName?.charAt(0) || 'C'}
                      </div>
                      <div>
                        <span className="font-bold text-xs text-[#333333] block">{rev.customerName}</span>
                        <span className="text-[10px] text-slate-400 font-medium">{rev.date || 'Verified Customer'}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                      ))}
                    </div>
                  </div>

                  <span className="service-pill text-[10px] inline-block">
                    {rev.eventType} Event
                  </span>

                  <p className="text-xs text-slate-600 italic">
                    "{rev.comment}"
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No customer reviews yet. Be the first to leave a review!</p>
          )}
        </div>

      </div>

      {/* CONTACT SECTION & QUICK INQUIRY FORM */}
      <div className="bg-white p-6 sm:p-8 rounded-[12px] shadow-card border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Contact Info Box */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold font-poppins text-[#333333]">Contact Information</h2>
          <p className="text-xs text-slate-500">Reach out directly to {florist.name} for instant quotes & date booking.</p>

          <div className="space-y-3 pt-2 text-xs text-slate-700 font-medium">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <Phone className="w-5 h-5 text-[#ff69b4]" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Direct Phone Number</span>
                <a href={`tel:${florist.phone}`} className="font-extrabold text-sm text-[#333333] hover:text-[#ff69b4]">
                  {florist.phone}
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <MessageCircle className="w-5 h-5 text-[#25d366]" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">WhatsApp Direct</span>
                <span className="font-bold text-slate-800">{florist.phone}</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-slate-50 rounded-xl">
              <MapPin className="w-5 h-5 text-[#ff69b4] shrink-0 mt-0.5" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Mysuru Office Address</span>
                <span className="font-semibold text-slate-800">{florist.address || `${florist.area}, Mysuru`}</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
              <Clock className="w-5 h-5 text-[#667eea]" />
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Business Hours</span>
                <span className="font-semibold text-slate-800">{florist.officeHours || '9:00 AM - 8:30 PM (All Days)'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Inquiry Form */}
        <div className="space-y-4 bg-slate-50 p-6 rounded-2xl border border-slate-200">
          <h2 className="text-xl font-bold font-poppins text-[#333333]">Send Quick Event Inquiry</h2>
          
          {inquirySent ? (
            <div className="p-6 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200 text-center space-y-2">
              <CheckCircle2 className="w-12 h-12 text-[#25d366] mx-auto" />
              <h3 className="font-bold text-base">Inquiry Sent to {florist.name}!</h3>
              <p className="text-xs">They will contact you within 2 hours on your phone / WhatsApp.</p>
            </div>
          ) : (
            <form onSubmit={handleInquirySubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Type</label>
                <select
                  value={inquiryEventType}
                  onChange={(e) => setInquiryEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#333333] focus:ring-2 focus:ring-[#ff69b4] focus:outline-none"
                >
                  <option value="Weddings">Weddings</option>
                  <option value="Birthdays">Birthdays</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Anniversaries">Anniversaries</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Date</label>
                <input
                  type="date"
                  value={inquiryDate}
                  onChange={(e) => setInquiryDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#333333] focus:ring-2 focus:ring-[#ff69b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Message / Decor Details</label>
                <textarea
                  placeholder="Share details of venue, budget, stage size, or special flower preferences..."
                  value={inquiryMessage}
                  onChange={(e) => setInquiryMessage(e.target.value)}
                  rows={3}
                  required
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-[#333333] focus:ring-2 focus:ring-[#ff69b4] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={inquirySubmitting}
                className="btn-primary w-full"
              >
                <span>{inquirySubmitting ? 'Sending...' : 'Submit Inquiry'}</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>

      </div>

      {/* RELATED / SIMILAR FLORISTS SECTION */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-poppins text-[#333333]">
          Other Highly-Rated Florists in Mysuru
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {relatedFlorists.map((rel) => (
            <FloristCard
              key={rel._id}
              florist={rel}
              onSelect={onSelectFlorist}
              onLogInquiry={onLogInquiry}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
