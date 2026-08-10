import React, { useState, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Float, PerspectiveCamera } from '@react-three/drei';
import FloralArrangement from './FloralArrangement';
import { Sparkles, Camera, MessageCircle, RotateCcw, Box, CheckCircle2 } from 'lucide-react';

const FLOWER_OPTIONS = [
  { id: 'rose', label: 'Red Rose (Gulabi)', price: 80, color: 'bg-rose-600', icon: '🌹' },
  { id: 'sunflower', label: 'Sunflower (Suryakanti)', price: 120, color: 'bg-amber-500', icon: '🌻' },
  { id: 'lily', label: 'Blush Lily', price: 150, color: 'bg-pink-400', icon: '🌸' },
  { id: 'orchid', label: 'Royal Purple Orchid', price: 220, color: 'bg-purple-600', icon: '🪻' },
  { id: 'jasmine', label: 'Mysuru Mallige (Jasmine)', price: 60, color: 'bg-slate-200', icon: '🌼' },
  { id: 'tulip', label: 'Violet Tulip', price: 140, color: 'bg-indigo-600', icon: '🌷' }
];

const VASE_OPTIONS = [
  { id: 'modern_ceramic', label: 'Modern Ceramic (Lavender)', price: 1200 },
  { id: 'crystal_glass', label: 'Crystal Clear Glass', price: 800 },
  { id: 'royal_gold', label: 'Royal Mysuru Gold Brass', price: 2500 },
  { id: 'classic_porcelain', label: 'Classic Porcelain', price: 1500 },
  { id: 'rustic_terracotta', label: 'Rustic Terracotta', price: 600 }
];

const ARRANGEMENT_STYLES = [
  { id: 'tall', label: 'Tall Pyramid', fee: 500, desc: 'High central bloom height' },
  { id: 'wide', label: 'Wide Cascading', fee: 800, desc: 'Side-spreading lush fan' },
  { id: 'compact', label: 'Compact Dome', fee: 400, desc: 'Dense round floral sphere' },
  { id: 'asymmetric', label: 'Asymmetric Modern', fee: 1000, desc: 'Sculptural offset angles' }
];

