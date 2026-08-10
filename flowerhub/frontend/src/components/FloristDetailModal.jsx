import React, { useState, useEffect } from 'react';
import { X, Star, MapPin, Phone, MessageCircle, CheckCircle2, Send, Image as ImageIcon, Sparkles, Building2, Navigation, Clock } from 'lucide-react';

export default function FloristDetailModal({ florist, onClose, onLogInquiry }) {
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const [newCustomerName, setNewCustomerName] = useState('');
  const [newRating, setNewRating] = useState(5);
  const [newEventType, setNewEventType] = useState('Wedding');
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  useEffect(() => {
    if (florist) {
      fetchReviews();
      if (florist.portfolio && florist.portfolio.length > 0) {
        setSelectedPhoto(florist.portfolio[0].url);
      } else {
        setSelectedPhoto(florist.coverImage);
      }
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
      console.error('Failed to fetch reviews', err);
    } finally {
      setLoadingReviews(false);
    }
  };

  const handleWhatsAppClick = () => {
    onLogInquiry(florist._id, 'whatsapp_inquiry');
    const msg = encodeURIComponent(`Hi ${florist.name}, I am looking at your portfolio photos on FlowerHub Mysuru. Can you share availability for my ${newEventType} event?`);
    window.open(`https://wa.me/${florist.whatsappNumber}?text=${msg}`, '_blank');
  };

  const handleCallClick = () => {
    onLogInquiry(florist._id, 'call_inquiry');
    window.location.href = `tel:${florist.phone.replace(/\s+/g, '')}`;
  };

  const handleOpenMaps = () => {
    if (florist.googleMapsUrl) {
      window.open(florist.googleMapsUrl, '_blank');
    } else {
      const query = encodeURIComponent(`${florist.name}, ${florist.address}, ${florist.area}, Mysuru, Karnataka`);
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newCustomerName || !newComment) return;

    try {
      setSubmittingReview(true);
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          floristId: florist._id,
          customerName: newCustomerName,
          rating: Number(newRating),
          eventType: newEventType,
          comment: newComment
        })
      });

      if (res.ok) {
        setReviewSuccess(true);
        setNewCustomerName('');
        setNewComment('');
        fetchReviews();
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Error submitting review:', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (!florist) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-[#0B0514]/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-[#160B29] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-purple-500/30 shadow-2xl flex flex-col relative text-white">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-all border border-purple-500/20"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Photo Lightbox */}
        <div className="relative h-72 sm:h-96 bg-slate-950 overflow-hidden shrink-0">
          <img
            src={selectedPhoto || florist.coverImage}
            alt={florist.name}
            className="w-full h-full object-contain sm:object-cover transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#160B29] via-transparent to-black/40" />

          {/* Details Overlay */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center space-x-2 mb-1">
              <span className="px-3 py-0.5 bg-purple-600 text-white text-[11px] font-bold rounded-full">
                {florist.area}, Mysuru
              </span>
              <div className="flex items-center space-x-1 bg-black/70 px-2.5 py-0.5 rounded-full text-xs font-bold text-amber-300 backdrop-blur-md border border-purple-500/20">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{florist.rating}</span>
                <span className="text-white font-normal">({florist.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight drop-shadow-md">
              {florist.name}
            </h2>
            <p className="text-xs text-purple-200 mt-1 font-medium">
              Owner: {florist.ownerName} • {florist.experienceYears} Years Decorating in Mysuru
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 space-y-8">
          
          {/* Pricing & Quick Action Row */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 bg-purple-950/60 rounded-2xl border border-purple-500/30">
            <div>
              <span className="text-xs font-bold text-purple-300/80 uppercase tracking-wider block">Estimated Price Tiers</span>
              <span className="text-2xl font-black text-amber-400">
                ₹{florist.startingPrice?.toLocaleString('en-IN')} <span className="text-sm font-semibold text-purple-200">to</span> ₹{florist.maxPrice?.toLocaleString('en-IN')}
              </span>
              <span className="text-[11px] text-purple-300/60 block mt-0.5">*Includes fresh flowers, transportation in Mysuru & stage setup</span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={handleWhatsAppClick}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={handleCallClick}
                className="flex-1 sm:flex-initial flex items-center justify-center space-x-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
              >
                <Phone className="w-4 h-4" />
                <span>Call Florist</span>
              </button>
            </div>
          </div>

          {/* Office Location & Visiting Directions */}
          <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-purple-950 p-6 rounded-3xl border border-purple-500/30 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-purple-500/20 pb-3">
              <div className="flex items-center space-x-2">
                <Building2 className="w-6 h-6 text-amber-400" />
                <div>
                  <h3 className="font-extrabold text-base sm:text-lg text-white">Visit Decorator Office in Mysuru</h3>
                  <p className="text-xs text-purple-200">Visit their office in person to discuss design catalogs & flower samples</p>
                </div>
              </div>

              <button
                onClick={handleOpenMaps}
                className="flex items-center justify-center space-x-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-md transition-all shrink-0"
              >
                <Navigation className="w-4 h-4" />
                <span>Google Maps Directions</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-purple-100">
              <div className="space-y-1 bg-black/40 p-3.5 rounded-2xl border border-purple-500/20">
                <span className="font-bold text-purple-300 block uppercase text-[10px] tracking-wider">Office Street Address</span>
                <span className="font-semibold text-white block">{florist.address || `${florist.area}, Mysuru`}</span>
                <span className="text-[11px] text-purple-300/70">{florist.area}, Mysuru - {florist.pincode || '570001'}</span>
              </div>

              <div className="space-y-1 bg-black/40 p-3.5 rounded-2xl border border-purple-500/20">
                <span className="font-bold text-purple-300 block uppercase text-[10px] tracking-wider">Nearby Landmark</span>
                <span className="font-semibold text-white block">{florist.landmark || 'Located centrally in Mysuru'}</span>
              </div>

              <div className="space-y-1 bg-black/40 p-3.5 rounded-2xl border border-purple-500/20">
                <span className="font-bold text-purple-300 block uppercase text-[10px] tracking-wider">Visiting Hours</span>
                <div className="flex items-center space-x-1.5 font-semibold text-white">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span>{florist.officeHours || '9:00 AM - 8:30 PM'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Photo Gallery Grid */}
          <div className="space-y-3">
            <h3 className="font-bold text-base text-white flex items-center space-x-2">
              <ImageIcon className="w-4 h-4 text-purple-400" />
              <span>Decoration Gallery ({florist.portfolio?.length || 0} Photos)</span>
            </h3>

            {florist.portfolio && florist.portfolio.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {florist.portfolio.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedPhoto(item.url)}
                    className={`relative h-24 sm:h-28 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${
                      selectedPhoto === item.url ? 'border-amber-400 scale-105 shadow-lg' : 'border-purple-500/20 hover:opacity-90'
                    }`}
                  >
                    <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 inset-x-0 bg-black/70 p-1 text-[10px] text-white truncate font-medium">
                      {item.title}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-purple-300/60 italic">No additional portfolio photos uploaded yet.</p>
            )}
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-4 pt-4 border-t border-purple-500/20">
            <h3 className="font-bold text-lg text-white flex items-center justify-between">
              <span>Customer Reviews ({reviews.length})</span>
              <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
                {florist.rating} ★ Average
              </span>
            </h3>

            {/* Write a review form */}
            <form onSubmit={handleSubmitReview} className="bg-purple-950/60 p-4 rounded-2xl border border-purple-500/30 space-y-3">
              <span className="font-bold text-xs text-purple-200 block">Write a Review for {florist.name}</span>
              
              {reviewSuccess && (
                <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-500/30 text-xs font-bold rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Thank you! Your review has been saved and ratings updated.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Your Name (e.g. Anand, Kuvempunagar)"
                  value={newCustomerName}
                  onChange={(e) => setNewCustomerName(e.target.value)}
                  required
                  className="px-3 py-2 bg-[#160B29] border border-purple-500/30 rounded-xl text-xs font-medium text-white placeholder-purple-300/40 focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />

                <select
                  value={newEventType}
                  onChange={(e) => setNewEventType(e.target.value)}
                  className="px-3 py-2 bg-[#160B29] border border-purple-500/30 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Haldi/Mehendi">Haldi/Mehendi</option>
                  <option value="Gruhapravesha">Gruhapravesha</option>
                  <option value="Temple Puja">Temple Puja</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                </select>

                <select
                  value={newRating}
                  onChange={(e) => setNewRating(Number(e.target.value))}
                  className="px-3 py-2 bg-[#160B29] border border-purple-500/30 rounded-xl text-xs font-medium text-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
                >
                  <option value="5">⭐⭐⭐⭐⭐ (5 Stars - Outstanding)</option>
                  <option value="4">⭐⭐⭐⭐ (4 Stars - Very Good)</option>
                  <option value="3">⭐⭐⭐ (3 Stars - Good)</option>
                </select>
              </div>

              <textarea
                placeholder="Share details of your office visit, flower freshness, and stage work..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                required
                rows={2}
                className="w-full px-3 py-2 bg-[#160B29] border border-purple-500/30 rounded-xl text-xs font-medium text-white placeholder-purple-300/40 focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />

              <button
                type="submit"
                disabled={submittingReview}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 transition-all shadow-md"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReview ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </form>

            {/* List of existing reviews */}
            <div className="space-y-3">
              {loadingReviews ? (
                <p className="text-xs text-purple-300/40 animate-pulse">Loading customer reviews...</p>
              ) : reviews.length > 0 ? (
                reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-purple-950/40 rounded-2xl border border-purple-500/20 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-purple-100">{rev.customerName}</span>
                      <div className="flex items-center space-x-1">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded font-semibold inline-block border border-amber-400/20">
                      {rev.eventType} Event
                    </span>
                    <p className="text-xs text-purple-200/80 italic">"{rev.comment}"</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-purple-300/60 italic">No customer reviews yet. Be the first to leave a review!</p>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
