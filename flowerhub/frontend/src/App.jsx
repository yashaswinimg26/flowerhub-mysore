import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import CustomerDiscovery from './components/CustomerDiscovery';
import FloristDetailPage from './components/FloristDetailPage';
import FloristDashboard from './components/FloristDashboard';
import FloristRegisterModal from './components/FloristRegisterModal';
import { Flower2, Heart, MapPin } from 'lucide-react';

export default function App() {
  const [florists, setFlorists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeMode, setActiveMode] = useState('customer'); // 'customer' | 'florist'
  const [selectedFloristForDetail, setSelectedFloristForDetail] = useState(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // Search & Filter state connected to Navbar & Homepage
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetchFlorists();
  }, []);

  const fetchFlorists = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/florists');
      if (res.ok) {
        const data = await res.json();
        setFlorists(data);
      }
    } catch (err) {
      console.error('Error fetching florists:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogInquiry = async (floristId, type) => {
    try {
      const res = await fetch('/api/analytics/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ floristId, type })
      });
      if (res.ok) {
        fetchFlorists();
        const actionLabel = type === 'whatsapp_inquiry' ? 'WhatsApp chat opened!' : 'Calling florist directly...';
        showToast(`Connecting with Mysuru decorator... ${actionLabel}`);
      }
    } catch (err) {
      console.error('Error logging inquiry:', err);
    }
  };

  const handleSelectFlorist = async (florist) => {
    setSelectedFloristForDetail(florist);
    try {
      await fetch(`/api/florists/${florist._id}`);
      fetchFlorists();
    } catch (err) {
      console.error('Error updating view count', err);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] text-[#333333] font-['Inter',sans-serif]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#333333] text-white px-5 py-3 rounded-2xl shadow-2xl border border-pink-400/40 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <Flower2 className="w-4 h-4 text-[#ff69b4]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeMode={activeMode}
        setActiveMode={(mode) => {
          setActiveMode(mode);
          if (mode === 'customer') setSelectedFloristForDetail(null);
        }}
        onOpenRegister={() => setShowRegisterModal(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {activeMode === 'customer' ? (
          selectedFloristForDetail ? (
            /* Page 2: Florist Detail Page */
            <FloristDetailPage
              florist={selectedFloristForDetail}
              allFlorists={florists}
              onBack={() => setSelectedFloristForDetail(null)}
              onSelectFlorist={handleSelectFlorist}
              onLogInquiry={handleLogInquiry}
            />
          ) : (
            /* Page 1: Homepage / Florist Discovery */
            <CustomerDiscovery
              florists={florists}
              loading={loading}
              onSelectFlorist={handleSelectFlorist}
              onLogInquiry={handleLogInquiry}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          )
        ) : (
          /* Florist Dashboard & Control Portal */
          <FloristDashboard
            florists={florists}
            onRefresh={fetchFlorists}
          />
        )}

      </main>

      {/* Florist Signup Modal */}
      <FloristRegisterModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onFloristRegistered={fetchFlorists}
      />

      {/* Footer */}
      <footer className="bg-[#333333] text-slate-300 text-xs py-10 border-t border-slate-700 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-[#ff69b4] flex items-center justify-center text-white font-bold text-lg shadow-md">
                🌸
              </div>
              <div>
                <span className="text-white font-extrabold text-lg font-poppins">FlowerHub Mysuru</span>
                <p className="text-[11px] text-slate-400">Discover & Connect with Flower Decorators in Mysuru</p>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-slate-300 font-medium">
              <button
                onClick={() => {
                  setActiveMode('customer');
                  setSelectedFloristForDetail(null);
                }}
                className="hover:text-[#ff69b4] transition-colors"
              >
                Homepage
              </button>
              <button
                onClick={() => setActiveMode('florist')}
                className="hover:text-[#ff69b4] transition-colors"
              >
                Florist Portal
              </button>
              <button
                onClick={() => setShowRegisterModal(true)}
                className="hover:text-[#ff69b4] transition-colors"
              >
                Register Shop
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-700 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#ff69b4]" />
              <span>Mysuru, Karnataka • Gokulam, Kuvempunagar, VV Mohalla & Jayalakshmipuram</span>
            </div>

            <div className="flex items-center space-x-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-[#ff69b4] fill-[#ff69b4] inline" />
              <span>for local flower artisans in Karnataka</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