export default function FlowerStudio({ florists, onLogInquiry }) {
  const [primaryFlower, setPrimaryFlower] = useState('rose');
  const [secondaryFlower, setSecondaryFlower] = useState('jasmine');
  const [stemCount, setStemCount] = useState(12);
  const [arrangementStyle, setArrangementStyle] = useState('wide');
  const [vaseStyle, setVaseStyle] = useState('modern_ceramic');
  const [selectedFloristId, setSelectedFloristId] = useState(florists[0]?._id || '');
  const [toastMessage, setToastMessage] = useState(null);

  const controlsRef = useRef(null);
  const selectedFlorist = florists.find(f => f._id === selectedFloristId) || florists[0];

  const flowerItem = FLOWER_OPTIONS.find(f => f.id === primaryFlower) || FLOWER_OPTIONS[0];
  const vaseItem = VASE_OPTIONS.find(v => v.id === vaseStyle) || VASE_OPTIONS[0];
  const styleItem = ARRANGEMENT_STYLES.find(s => s.id === arrangementStyle) || ARRANGEMENT_STYLES[0];

  const flowersTotal = flowerItem.price * stemCount;
  const vaseTotal = vaseItem.price;
  const craftFee = styleItem.fee;
  const grandTotal = flowersTotal + vaseTotal + craftFee;

  const handleTakeSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `FlowerHub-3D-Arrangement-${primaryFlower}.png`;
      link.click();
      showToast('3D Arrangement Screenshot Saved!');
    }
  };

  const handleResetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  const handleSendWhatsAppOrder = () => {
    if (selectedFlorist) {
      onLogInquiry(selectedFlorist._id, 'whatsapp_inquiry');
      const text = encodeURIComponent(
        `Hi ${selectedFlorist.name}, I designed a custom 3D flower arrangement on FlowerHub Mysuru!\n\n` +
        `🌸 Primary Flower: ${flowerItem.label}\n` +
        `💐 Stem Count: ${stemCount} Stems\n` +
        `🎀 Arrangement Style: ${styleItem.label}\n` +
        `🏺 Vase: ${vaseItem.label}\n` +
        `💰 Est. Total Price: ₹${grandTotal.toLocaleString('en-IN')}\n\n` +
        `Can you confirm availability & timeline for this arrangement?`
      );
      window.open(`https://wa.me/${selectedFlorist.whatsappNumber}?text=${text}`, '_blank');
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="space-y-6 pb-16 text-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 bg-[#160B29] text-white px-5 py-3 rounded-2xl shadow-2xl border border-purple-500/40 text-xs font-bold flex items-center space-x-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-[#160B29] to-indigo-950 p-6 sm:p-8 border border-purple-500/20 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-amber-300 text-xs font-bold mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Interactive 3D Floral Studio</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tight">
            3D Flower Arrangement Preview
          </h1>
          <p className="text-xs sm:text-sm text-purple-200/80 mt-1 max-w-xl">
            Rotate, zoom & customize vases, flower stems, and arrangement styles in real-time before ordering from Mysuru decorators.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handleTakeSnapshot}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white font-bold text-xs rounded-xl shadow-lg transition-all hover:scale-105"
          >
            <Camera className="w-4 h-4 text-amber-300" />
            <span>Take 3D Screenshot</span>
          </button>
        </div>
      </div>

      {/* Main 3D Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: 3D Interactive Canvas */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#1C0A38] via-[#0E041A] to-[#1C0A38] rounded-3xl border border-purple-500/30 shadow-2xl relative h-[500px] sm:h-[650px] overflow-hidden flex flex-col">
          
          {/* Canvas Controls Overlay */}
          <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between pointer-events-none">
            <div className="bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-full text-[11px] font-bold text-purple-200 border border-purple-500/30 flex items-center space-x-2">
              <Box className="w-3.5 h-3.5 text-amber-400" />
              <span>Rotate 360° • Pinch / Scroll to Zoom</span>
            </div>

            <button
              onClick={handleResetCamera}
              className="pointer-events-auto bg-black/70 hover:bg-black/90 text-white p-2.5 rounded-full backdrop-blur-md transition-all border border-purple-500/20"
              title="Reset View"
            >
              <RotateCcw className="w-4 h-4 text-amber-400" />
            </button>
          </div>

          {/* Three.js Canvas */}
          <Canvas shadows gl={{ preserveDrawingBuffer: true }}>
            <PerspectiveCamera makeDefault position={[0, 1.2, 4.2]} fov={50} />
            <OrbitControls
              ref={controlsRef}
              minDistance={2.5}
              maxDistance={7}
              maxPolarAngle={Math.PI / 2 + 0.1}
              enablePan={true}
            />

            {/* Lighting Setup */}
            <ambientLight intensity={0.9} />
            <directionalLight
              position={[5, 8, 5]}
              intensity={1.5}
              castShadow
              shadow-mapSize={1024}
            />
            <pointLight position={[-4, 3, -3]} intensity={0.6} color="#E9D5FF" />
            <pointLight position={[3, 2, 4]} intensity={0.8} color="#F59E0B" />

            {/* 3D Arrangement */}
            <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
              <FloralArrangement
                primaryFlower={primaryFlower}
                secondaryFlower={secondaryFlower}
                style={arrangementStyle}
                stemCount={stemCount}
                vaseStyle={vaseStyle}
              />
            </Float>

            {/* Ground Shadow */}
            <ContactShadows position={[0, -2.1, 0]} opacity={0.7} scale={10} blur={2} far={4} color="#581C87" />
          </Canvas>

          {/* Bottom Canvas Status */}
          <div className="p-3 bg-[#160B29]/90 border-t border-purple-500/20 text-center text-xs text-purple-200/80 font-medium backdrop-blur-md">
            3D Studio Render • <strong className="text-amber-400">{stemCount} Stems</strong> in <strong className="text-white">{vaseItem.label}</strong>
          </div>
        </div>

        {/* Right: Customization Panel */}
        <div className="lg:col-span-5 bg-[#160B29]/80 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-purple-500/20 shadow-2xl space-y-6">
          
          <h2 className="font-black text-xl text-white flex items-center justify-between">
            <span>Customization Suite</span>
            <span className="text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              Live Preview
            </span>
          </h2>

          {/* 1. Primary Flower */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-purple-300 uppercase tracking-wider block">
              1. Choose Primary Flower
            </label>
            <div className="grid grid-cols-2 gap-2">
              {FLOWER_OPTIONS.map((flower) => (
                <button
                  key={flower.id}
                  onClick={() => setPrimaryFlower(flower.id)}
                  className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                    primaryFlower === flower.id
                      ? 'border-purple-500 bg-purple-900/60 text-white font-bold ring-2 ring-purple-500/30 shadow-lg'
                      : 'border-purple-500/20 bg-purple-950/40 hover:bg-purple-900/30 text-purple-200 font-medium'
                  }`}
                >
                  <span className="text-xl">{flower.icon}</span>
                  <div className="truncate">
                    <span className="text-xs block font-bold truncate">{flower.label}</span>
                    <span className="text-[10px] text-amber-400 font-extrabold">₹{flower.price}/stem</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Filler Flowers */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-purple-300 uppercase tracking-wider block">
              2. Filler Flowers
            </label>
            <select
              value={secondaryFlower}
              onChange={(e) => setSecondaryFlower(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#160B29] border border-purple-500/30 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              <option value="jasmine" className="bg-[#160B29]">🌼 Mysuru Mallige (Jasmine Cluster)</option>
              <option value="lily" className="bg-[#160B29]">🌸 Blush Lilies Filler</option>
              <option value="none" className="bg-[#160B29]">None (Pure Single Flower)</option>
            </select>
          </div>

          {/* 3. Stem Count Selector */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-purple-200">
              <span>3. Stem Count:</span>
              <span className="text-amber-400 font-black text-sm">{stemCount} Stems</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[7, 12, 18, 24].map((count) => (
                <button
                  key={count}
                  onClick={() => setStemCount(count)}
                  className={`py-2 rounded-xl text-xs font-bold transition-all border ${
                    stemCount === count
                      ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                      : 'bg-purple-950/40 text-purple-200 border-purple-500/20 hover:bg-purple-900/30'
                  }`}
                >
                  {count} Stems
                </button>
              ))}
            </div>
          </div>

          {/* 4. Arrangement Style */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-purple-300 uppercase tracking-wider block">
              4. Arrangement Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ARRANGEMENT_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setArrangementStyle(style.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    arrangementStyle === style.id
                      ? 'border-purple-500 bg-purple-900/60 text-white font-bold'
                      : 'border-purple-500/20 bg-purple-950/40 hover:bg-purple-900/30 text-purple-200'
                  }`}
                >
                  <span className="text-xs block font-bold">{style.label}</span>
                  <span className="text-[10px] text-purple-300/60 block">{style.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Vase Style Selector */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-purple-300 uppercase tracking-wider block">
              5. Vase Material & Style
            </label>
            <select
              value={vaseStyle}
              onChange={(e) => setVaseStyle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#160B29] border border-purple-500/30 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              {VASE_OPTIONS.map((v) => (
                <option key={v.id} value={v.id} className="bg-[#160B29]">
                  {v.label} (+₹{v.price})
                </option>
              ))}
            </select>
          </div>

          {/* 6. Select Mysuru Decorator Shop */}
          <div className="space-y-2">
            <label className="font-bold text-xs text-amber-300 uppercase tracking-wider block">
              6. Select Decorator Shop to Fulfill Order
            </label>
            <select
              value={selectedFloristId}
              onChange={(e) => setSelectedFloristId(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-purple-950 text-white border border-purple-500/40 rounded-xl text-xs font-bold focus:ring-2 focus:ring-purple-500 focus:outline-none cursor-pointer"
            >
              {florists.map((f) => (
                <option key={f._id} value={f._id} className="bg-[#160B29]">
                  {f.name} ({f.area}, Mysuru)
                </option>
              ))}
            </select>
          </div>

          {/* Price Calculation Box */}
          <div className="p-4 bg-purple-950/70 rounded-2xl border border-purple-500/30 space-y-2">
            <div className="flex justify-between items-center text-xs text-purple-200/80">
              <span>{stemCount} Stems ({flowerItem.label}):</span>
              <span className="font-bold text-white">₹{flowersTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-purple-200/80">
              <span>Vase ({vaseItem.label}):</span>
              <span className="font-bold text-white">₹{vaseTotal.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between items-center text-xs text-purple-200/80">
              <span>Craft & Styling Fee:</span>
              <span className="font-bold text-white">₹{craftFee.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-purple-500/20 flex justify-between items-center">
              <span className="font-black text-sm text-white">Total Est. Price:</span>
              <span className="text-2xl font-black text-amber-400">₹{grandTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          {/* Send Order to Decorator via WhatsApp */}
          <button
            onClick={handleSendWhatsAppOrder}
            className="w-full py-4 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-2xl shadow-xl shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02] active:scale-[0.99]"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Send 3D Design to {selectedFlorist?.name?.split(' ')[0]} on WhatsApp</span>
          </button>

        </div>

      </div>

    </div>
  );
}
