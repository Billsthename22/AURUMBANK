"use client";

import { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Globe, 
  Zap, 
  BarChart3, 
  Wallet, 
  ArrowUpRight, 
  CreditCard, 
  Clock, 
  ShieldCheck,
  ExternalLink,
  Activity
} from 'lucide-react';
import Link from 'next/link';

export default function MarketPage() {
  const holdings = [
    { asset: 'Physical Gold (XAU)', price: '$2,042.50', change: '+1.2%', trend: 'up', vol: 'Low' },
    { asset: 'S&P 500 Index', price: '$5,088.10', change: '-0.4%', trend: 'down', vol: 'Med' },
    { asset: 'Treasury Bonds (10Y)', price: '4.21%', change: '+0.05%', trend: 'up', vol: 'Low' },
    { asset: 'Bitcoin (Institutional)', price: '$64,120.00', change: '+3.4%', trend: 'up', vol: 'High' },
  ];

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
          <NavItem href="/dashboard/market" icon={<BarChart3 size={18}/>} label="Market" active />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-serif font-bold">Market Intelligence</h2>
            <p className="text-sm text-gray-400 font-medium">Global surveillance of your collateralized assets.</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 shadow-sm rounded-full">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Live Terminal</span>
            </div>
          </div>
        </header>

        {/* TOP ROW: HEALTH & TICKER */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          
          {/* PORTFOLIO HEALTH CARD */}
          <div className="lg:col-span-2 bg-white border border-gray-100 p-8 shadow-sm relative group overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Activity size={120} />
            </div>
            
            <div className="flex justify-between items-start mb-10">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-2">Collateral Health Score</h3>
                <p className="text-5xl font-serif font-bold text-aurum-navy">94.2<span className="text-xl text-gray-300">/100</span></p>
              </div>
              <div className="bg-green-50 text-green-700 px-4 py-2 text-[10px] font-bold uppercase tracking-widest border border-green-100">
                Risk: Minimal
              </div>
            </div>

            <div className="space-y-6">
              <div className="w-full h-1 bg-gray-100 rounded-full">
                <div className="h-full bg-aurum-gold transition-all duration-1000" style={{ width: '94%' }} />
              </div>
              <div className="grid grid-cols-2 gap-8 pt-4">
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Current LTV Agg.</p>
                  <p className="text-xl font-serif font-bold">42.18%</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Margin Call Buffer</p>
                  <p className="text-xl font-serif font-bold text-aurum-gold">+$1.42M</p>
                </div>
              </div>
            </div>
          </div>

          {/* MARKET WATCHLIST */}
          <div className="bg-aurum-navy text-white p-8 shadow-2xl">
            <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurum-gold mb-8">Asset Ticker</h3>
            <div className="space-y-6">
              {holdings.map((h, i) => (
                <div key={i} className="flex justify-between items-center border-b border-white/10 pb-4 last:border-0">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-tight">{h.asset}</p>
                    <p className="text-[10px] font-mono text-white/50">{h.price}</p>
                  </div>
                  <div className={`text-right ${h.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                    <div className="flex items-center justify-end gap-1 text-xs font-bold">
                      {h.trend === 'up' ? <TrendingUp size={12}/> : <TrendingDown size={12}/>}
                      {h.change}
                    </div>
                    <p className="text-[8px] font-bold text-white/30 uppercase tracking-tighter">Vol: {h.vol}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM ROW: NEWS & CORRELATION */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          
          {/* NEWS FEED */}
          <div className="bg-white border border-gray-100 p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xs font-bold uppercase tracking-[0.2em] flex items-center gap-2">
                <Globe size={16} className="text-aurum-gold" /> Institutional Briefing
              </h3>
              <button className="text-[10px] font-bold text-gray-400 hover:text-aurum-navy transition-colors uppercase tracking-widest">Refresh</button>
            </div>
            
            <div className="space-y-8">
              <NewsItem 
                time="14m ago"
                tag="Commodities"
                title="Gold surges on central bank diversification; support holds at $2,040."
                impact="Positive"
              />
              <NewsItem 
                time="2h ago"
                tag="Macro"
                title="Fed hints at stable rates through Q3; yields respond with tightening."
                impact="Neutral"
              />
              <NewsItem 
                time="5h ago"
                tag="Equities"
                title="VIX climbs 4% as tech sector faces new regulatory headwinds."
                impact="Caution"
              />
            </div>
          </div>

          {/* SIMULATOR PLACEHOLDER */}
          <div className="bg-slate-100 border-2 border-dashed border-gray-200 p-8 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-6">
              <BarChart3 className="text-aurum-navy" size={24} />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-widest text-aurum-navy mb-2">Volatility Stress Terminal</h3>
            <p className="text-[10px] text-gray-400 max-w-[240px] leading-relaxed mb-6">
              Project how your collateral reacts to a 20% market dip or interest rate spikes.
            </p>
            <button className="px-8 py-3 bg-aurum-navy text-white text-[10px] font-bold uppercase tracking-widest hover:bg-aurum-gold transition-colors">
              Initialize Simulation
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function NewsItem({ time, tag, title, impact }: any) {
  const impactStyles: any = {
    Positive: 'bg-green-50 text-green-600 border-green-100',
    Neutral: 'bg-blue-50 text-blue-600 border-blue-100',
    Caution: 'bg-amber-50 text-amber-600 border-amber-100'
  };

  return (
    <div className="group cursor-pointer border-b border-gray-50 last:border-0 pb-6 last:pb-0">
      <div className="flex justify-between mb-2">
        <span className="text-[9px] font-bold text-gray-300 uppercase">{time} • {tag}</span>
        <span className={`text-[8px] font-black uppercase px-2 py-0.5 border ${impactStyles[impact]}`}>
          {impact}
        </span>
      </div>
      <p className="text-sm font-bold text-aurum-navy group-hover:text-aurum-gold transition-colors leading-tight">
        {title}
      </p>
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