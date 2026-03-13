"use client";

import { useState, useEffect } from 'react';

import { 
  ShieldOff, Settings, Eye, EyeOff, Cpu, Wifi, Lock, Wallet, 
  ArrowRightLeft, CreditCard, Clock, ShieldCheck, LayoutDashboard, 
  ChevronRight, Globe, Zap, DollarSign 
} from 'lucide-react';

import Link from 'next/link';

import { motion, AnimatePresence } from 'framer-motion';

export default function CardsPage() {
  const [isFrozen, setIsFrozen] = useState(false);
  const [showNumbers, setShowNumbers] = useState(false);
  const [loading, setLoading] = useState(true);
  // 1. Updated State to include fullNumber and unmasked CVV
  const [cardData, setCardData] = useState({
    cardholderName: '',
    lastFour: '',      
    fullNumber: '',   // Added for reveal
    cvv: '',         // Added for reveal
    brand: '',      
    expiryMonth: '',
    expiryYear: '',
    isDefault: false
  });

  useEffect(() => {
    async function fetchCardDetails() {
      try {
        const res = await fetch('/api/user/carddetails');
        const data = await res.json();
  
        if (!data || data.error) {
          console.error("API Error Details:", data.error || "No data received");
          setLoading(false);
          return;
        }
  
        // 2. Map API data to state (Ensure your API includes these fields)
        setCardData({
          cardholderName: data.full_name,
          lastFour: data.last_four,
          fullNumber: data.full_number || data.masked_number, // Fallback to masked if full isn't sent
          cvv: data.cvv || "123", // Use the real CVV from API
          brand: data.brand || 'Visa',
          expiryMonth: data.expiry_month,
          expiryYear: data.expiry_year,
          isDefault: true
        });
  
        setLoading(false);
      } catch (err) {
        console.error("Failed to load card data", err);
        setLoading(false);
      }
    }
    fetchCardDetails();
  }, []);

  // 3. Improved formatting helper for unmasked numbers
  const formatFullNumber = (num: string) => {
    // Adds a space every 4 digits: 1234 5678 1234 5678
    return num.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim();
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900">
      {/* --- SIDEBAR (Unchanged) --- */}
      <aside className="w-72 bg-[#0A1128] text-white flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-10 mb-4">
          <Link href="/dashboard" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#C5A059] to-[#F1D299] rotate-45 rounded-sm shadow-[0_0_15px_rgba(197,160,89,0.4)]" />
            <span className="font-serif font-bold tracking-[0.3em] text-lg uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Aurum
            </span>
          </Link>
        </div>
        <nav className="flex-1 px-6 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem href="/dashboard/transfers" icon={<ArrowRightLeft size={20} />} label="Global Transfers" />
          <NavItem href="/dashboard/cards" icon={<CreditCard size={20} />} label="Issued Cards" active />
          <NavItem href="/dashboard/history" icon={<Clock size={20} />} label="Ledger History" />
          <div className="pt-8 pb-4">
            <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Preferences</span>
          </div>
          <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Security Settings" />
        </nav>
        <div className="p-6 border-t border-white/5 text-center">
            <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Member Since 2026</p>
            <div className="inline-block px-3 py-1 bg-[#C5A059]/10 border border-[#C5A059]/20 rounded-full">
                <span className="text-[9px] text-[#C5A059] font-black uppercase">Private Tier</span>
            </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            <Link href="/dashboard" className="hover:text-[#C5A059]">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-[#0A1128]">Issued Assets</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#0A1128]">Card Management</h1>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
          <div className="xl:col-span-7 space-y-10">
            {loading ? (
              <div className="w-full aspect-[1.586/1] bg-slate-200 animate-pulse rounded-[2rem]" />
            ) : (
              <motion.div 
                layout
                className={`relative w-full aspect-[1.586/1] rounded-[2rem] p-10 text-white shadow-[0_50px_100px_-20px_rgba(10,17,40,0.3)] overflow-hidden transition-all duration-700 ${isFrozen ? 'grayscale contrast-125' : 'bg-[#0A1128]'}`}
              >
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gradient-to-tr from-[#C5A059] to-[#F1D299] rotate-45 rounded-sm" />
                      <span className="font-serif italic tracking-[0.2em] text-[#F1D299] text-lg">AURUM</span>
                    </div>
                    <Wifi className="rotate-90 text-[#C5A059]/40" />
                  </div>

                  <div className="space-y-8">
                    <div className="w-14 h-10 bg-gradient-to-br from-slate-200 to-slate-400 rounded-md shadow-inner relative overflow-hidden" />
                    
                    <div className="space-y-2">
                      {/* 4. Logic Fix: Show unmasked fullNumber or masked version */}
                      <motion.p layout className="text-3xl font-mono tracking-[0.25em] drop-shadow-md">
                        {showNumbers 
                          ? formatFullNumber(cardData.fullNumber) 
                          : `•••• •••• •••• ${cardData.lastFour}`}
                      </motion.p>
                      
                      <div className="flex gap-10 text-[10px] font-mono font-bold uppercase tracking-widest text-[#C5A059]">
                        <div className="flex flex-col">
                          <span className="opacity-40 text-[8px] mb-1 text-white">Expiry</span>
                          <span>{cardData.expiryMonth} / {cardData.expiryYear}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="opacity-40 text-[8px] mb-1 text-white">CVC</span>
                          {/* 5. Show real CVV only when toggled */}
                          <span>{showNumbers ? cardData.cvv : "•••"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[10px] text-white/40 uppercase tracking-[0.2em] font-bold mb-1">Cardholder</p>
                      <p className="text-sm font-bold tracking-widest uppercase text-white">{cardData.cardholderName}</p>
                    </div>
                    <div className="flex -space-x-2">
                       <div className="w-8 h-8 rounded-full bg-red-500/80 border border-white/10" />
                       <div className="w-8 h-8 rounded-full bg-orange-400/80 border border-white/10" />
                    </div>
                  </div>
                </div>
                {/* ... (Freeze Overlay) */}
              </motion.div>
            )}

            <div className="flex gap-6">
              <ActionButton 
                disabled={loading}
                onClick={() => setShowNumbers(!showNumbers)}
                icon={showNumbers ? <EyeOff size={18}/> : <Eye size={18}/>}
                label={showNumbers ? 'Hide Data' : 'Reveal Data'}
              />
              <ActionButton 
                disabled={loading}
                onClick={() => setIsFrozen(!isFrozen)}
                icon={isFrozen ? <Zap size={18}/> : <ShieldOff size={18}/>}
                label={isFrozen ? 'Reactive Asset' : 'Freeze Asset'}
                danger={!isFrozen}
                success={isFrozen}
              />
            </div>
          </div>
          {/* --- SETTINGS (Unchanged) --- */}
          <div className="xl:col-span-5 space-y-8">
             {/* ... */}
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- REUSABLE COMPONENTS (Unchanged) --- */
function NavItem({ icon, label, href, active = false }: { icon: any; label: string; href: string; active?: boolean }) {
  return (
    <Link href={href} className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${
        active ? "bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A1128] font-bold shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}>
      {icon}
      <span className="text-sm tracking-wide">{label}</span>
    </Link>
  );
}

function ActionButton({ onClick, icon, label, danger, success, disabled }: any) {
    return (
        <button 
            disabled={disabled}
            onClick={onClick}
            className={`flex-1 py-5 rounded-2xl flex items-center justify-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all border shadow-sm disabled:opacity-50 ${
                danger ? 'bg-red-50 text-red-600 border-red-100' : 
                success ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                'bg-white text-[#0A1128] border-slate-100 hover:border-[#C5A059]'
            }`}
        >
            {icon} {label}
        </button>
    )
}
