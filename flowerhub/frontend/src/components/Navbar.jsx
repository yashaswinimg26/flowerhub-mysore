import React from 'react';
import { Flower2, MapPin, Store, UserCheck, PlusCircle, Search } from 'lucide-react';

export default function Navbar({ 
  activeMode, 
  setActiveMode, 
  onOpenRegister, 
  searchQuery, 
  setSearchQuery, 
  selectedCategory, 
  setSelectedCategory 
}) {
  const CATEGORIES = [
    { label: 'All', value: 'All' },
    { label: 'Weddings', value: 'Weddings' },
    { label: 'Birthdays', value: 'Birthdays' },
    { label: 'Corporate', value: 'Corporate' },
    { label: 'Anniversaries', value: 'Anniversaries' }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between py-3.5 gap-3">
          
          {/* Logo + Mysuru Location */}
          <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-start">
            <div 
              className="flex items-center space-x-2.5 cursor-pointer"
              onClick={() => setActiveMode('customer')}
            >
              <div className="w-10 h-10 rounded-xl bg-[#ff69b4] flex items-center justify-center text-white shadow-md">
                <Flower2 className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <span className="font-extrabold text-xl tracking-tight text-[#333333] font-poppins">
                  FlowerHub <span className="text-[#ff69b4]">Mysuru</span>
                </span>
                <p className="text-[10px] text-slate-500 font-medium hidden sm:block">
                  Discover Flower Decorators in Mysuru
                </p>
              </div>
            </div>

            {/* Location Pill */}
            <div className="flex items-center space-x-1.5 px-3 py-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-[#ff69b4]" />
              <span>Mysuru, KA</span>
            </div>
          </div>

          {/* Search Bar in Header (for quick lookup) */}
          <div className="w-full md:w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by florist name, event type..."
              value={searchQuery || ''}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#ff69b4] focus:bg-white transition-all"
            />
          </div>

          {/* Mode Switcher & Register */}
          <div className="flex items-center space-x-2 shrink-0">
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs">
              <button
                onClick={() => setActiveMode('customer')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeMode === 'customer'
                    ? 'bg-[#ff69b4] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#333333]'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>Customer</span>
              </button>

              <button
                onClick={() => setActiveMode('florist')}
                className={`flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg font-bold transition-all ${
                  activeMode === 'florist'
                    ? 'bg-[#667eea] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#333333]'
                }`}
              >
                <Store className="w-3.5 h-3.5" />
                <span>Florist Portal</span>
              </button>
            </div>

            <button
              onClick={onOpenRegister}
              className="hidden lg:flex items-center space-x-1 px-3.5 py-2 bg-[#ff69b4] hover:bg-[#ff4da6] text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Join Decorator</span>
            </button>
          </div>

        </div>

        {/* Category Filters Row in Navbar */}
        {activeMode === 'customer' && (
          <div className="py-2.5 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pr-1">Filter:</span>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setSelectedCategory(cat.value)}
                className={`filter-pill ${selectedCategory === cat.value ? 'filter-pill-active' : ''}`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
