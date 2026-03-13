"use client";

import { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Fingerprint, 
  Users, 
  History, 
  Globe, 
  AlertOctagon,
  ChevronRight,
  Wallet,
  ArrowUpRight,
  CreditCard,
  Clock,
  BarChart3,
  MessageSquare,
  Smartphone,
  Key
} from 'lucide-react';
import Link from 'next/link';

export default function SecurityPage() {
  const [panicMode, setPanicMode] = useState(false);

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex font-sans text-aurum-navy">
      
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-aurum-navy text-white flex flex-col fixed h-full z-40">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <div className="w-6 h-6 bg-aurum-gold rotate-45" />
          <span className="font-serif font-bold tracking-widest text-sm uppercase">Aurum Global</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavItem href="/dashboard" icon={<Wallet size={18}/>} label="Accounts" />
          <NavItem href="/dashboard/transfers" icon={<ArrowUpRight size={18}/>} label="Transfers" />
          <NavItem href="/dashboard/cards" icon={<CreditCard size={18}/>} label="Cards" />
          <NavItem href="/dashboard/history" icon={<Clock size={18}/>} label="History" />
          <div className="pt-8 pb-2 px-4 text-[10px] font-bold text-white/30 uppercase tracking-widest">Financing</div>
          <NavItem href="/dashboard/loans" icon={<ShieldCheck size={18}/>} label="Loans" />
          <NavItem href="/dashboard/market" icon={<BarChart3 size={18}/>} label="Market" />
          <NavItem href="/dashboard/concierge" icon={<MessageSquare size={18}/>} label="Concierge" />
          <NavItem href="/dashboard/security" icon={<Lock size={18}/>} label="Security" active />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold">Security & Governance</h2>
            <p className="text-sm text-gray-400 font-medium">Protecting your legacy with sovereign-grade encryption.</p>
          </div>
          
          <button 
            onClick={() => setPanicMode(!panicMode)}
            className={`px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all flex items-center gap-2 border-2 ${
              panicMode ? 'bg-red-600 border-red-600 text-white animate-pulse' : 'border-red-200 text-red-600 hover:bg-red-50'
            }`}
          >
            <AlertOctagon size={16} /> {panicMode ? 'Panic Protocol Active' : 'Emergency Lockdown'}
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT: PRIMARY SECURITY CONTROLS */}
          <div className="lg:col-span-2 space-y-8">
            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                <Fingerprint size={16} className="text-aurum-gold" /> Access Authentication
              </h3>
              <div className="space-y-6">
                <SecurityToggle 
                  icon={<Smartphone size={18}/>} 
                  title="Biometric MFA" 
                  desc="Require FaceID or TouchID for all transactions above $50k." 
                  enabled={true} 
                />
                <SecurityToggle 
                  icon={<Key size={18}/>} 
                  title="Hardware Security Key" 
                  desc="YubiKey or Ledger authorization required for ledger-level changes." 
                  enabled={false} 
                />
                <SecurityToggle 
                  icon={<Globe size={18}/>} 
                  title="Geofencing" 
                  desc="Restrict login attempts to your primary residence and office coordinates." 
                  enabled={true} 
                />
              </div>
            </section>

            <section className="bg-white border border-gray-100 p-8 shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-8 flex items-center gap-2">
                <Users size={16} className="text-aurum-gold" /> Authorized Delegates
              </h3>
              <div className="space-y-4">
                <DelegateRow name="Marcus Sterling" role="Family Office Manager" permissions="Full Access" />
                <DelegateRow name="Elena Rossi" role="Legal Counsel" permissions="View Only / Statements" />
                <button className="w-full py-4 border-2 border-dashed border-gray-100 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:border-aurum-gold hover:text-aurum-navy transition-all mt-4">
                  + Add New Delegate
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT: AUDIT LOG & DEVICE MAP */}
          <div className="space-y-8">
            <div className="bg-aurum-navy text-white p-8 shadow-2xl">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurum-gold mb-8">Access History</h3>
              <div className="space-y-6">
                <AuditItem loc="London, UK" status="Authorized" time="Today, 14:45" device="MacBook Pro" />
                <AuditItem loc="Zurich, CH" status="Authorized" time="Yesterday, 09:12" device="iPhone 15 Pro" />
                <AuditItem loc="New York, US" status="Blocked Attempt" time="Feb 20, 03:33" device="Unknown Device" isBlocked />
              </div>
              <button className="w-full mt-8 pt-4 border-t border-white/10 text-[9px] font-bold uppercase text-white/40 hover:text-white transition-colors">
                Download Full Audit PDF
              </button>
            </div>

            <div className="bg-white border border-gray-100 p-8 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4">Governance Signature</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-6 italic">
                All major drawdowns require 2/3 multi-sig approval from your registered delegates.
              </p>
              <div className="flex -space-x-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                    {i === 1 ? 'M' : i === 2 ? 'E' : 'Y'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function SecurityToggle({ icon, title, desc, enabled }: any) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-start gap-4">
        <div className="p-3 bg-slate-50 text-aurum-navy group-hover:bg-aurum-gold transition-colors">{icon}</div>
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="text-[10px] text-gray-400 max-w-xs">{desc}</p>
        </div>
      </div>
      <div className={`w-12 h-6 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-aurum-gold' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${enabled ? 'right-1' : 'left-1 shadow-sm'}`} />
      </div>
    </div>
  );
}

function DelegateRow({ name, role, permissions }: any) {
  return (
    <div className="flex justify-between items-center p-4 bg-slate-50 border border-transparent hover:border-aurum-gold transition-all cursor-pointer">
      <div>
        <p className="text-sm font-bold">{name}</p>
        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter">{role}</p>
      </div>
      <div className="text-right">
        <p className="text-[9px] font-black uppercase text-aurum-navy tracking-widest">{permissions}</p>
        <ChevronRight size={14} className="ml-auto text-gray-300 mt-1" />
      </div>
    </div>
  );
}

function AuditItem({ loc, status, time, device, isBlocked = false }: any) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold">{loc}</span>
        <span className={`text-[8px] font-black uppercase tracking-tighter ${isBlocked ? 'text-red-400' : 'text-green-400'}`}>
          {status}
        </span>
      </div>
      <div className="flex justify-between text-[9px] text-white/40">
        <span>{device}</span>
        <span>{time}</span>
      </div>
    </div>
  );
}

function NavItem({ icon, label, href = "#", active = false }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all ${
      active ? 'bg-aurum-gold text-aurum-navy font-bold' : 'text-white/60 hover:text-white hover:bg-white/5'
    }`}>
      {icon}
      <span className="text-xs uppercase tracking-widest">{label}</span>
    </Link>
  );
}