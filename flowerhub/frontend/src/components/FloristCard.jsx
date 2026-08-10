import React, { useState } from 'react';
import { Star, MapPin, Phone, MessageCircle, Clock, ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export default function FloristCard({ florist, onSelect, onLogInquiry }) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Collect 3-4 photos for carousel
  const photos = florist.portfolio && florist.portfolio.length > 0 
    ? [florist.coverImage, ...florist.portfolio.slice(0, 3).map(p => p.url)]
    : [florist.coverImage];

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActivePhotoIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleWhatsAppClick = (e) => {
    e.stopPropagation();
    onLogInquiry(florist._id, 'whatsapp_inquiry');
    const msg = encodeURIComponent(`Hi ${florist.name}, I saw your profile on FlowerHub Mysuru. I want to inquire about availability & pricing for my event.`);
    window.open(`https://wa.me/${florist.whatsappNumber}?text=${msg}`, '_blank');
  };

  const handleViewProfileClick = (e) => {
    e.stopPropagation();
    onSelect(florist);
  };

  return (
    <div 
      onClick={handleViewProfileClick}
      className="group bg-white rounded-[12px] p-5 shadow-card hover:shadow-cardHover border border-slate-100 hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col justify-between h-full"
    >
      <div>
        {/* Portfolio Image Carousel */}
        <div className="relative aspect-square w-full rounded-[8px] overflow-hidden bg-slate-100 mb-4 group/img">
          <img 
            src={photos[activePhotoIndex]} 
            alt={florist.name} 
            className="w-full h-full object-cover group-hover/img:scale-105 group-hover/img:brightness-105 transition-all duration-300"
          />

          {/* Carousel Arrows (if multiple photos) */}
          {photos.length > 1 && (
            <>
              <button
                onClick={handlePrevPhoto}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextPhoto}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-2 inset-x-0 flex justify-center space-x-1">
                {photos.map((_, idx) => (
                  <span
                    key={idx}
                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                      activePhotoIndex === idx ? 'bg-[#ff69b4] w-4' : 'bg-white/70'
                    }`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex items-center space-x-1.5 pointer-events-none">
            {florist.featured && (
              <span className="px-2.5 py-1 bg-[#ff69b4] text-white text-[10px] font-extrabold rounded-full shadow-md flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-white" />
                <span>Featured</span>
              </span>
            )}
          </div>
        </div>

        {/* Florist Info */}
        <div className="space-y-2.5">
          <div className="flex items-start justify-between">
            <h3 className="font-extrabold text-lg text-[#333333] leading-snug group-hover:text-[#ff69b4] transition-colors">
              {florist.name}
            </h3>
          </div>

          {/* Rating & Reviews */}
          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700">
            <span className="text-[#FFD700] text-sm">⭐</span>
            <span className="font-bold text-[#333333]">{florist.rating}</span>
            <span className="text-slate-400">({florist.reviewCount || 23} reviews)</span>
          </div>

          {/* Services Offered Pills */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {florist.specialties?.map((service, idx) => (
              <span key={idx} className="service-pill">
                {service}
              </span>
            ))}
          </div>

          {/* Location & Response Time */}
          <div className="pt-2 flex items-center justify-between text-xs text-slate-500 font-medium">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#ff69b4]" />
              <span>{florist.area}, Mysuru</span>
            </div>

            <div className="flex items-center space-x-1 text-slate-400">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{florist.responseTime || 'Within 2 hours'}</span>
            </div>
          </div>

          {/* Estimated Price Range */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium">Estimated Pricing:</span>
            <span className="font-extrabold text-[#ff69b4] text-sm">
              ₹{florist.startingPrice?.toLocaleString('en-IN')} - ₹{florist.maxPrice?.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Buttons Row (48px height each) */}
      <div className="grid grid-cols-2 gap-2.5 pt-4 mt-2">
        <button
          onClick={handleViewProfileClick}
          className="btn-primary"
        >
          <span>View Profile</span>
          <ArrowRight className="w-4 h-4" />
        </button>

        <button
          onClick={handleWhatsAppClick}
          className="btn-whatsapp"
        >
          <MessageCircle className="w-4 h-4" />
          <span>WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
