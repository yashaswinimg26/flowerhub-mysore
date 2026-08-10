import React, { useState, useMemo } from 'react';
import { Search, Filter, Sparkles, MapPin, CheckCircle, Flame, ArrowUpDown } from 'lucide-react';
import FloristCard from './FloristCard';

const MYSURU_AREAS = [
  'All Mysuru',
  'Gokulam',
  'Kuvempunagar',
  'VV Mohalla',
  'Jayalakshmipuram',
  'Saraswathipuram',
  'Vijayanagar',
  'Hebbal',
  'Chamundipuram'
];

export default function CustomerDiscovery({ 
  florists, 
  loading, 
  onSelectFlorist, 
  onLogInquiry,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory
}) {
  const [selectedArea, setSelectedArea] = useState('All Mysuru');
  const [sortBy, setSortBy] = useState('rating'); // 'rating' | 'views' | 'newest'
  const [maxPriceFilter, setMaxPriceFilter] = useState(300000);

  // Filter & Sort florists dynamically
  const filteredFlorists = useMemo(() => {
    let result = florists.filter(f => {
      if (selectedCategory !== 'All') {
        if (!f.specialties?.includes(selectedCategory)) return false;
      }
      if (selectedArea !== 'All Mysuru') {
        if (f.area !== selectedArea) return false;
      }
      if (f.startingPrice > maxPriceFilter) return false;

      if (searchQuery && searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const nameMatch = f.name?.toLowerCase().includes(q);
        const ownerMatch = f.ownerName?.toLowerCase().includes(q);
        const areaMatch = f.area?.toLowerCase().includes(q);
        const bioMatch = f.bio?.toLowerCase().includes(q);
        const specMatch = f.specialties?.some(s => s.toLowerCase().includes(q));
        if (!nameMatch && !ownerMatch && !areaMatch && !bioMatch && !specMatch) return false;
      }

      return true;
    });

    if (sortBy === 'rating') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'views') {
      result.sort((a, b) => (b.views || 0) - (a.views || 0));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    }

    return result;
  }, [florists, selectedCategory, selectedArea, maxPriceFilter, searchQuery, sortBy]);

  // Featured / Trending this week florists
  const trendingFlorists = useMemo(() => {
    return florists.filter(f => f.featured || f.rating >= 4.8).slice(0, 3);
  }, [florists]);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Hero Section */}
      <div className="relative rounded-[16px] overflow-hidden bg-gradient-to-r from-[#667eea] via-purple-600 to-[#ff69b4] text-white p-8 sm:p-14 shadow-lg">
        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Verified Local Flower Decorators in Mysuru</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-poppins leading-tight">
            Find the Perfect Flower Decorator for Your Special Moment
          </h1>

          <p className="text-white/90 text-sm sm:text-base font-medium max-w-2xl leading-relaxed">
            Browse real portfolios, transparent price estimates, and direct WhatsApp contact for Weddings, Birthdays, Corporate events & Anniversaries across Mysuru.
          </p>
        </div>
      </div>

      {/* "Trending This Week" Featured Section */}
      {trendingFlorists.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold font-poppins text-[#333333] flex items-center space-x-2">
              <Flame className="w-6 h-6 text-[#ff69b4]" />
              <span>Trending Decorators This Week</span>
            </h2>
            <span className="text-xs font-semibold text-[#ff69b4] bg-pink-50 px-3 py-1 rounded-full border border-pink-100">
              Top Rated in Mysuru
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {trendingFlorists.map((florist) => (
              <FloristCard
                key={`trending-${florist._id}`}
                florist={florist}
                onSelect={onSelectFlorist}
                onLogInquiry={onLogInquiry}
              />
            ))}
          </div>
        </div>
      )}

      {/* Search, Area Filter & Sort Bar */}
      <div className="bg-white p-5 rounded-[12px] shadow-card border border-slate-100 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by florist name, event type or area..."
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[8px] text-xs sm:text-sm font-medium text-[#333333] focus:ring-2 focus:ring-[#ff69b4] focus:outline-none"
            />
          </div>

          {/* Area Selector */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-[#ff69b4] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-[8px] text-xs sm:text-sm font-semibold text-[#333333] focus:ring-2 focus:ring-[#ff69b4] focus:outline-none cursor-pointer appearance-none"
            >
              {MYSURU_AREAS.map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>
          </div>

          {/* Sort By Dropdown */}
          <div className="md:col-span-4 relative">
            <ArrowUpDown className="w-4 h-4 text-[#667eea] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-[8px] text-xs sm:text-sm font-semibold text-[#333333] focus:ring-2 focus:ring-[#ff69b4] focus:outline-none cursor-pointer appearance-none"
            >
              <option value="rating">Sort by Rating (High to Low)</option>
              <option value="views">Sort by Most Viewed</option>
              <option value="newest">Sort by Newest Listed</option>
            </select>
          </div>

        </div>

        {/* Filter Summary Row */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-500 font-medium">
          <div>
            Showing <span className="font-bold text-[#333333]">{filteredFlorists.length}</span> flower decorators in Mysuru
          </div>

          {(selectedCategory !== 'All' || selectedArea !== 'All Mysuru' || searchQuery !== '') && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedArea('All Mysuru');
                setSearchQuery('');
              }}
              className="text-[#ff69b4] font-bold hover:underline"
            >
              Reset All Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Florists Grid (3 columns on desktop, 1 on mobile) */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold font-poppins text-[#333333]">
          All Flower Decorators in Mysuru
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-slate-200 animate-pulse rounded-[12px]" />
            ))}
          </div>
        ) : filteredFlorists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredFlorists.map((florist) => (
              <FloristCard
                key={florist._id}
                florist={florist}
                onSelect={onSelectFlorist}
                onLogInquiry={onLogInquiry}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-[12px] p-12 text-center border border-dashed border-slate-300 space-y-4">
            <div className="w-16 h-16 bg-pink-100 text-[#ff69b4] rounded-full flex items-center justify-center mx-auto text-2xl">
              🌸
            </div>
            <h3 className="font-bold text-xl text-[#333333]">No flower decorators found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try clearing your search query or selecting "All Mysuru" to see available decorators.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSelectedArea('All Mysuru');
                setSearchQuery('');
              }}
              className="btn-primary inline-flex"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

    </div>
  );
}
