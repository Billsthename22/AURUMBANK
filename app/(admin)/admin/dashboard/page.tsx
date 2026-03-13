"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Added for redirection
import { TrendingUp, Users, ShieldAlert, Activity, Globe, Zap, Loader2, Power } from 'lucide-react';
import { StatusItem } from '@/app/components/StatusItem'; 
import { ActivityRow } from '@/app/components/ActivityRow'; 
import { MetricCard } from '@/app/components/MetricCard'; 

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalBalance: 0, userCount: 0, pendingKyc: 0 });
  const [feed, setFeed] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // State for logout transition
  const router = useRouter();

  // --- LOGOUT LOGIC ---
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      const res = await fetch('/api/admin/logout', { method: 'POST' });
      if (res.ok) {
        // Clear local cache and redirect to the portal
        router.push('/admin/login');
        router.refresh();
      }
    } catch (error) {
      console.error("Logout Protocol Failed:", error);
      setIsLoggingOut(false);
    }
  };

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const res = await fetch('/api/admin/stats');
        if (!res.ok) return;
        const contentType = res.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) return;
  
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Sync Error:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, []);

  if (loading || isLoggingOut) return (
    <div className="h-96 flex flex-col items-center justify-center text-aurum-navy opacity-50">
      <Loader2 className="animate-spin mb-4" size={32} />
      <span className="text-[10px] font-black uppercase tracking-[0.3em]">
        {isLoggingOut ? "Terminating Secure Link..." : "Establishing Secure Link..."}
      </span>
    </div>
  );

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-4xl font-serif font-black text-aurum-navy tracking-tight italic">
            Intelligence <span className="text-aurum-gold">Overview</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
            Node: {process.env.NEXT_PUBLIC_NODE_ID || "AUR-01"} 
          </p>
        </div>

        {/* UPDATED ACTION AREA: SYSTEM STATUS + LOGOUT */}
        <div className="flex items-center gap-4">
          <div className="bg-white border border-slate-200 px-4 py-2 flex items-center gap-3 rounded-sm shadow-sm hidden md:flex">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase text-aurum-navy tracking-tighter">System: Optimal</span>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-sm shadow-md transition-all active:scale-95 group"
          >
            <Power size={14} className="group-hover:rotate-12 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </div>

      {/* PRIMARY METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Liquidity" 
          value={`$${(stats.totalBalance / 1000000).toFixed(1)}M`} 
          change="Live" 
          icon={<TrendingUp className="text-green-600" size={20} />} 
        />
        <MetricCard 
          title="Institutional Users" 
          value={stats.userCount.toLocaleString()} 
          change="+New" 
          icon={<Users className="text-aurum-navy" size={20} />} 
        />
        <MetricCard 
          title="Pending KYC" 
          value={stats.pendingKyc} 
          change="Urgent" 
          icon={<ShieldAlert className="text-amber-500" size={20} />} 
          highlight={stats.pendingKyc > 0}
        />
        <MetricCard 
          title="Network Uptime" 
          value="99.99%" 
          change="Stable" 
          icon={<Zap className="text-aurum-gold" size={20} />} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* RECENT LEDGER ENTRIES */}
        <div className="lg:col-span-2 bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-aurum-navy">Internal Ledger Feed</h3>
            <button className="text-aurum-gold text-[10px] font-black uppercase tracking-widest hover:underline decoration-2">Access Full Audit</button>
          </div>
          <div className="divide-y divide-slate-100 min-h-[200px]">
            {feed.length > 0 ? feed.map((txn: any) => (
              <ActivityRow 
                key={txn.id}
                user={txn.sender_name || "System"} 
                action={txn.type} 
                amount={`${txn.type === 'DEPOSIT' ? '+' : '-'}$${parseFloat(txn.amount).toLocaleString()}`} 
                time={new Date(txn.created_at).toLocaleTimeString()} 
              />
            )) : (
              <div className="p-10 text-center text-slate-300 text-[10px] font-bold uppercase tracking-[0.2em]">
                No recent activity detected
              </div>
            )}
          </div>
        </div>

        {/* SYSTEM CONNECTIVITY PANEL */}
        <div className="space-y-6">
          <div className="bg-[#0A1120] p-8 rounded-sm shadow-xl text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-aurum-gold/5 blur-3xl rounded-full" />
            <h3 className="text-aurum-gold text-xs font-bold uppercase tracking-[0.3em] mb-8">Node Connectivity</h3>
            <div className="space-y-5">
              <StatusItem label="Database Cluster" status="Operational" />
              <StatusItem label="Resend Mail API" status="Operational" />
              <StatusItem label="Security Layer" status="Encrypted" />
              <StatusItem label="CDN Edge" status="Active" />
            </div>
            <div className="mt-10 pt-6 border-t border-white/5 flex items-center gap-4">
              <Globe className="text-aurum-gold/50 animate-spin-slow" size={20} />
              <span className="text-[9px] uppercase font-bold tracking-[0.2em] text-white/40">Region: West Africa / Node 01</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}