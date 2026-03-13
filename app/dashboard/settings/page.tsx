"use client";

import { useState, useEffect } from 'react';
import { 
  User, Shield, Mail, Smartphone, 
  MapPin, Camera, CheckCircle2, Loader2,
  Lock, Globe, CreditCard
} from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [successMsg, setSuccessMsg] = useState('');

  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    accNumber: "",
    tier: "",
    joined: ""
  });

  // 1. Fetch Profile Data on Mount
  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch('/api/users/settings');
        
        // If the API says 401, it means the cookie is missing or invalid
        if (res.status === 401) {
          console.warn("User not logged in. Redirecting...");
          window.location.href = '/login'; 
          return;
        }
  
        if (!res.ok) throw new Error("Failed to load");
        
        const data = await res.json();
        
        setProfile({
          fullName: data.name || "Member",
          email: data.email || "",
          phone: data.phone || "Not Set",
          accNumber: data.id ? `AUR-${data.id.toString().slice(0, 6)}` : "AUR-000000",
          tier: data.role === 'admin' ? 'Executive Member' : 'Private Client',
          joined: data.created_at ? new Date(data.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "March 2026"
        });
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProfile();
  }, []);
  // 2. Handle Update (Saving to DB)
  const handleUpdate = async () => {
    setIsSaving(true);
    setSuccessMsg('');
    try {
      const res = await fetch('/api/users/settings', {
        method: 'PUT', // or 'POST' depending on your API route
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.fullName,
          phone: profile.phone
        }),
      });

      if (res.ok) {
        setSuccessMsg('Identity Verified & Updated');
        setTimeout(() => setSuccessMsg(''), 3000);
      } else {
        throw new Error("Failed to update");
      }
    } catch (error) {
      console.error("Update error:", error);
      alert("Failed to save changes.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-aurum-navy flex items-center justify-center">
        <Loader2 className="text-aurum-gold animate-spin" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* SIDEBAR */}
      <aside className="w-64 bg-aurum-navy text-white flex flex-col fixed h-full z-40">
        <div className="p-8 flex items-center gap-3 border-b border-white/10">
          <div className="w-6 h-6 bg-aurum-gold rotate-45" />
          <span className="font-serif font-bold tracking-widest text-sm uppercase">Aurum</span>
        </div>
        <nav className="flex-1 px-4 py-8 space-y-2">
          <NavItem href="/dashboard" icon={<CreditCard size={18}/>} label="Ledgers" />
          <NavItem href="/dashboard/settings" icon={<User size={18}/>} label="Profile" active />
        </nav>
      </aside>

      <main className="flex-1 ml-64">
        {/* PROFILE HEADER HERO */}
        <div className="h-64 bg-aurum-navy relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
          <div className="max-w-4xl mx-auto h-full flex items-end p-10 pb-16">
            <div className="flex items-center gap-8 translate-y-12">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-aurum-gold flex items-center justify-center text-aurum-navy text-4xl font-serif font-black shadow-2xl">
                  {profile.fullName?.charAt(0) || "U"}
                </div>
                <button className="absolute bottom-0 right-0 bg-white p-2 rounded-full shadow-lg text-aurum-navy hover:text-aurum-gold transition-colors">
                  <Camera size={16} />
                </button>
              </div>
              <div className="mb-4">
                <h1 className="text-4xl font-serif font-black text-white italic">{profile.fullName}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-xs font-black uppercase tracking-widest text-aurum-gold bg-white/10 px-3 py-1 rounded-full border border-aurum-gold/30">
                    {profile.tier}
                  </span>
                  <div className="flex items-center text-white/50 text-[10px] font-bold uppercase tracking-tighter">
                    <MapPin size={12} className="mr-1" /> Global Citizen
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PROFILE CONTENT */}
        <div className="max-w-4xl mx-auto mt-24 p-10 grid grid-cols-12 gap-8">
          
          <div className="col-span-8 space-y-8">
            <section className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 border-b pb-4">Personal Credentials</h3>
              <div className="grid grid-cols-2 gap-x-12 gap-y-10">
                <DataField 
                  label="Legal Name" 
                  value={profile.fullName} 
                  editable 
                  onChange={(v: string) => setProfile({...profile, fullName: v})} 
                />
                <DataField label="Digital Mail" value={profile.email} />
                <DataField 
                  label="Mobile Secure" 
                  value={profile.phone} 
                  editable 
                  onChange={(v: string) => setProfile({...profile, phone: v})} 
                />
                <DataField label="Member Since" value={profile.joined} />
              </div>
              <div className="mt-12 flex items-center justify-between">
                <button 
                  onClick={handleUpdate}
                  disabled={isSaving}
                  className="bg-aurum-navy text-white px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-aurum-gold hover:text-aurum-navy transition-all flex items-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <Loader2 size={14} className="animate-spin" /> : null}
                  Update Identity
                </button>
                {successMsg && <span className="text-[10px] font-black uppercase text-green-600 animate-pulse">{successMsg}</span>}
              </div>
            </section>

            <section className="bg-white p-8 border border-gray-100 shadow-sm rounded-sm">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-6">Security Posture</h3>
              <div className="space-y-4">
                <SecurityToggle title="Two-Factor Authentication" active />
                <SecurityToggle title="Hardware Key Support" />
                <SecurityToggle title="Session Lockdown (30m)" active />
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            <div className="bg-aurum-gold p-6 text-aurum-navy">
              <p className="text-[9px] font-black uppercase tracking-widest opacity-60">Primary Vault ID</p>
              <p className="text-xl font-mono font-bold mt-1 uppercase">{profile.accNumber}</p>
            </div>

            <div className="bg-white border border-gray-100 p-6 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Activity Pulse</h4>
              <PulseItem label="Last Login" value="Lagos, NG (2m ago)" />
              <PulseItem label="Security Review" value="Completed" green />
              <PulseItem label="API Usage" value="0 calls/mo" />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS (With value instead of defaultValue) ---

function DataField({ label, value, editable, onChange }: any) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</span>
      <input 
        type="text" 
        value={value} 
        readOnly={!editable}
        onChange={(e) => onChange?.(e.target.value)}
        className={`text-sm font-bold text-aurum-navy bg-transparent border-b outline-none transition-all ${editable ? 'border-gray-200 focus:border-aurum-gold pb-1' : 'border-transparent cursor-default'}`} 
      />
    </div>
  );
}

// (SecurityToggle, PulseItem, and NavItem remain the same as your original snippet)
function SecurityToggle({ title, active = false }: any) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-xs font-bold text-aurum-navy">{title}</span>
      <div className={`w-10 h-5 rounded-full relative transition-colors ${active ? 'bg-aurum-gold' : 'bg-gray-200'}`}>
        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${active ? 'right-1' : 'left-1'}`} />
      </div>
    </div>
  );
}

function PulseItem({ label, value, green }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-bold text-slate-400">{label}</span>
      <span className={`text-[10px] font-black uppercase ${green ? 'text-green-600' : 'text-aurum-navy'}`}>{value}</span>
    </div>
  );
}

function NavItem({ icon, label, href = "#", active = false }: any) {
  return (
    <Link href={href} className={`flex items-center gap-3 px-6 py-4 cursor-pointer transition-all border-l-4 ${
      active ? 'bg-white/5 border-aurum-gold text-white font-bold' : 'border-transparent text-white/40 hover:text-white hover:bg-white/5'
    }`}>
      {icon}
      <span className="text-[10px] uppercase tracking-[0.2em] font-black">{label}</span>
    </Link>
  );
}