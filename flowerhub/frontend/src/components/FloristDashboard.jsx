import React, { useState, useEffect } from 'react';
import { Eye, MessageCircle, Phone, Star, TrendingUp, Plus, Trash2, CheckCircle2, Building2, MapPin, Clock, Sparkles, DollarSign } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, BarChart, Bar, Cell } from 'recharts';

export default function FloristDashboard({ florists, onRefresh }) {
  const [selectedFloristId, setSelectedFloristId] = useState('');
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Add Photo Modal state
  const [showAddPhoto, setShowAddPhoto] = useState(false);
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoTitle, setPhotoTitle] = useState('');
  const [photoCategory, setPhotoCategory] = useState('Weddings');
  const [photoPrice, setPhotoPrice] = useState('');
  const [submittingPhoto, setSubmittingPhoto] = useState(false);

  // Quick edit price state
  const [showEditPrice, setShowEditPrice] = useState(false);
  const [newStartingPrice, setNewStartingPrice] = useState('');
  const [newMaxPrice, setNewMaxPrice] = useState('');

  // Office Address Settings state
  const [showEditOffice, setShowEditOffice] = useState(false);
  const [officeAddress, setOfficeAddress] = useState('');
  const [officeLandmark, setOfficeLandmark] = useState('');
  const [officePincode, setOfficePincode] = useState('');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [officeHours, setOfficeHours] = useState('');
  const [savingOffice, setSavingOffice] = useState(false);

  useEffect(() => {
    if (florists && florists.length > 0 && !selectedFloristId) {
      setSelectedFloristId(florists[0]._id);
    }
  }, [florists]);

  useEffect(() => {
    if (selectedFloristId) {
      fetchAnalytics(selectedFloristId);
    }
  }, [selectedFloristId]);

  const fetchAnalytics = async (id) => {
    try {
      setLoadingAnalytics(true);
      const res = await fetch(`/api/analytics/florist/${id}`);
      if (res.ok) {
        const data = await res.json();
        setAnalytics(data);
      }
    } catch (err) {
      console.error('Error loading florist analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  };

  const currentFlorist = florists.find(f => f._id === selectedFloristId) || florists[0];

  const handleAddPhotoSubmit = async (e) => {
    e.preventDefault();
    if (!photoUrl) return;

    try {
      setSubmittingPhoto(true);
      const res = await fetch(`/api/florists/${selectedFloristId}/portfolio`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          url: photoUrl,
          title: photoTitle || 'Fresh Decoration Photo',
          category: photoCategory,
          price: photoPrice ? Number(photoPrice) : currentFlorist.startingPrice
        })
      });

      if (res.ok) {
        setShowAddPhoto(false);
        setPhotoUrl('');
        setPhotoTitle('');
        setPhotoPrice('');
        onRefresh();
        fetchAnalytics(selectedFloristId);
      }
    } catch (err) {
      console.error('Failed to add photo', err);
    } finally {
      setSubmittingPhoto(false);
    }
  };

  const handleDeletePhoto = async (photoId) => {
    if (!window.confirm('Delete this photo from your portfolio?')) return;
    try {
      const res = await fetch(`/api/florists/${selectedFloristId}/portfolio/${photoId}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onRefresh();
        fetchAnalytics(selectedFloristId);
      }
    } catch (err) {
      console.error('Failed to delete photo', err);
    }
  };

  const handleUpdatePriceSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/florists/${selectedFloristId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          startingPrice: Number(newStartingPrice || currentFlorist.startingPrice),
          maxPrice: Number(newMaxPrice || currentFlorist.maxPrice)
        })
      });
      if (res.ok) {
        setShowEditPrice(false);
        onRefresh();
        fetchAnalytics(selectedFloristId);
      }
    } catch (err) {
      console.error('Failed to update price', err);
    }
  };

  const handleUpdateOfficeSubmit = async (e) => {
    e.preventDefault();
    try {
      setSavingOffice(true);
      const res = await fetch(`/api/florists/${selectedFloristId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: officeAddress,
          landmark: officeLandmark,
          pincode: officePincode,
          googleMapsUrl: googleMapsUrl,
          officeHours: officeHours
        })
      });
      if (res.ok) {
        setShowEditOffice(false);
        onRefresh();
      }
    } catch (err) {
      console.error('Failed to update office address', err);
    } finally {
      setSavingOffice(false);
    }
  };

  const openOfficeEditModal = () => {
    setOfficeAddress(currentFlorist.address || '');
    setOfficeLandmark(currentFlorist.landmark || '');
    setOfficePincode(currentFlorist.pincode || '570001');
    setGoogleMapsUrl(currentFlorist.googleMapsUrl || '');
    setOfficeHours(currentFlorist.officeHours || '9:00 AM - 8:30 PM');
    setShowEditOffice(true);
  };

  if (!currentFlorist) return null;

  const eventBarData = analytics?.eventTypeCounts
    ? Object.entries(analytics.eventTypeCounts).map(([name, count]) => ({ name, count }))
    : [];

  const BAR_COLORS = ['#ff69b4', '#25d366', '#667eea', '#FFD700', '#EC4899', '#3B82F6'];

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs text-[#ff69b4] font-bold mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Florist Business Control Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-poppins text-[#333333]">
            {currentFlorist.name}
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Area: {currentFlorist.area}, Mysuru • Owner: {currentFlorist.ownerName}
          </p>
        </div>

        {/* Account Switcher */}
        <div className="w-full md:w-auto bg-slate-50 p-3 rounded-xl border border-slate-200">
          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
            Switch Florist Profile:
          </label>
          <select
            value={selectedFloristId}
            onChange={(e) => setSelectedFloristId(e.target.value)}
            className="w-full bg-white text-xs font-bold text-[#333333] px-3 py-2 rounded-lg border border-slate-300 focus:outline-none cursor-pointer"
          >
            {florists.map(f => (
              <option key={f._id} value={f._id}>
                {f.name} ({f.area})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-gradient-to-br from-[#ff69b4] to-pink-600 text-white p-6 rounded-[12px] shadow-md relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-pink-100 block">Profile Views</span>
          <div className="text-4xl font-extrabold font-poppins mt-2">{currentFlorist.views || 0}</div>
          <p className="text-[11px] text-pink-100 mt-2 font-medium">From Mysuru customers this month</p>
        </div>

        <div className="bg-gradient-to-br from-[#25d366] to-emerald-600 text-white p-6 rounded-[12px] shadow-md relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-100 block">WhatsApp Inquiries</span>
          <div className="text-4xl font-extrabold font-poppins mt-2">{currentFlorist.whatsappInquiries || 0}</div>
          <p className="text-[11px] text-emerald-100 mt-2 font-medium">Direct customer chats</p>
        </div>

        <div className="bg-gradient-to-br from-[#667eea] to-indigo-600 text-white p-6 rounded-[12px] shadow-md relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-100 block">Direct Calls</span>
          <div className="text-4xl font-extrabold font-poppins mt-2">{currentFlorist.callInquiries || 0}</div>
          <p className="text-[11px] text-indigo-100 mt-2 font-medium">Phone lead inquiries</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white p-6 rounded-[12px] shadow-md relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-100 block">Customer Rating</span>
          <div className="text-4xl font-extrabold font-poppins mt-2 flex items-center space-x-1">
            <span>{currentFlorist.rating}</span>
            <Star className="w-6 h-6 fill-[#FFD700] text-[#FFD700]" />
          </div>
          <p className="text-[11px] text-amber-100 mt-2 font-medium">Based on {currentFlorist.reviewCount} reviews</p>
        </div>
      </div>

      {/* Office Settings */}
      <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-card space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="font-bold text-lg text-[#333333] font-poppins">Office Address & Visiting Hours</h3>
            <p className="text-xs text-slate-500">Customers can view your address to visit your office in person.</p>
          </div>

          <button
            onClick={openOfficeEditModal}
            className="btn-primary"
          >
            <MapPin className="w-4 h-4" />
            <span>Update Address & Hours</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="font-bold text-slate-400 block uppercase text-[10px]">Street Address</span>
            <span className="font-extrabold text-[#333333] block text-sm">{currentFlorist.address || `${currentFlorist.area}, Mysuru`}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="font-bold text-slate-400 block uppercase text-[10px]">Landmark</span>
            <span className="font-extrabold text-[#333333] block text-sm">{currentFlorist.landmark || 'Not specified'}</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl space-y-1">
            <span className="font-bold text-slate-400 block uppercase text-[10px]">Visiting Hours</span>
            <span className="font-extrabold text-[#333333] block text-sm">{currentFlorist.officeHours || '9:00 AM - 8:30 PM'}</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-card space-y-4">
          <h3 className="font-bold text-base text-[#333333] font-poppins flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-[#ff69b4]" />
            <span>Monthly Views & Inquiries Trend</span>
          </h3>

          <div className="h-64 w-full">
            {analytics?.monthlyTrends ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={analytics.monthlyTrends}>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={12} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip />
                  <Area type="monotone" dataKey="views" stroke="#ff69b4" fill="#ff69b4" fillOpacity={0.2} strokeWidth={3} name="Profile Views" />
                  <Area type="monotone" dataKey="inquiries" stroke="#25d366" fill="#25d366" fillOpacity={0.2} strokeWidth={3} name="Inquiries" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading trend...</div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-[12px] border border-slate-100 shadow-card space-y-4">
          <h3 className="font-bold text-base text-[#333333] font-poppins flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#667eea]" />
            <span>Trending Event Demand in Mysuru</span>
          </h3>

          <div className="h-64 w-full">
            {eventBarData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eventBarData}>
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {eventBarData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">Loading demand...</div>
            )}
          </div>
        </div>
      </div>

      {/* Portfolio Gallery Manager */}
      <div className="bg-white p-6 sm:p-8 rounded-[12px] border border-slate-100 shadow-card space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-xl font-poppins text-[#333333]">Active Portfolio Photos</h3>
            <p className="text-xs text-slate-500">Customers see these photos when browsing your profile.</p>
          </div>

          <button
            onClick={() => setShowAddPhoto(true)}
            className="btn-primary"
          >
            <Plus className="w-4 h-4" />
            <span>Add Photo</span>
          </button>
        </div>

        {currentFlorist.portfolio && currentFlorist.portfolio.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentFlorist.portfolio.map((photo) => (
              <div key={photo.id || photo._id} className="group relative bg-slate-50 rounded-[8px] overflow-hidden border border-slate-200 flex flex-col">
                <div className="aspect-square overflow-hidden bg-slate-200 relative">
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  
                  <button
                    onClick={() => handleDeletePhoto(photo.id)}
                    className="absolute top-2 right-2 p-2 bg-rose-600 text-white rounded-full opacity-90 hover:opacity-100 hover:scale-110 shadow-md transition-all"
                    title="Delete photo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="service-pill text-[10px]">
                      {photo.category || 'Weddings'}
                    </span>
                    <h4 className="font-bold text-sm text-[#333333] mt-1">{photo.title}</h4>
                  </div>

                  <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">Price:</span>
                    <span className="font-extrabold text-[#ff69b4]">₹{photo.price?.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 italic">No photos added yet.</p>
        )}
      </div>

    </div>
  );
}
