import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Building2 } from 'lucide-react';

export default function FloristRegisterModal({ isOpen, onClose, onFloristRegistered }) {
  const [name, setName] = useState('');
  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [area, setArea] = useState('Gokulam');
  const [address, setAddress] = useState('');
  const [landmark, setLandmark] = useState('');
  const [pincode, setPincode] = useState('570002');
  const [googleMapsUrl, setGoogleMapsUrl] = useState('');
  const [officeHours, setOfficeHours] = useState('9:00 AM - 8:30 PM (Mon - Sat)');
  const [startingPrice, setStartingPrice] = useState(15000);
  const [maxPrice, setMaxPrice] = useState(150000);
  const [bio, setBio] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      const res = await fetch('/api/florists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          ownerName,
          phone,
          whatsappNumber: whatsappNumber || phone.replace(/\D/g, ''),
          area,
          address: address || `${area}, Mysuru`,
          landmark,
          pincode,
          googleMapsUrl,
          officeHours,
          startingPrice: Number(startingPrice),
          maxPrice: Number(maxPrice),
          bio: bio || 'Fresh flower decorator based in Mysuru.',
          coverImage: coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
          specialties: ['Weddings', 'Birthdays', 'Corporate', 'Anniversaries']
        })
      });

      if (res.ok) {
        setSuccess(true);
        onFloristRegistered();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2000);
      }
    } catch (err) {
      console.error('Error registering florist:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-[12px] max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-slate-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-[#333333]"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-[#ff69b4] font-bold text-xs">
          <Sparkles className="w-4 h-4" />
          <span>Join FlowerHub Mysuru Directory</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-bold font-poppins text-[#333333]">
          Register Decorator Shop & Office
        </h2>

        {success ? (
          <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#25d366] mx-auto" />
            <h3 className="font-bold text-lg text-emerald-900">Welcome to FlowerHub Mysuru!</h3>
            <p className="text-xs text-emerald-700">Your profile has been created.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Shop Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Chamundi Flower Decorators"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#ff69b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Owner Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Gowda"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#ff69b4] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Phone Number *</label>
                <input
                  type="text"
                  placeholder="+91 98450 12345"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#ff69b4] focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Area in Mysuru *</label>
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium focus:ring-2 focus:ring-[#ff69b4] focus:outline-none cursor-pointer"
                >
                  <option value="Gokulam">Gokulam</option>
                  <option value="Kuvempunagar">Kuvempunagar</option>
                  <option value="VV Mohalla">VV Mohalla</option>
                  <option value="Jayalakshmipuram">Jayalakshmipuram</option>
                  <option value="Saraswathipuram">Saraswathipuram</option>
                  <option value="Vijayanagar">Vijayanagar</option>
                  <option value="Hebbal">Hebbal</option>
                  <option value="Chamundipuram">Chamundipuram</option>
                </select>
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary"
              >
                {submitting ? 'Registering...' : 'Register Decorator'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
