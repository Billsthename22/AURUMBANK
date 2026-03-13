"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, CreditCard, ShieldCheck, LogOut, Bell, Search } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menu = [
    { name: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'User Ledger', path: '/admin/users', icon: <Users size={20} /> },
    { name: 'Audit Trail', path: '/admin/transactions', icon: <CreditCard size={20} /> },
    { name: 'KYC Hub', path: '/admin/kyc', icon: <ShieldCheck size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* SIDEBAR */}
      <aside className="w-64 bg-[#0A1120] text-white fixed h-full flex flex-col z-20">
        <div className="p-8 border-b border-white/5">
          <h1 className="text-aurum-gold font-serif font-bold tracking-[.2em] text-xl">AURUM</h1>
          <span className="text-[9px] text-white/30 uppercase tracking-[.3em] font-bold">Admin Terminal</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 mt-4">
          {menu.map((item) => (
            <Link key={item.path} href={item.path} className={`
              flex items-center gap-4 px-4 py-3 rounded text-[11px] font-bold uppercase tracking-widest transition-all
              ${pathname === item.path ? 'bg-aurum-gold text-aurum-navy' : 'text-white/40 hover:bg-white/5 hover:text-white'}
            `}>
              {item.icon} {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button className="flex items-center gap-3 text-red-400/50 hover:text-red-400 text-[10px] font-bold uppercase tracking-widest transition-colors w-full">
            <LogOut size={18} /> Terminate Session
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64">
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center bg-slate-50 border border-slate-200 px-4 py-2 w-80 rounded group focus-within:border-aurum-gold/50 transition-all">
            <Search className="text-slate-400" size={16} />
            <input type="text" placeholder="Search data..." className="bg-transparent border-none text-xs ml-3 outline-none w-full text-aurum-navy" />
          </div>
          <div className="flex items-center gap-6">
            <Bell className="text-slate-400" size={20} />
            <div className="h-8 w-[1px] bg-slate-100" />
            <div className="w-10 h-10 bg-slate-200 rounded-full border border-slate-300" />
          </div>
        </header>

        <main className="p-10">{children}</main>
      </div>
    </div>
  );
}