"use client";

import { useState } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  BarChart3,
  MessageSquare,
  Phone,
  Calendar,
  Send,
  UserCheck,
  MoreVertical,
  Paperclip
} from 'lucide-react';
import Link from 'next/link';

export default function ConciergePage() {
  const [message, setMessage] = useState('');

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
          <NavItem href="/dashboard/concierge" icon={<MessageSquare size={18}/>} label="Concierge" active />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-10 flex flex-col h-screen">
        <header className="flex justify-between items-center mb-8 shrink-0">
          <div>
            <h2 className="text-3xl font-serif font-bold">Private Concierge</h2>
            <p className="text-sm text-gray-400 font-medium">Your dedicated relationship team is online.</p>
          </div>
          
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 text-[10px] font-bold uppercase tracking-widest hover:bg-gray-50 transition shadow-sm">
              <Phone size={14} className="text-aurum-gold" /> Voice Call
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-aurum-navy text-white text-[10px] font-bold uppercase tracking-widest hover:bg-aurum-gold transition shadow-lg">
              <Calendar size={14} /> Schedule Briefing
            </button>
          </div>
        </header>

        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-4">
          
          {/* LEFT: CHAT INTERFACE */}
          <div className="lg:col-span-2 bg-white border border-gray-100 shadow-sm flex flex-col overflow-hidden">
            {/* Chat Header */}
            <div className="p-6 border-b border-gray-50 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-10 h-10 bg-aurum-navy rounded-full flex items-center justify-center text-aurum-gold font-serif italic text-lg">J</div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm font-bold">Julian Vane</p>
                  <p className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">Senior Relationship Manager</p>
                </div>
              </div>
              <MoreVertical size={18} className="text-gray-300 cursor-pointer" />
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              <ChatMessage 
                sender="Julian Vane" 
                time="10:24 AM" 
                text="Good morning. I've reviewed your recent facility drawdown. Would you like to discuss hedging strategies for your equity collateral given the upcoming Fed announcement?" 
                isOfficer
              />
              <ChatMessage 
                sender="You" 
                time="10:31 AM" 
                text="Yes, let's look at the correlation matrix we saw in the market terminal. I'm concerned about the tech sector volatility." 
              />
            </div>

            {/* Input Area */}
            <div className="p-6 border-t border-gray-100">
              <div className="relative flex items-center">
                <input 
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your secure message..."
                  className="w-full bg-slate-50 border-none py-4 pl-6 pr-24 text-sm focus:ring-1 focus:ring-aurum-gold outline-none"
                />
                <div className="absolute right-4 flex items-center gap-3">
                  <Paperclip size={18} className="text-gray-300 cursor-pointer hover:text-aurum-navy" />
                  <button className="bg-aurum-navy p-2 text-white hover:bg-aurum-gold transition">
                    <Send size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT: OFFICER DETAILS & DOCS */}
          <div className="space-y-6 overflow-y-auto">
            <div className="bg-white border border-gray-100 p-8 shadow-sm text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                <UserCheck size={32} className="text-aurum-navy" />
              </div>
              <h3 className="font-serif font-bold text-lg">Relationship Team</h3>
              <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1">Tier: Sovereign Wealth</p>
              
              <div className="mt-8 pt-8 border-t border-gray-50 space-y-4 text-left">
                <OfficerStat label="Direct Line" value="+44 20 7946 0122" />
                <OfficerStat label="Average Response" value="< 5 Minutes" />
                <OfficerStat label="Timezone" value="London (GMT)" />
              </div>
            </div>

            <div className="bg-white border border-gray-100 p-8 shadow-sm">
              <h3 className="text-[10px] font-bold uppercase tracking-widest mb-6">Shared Vault</h3>
              <div className="space-y-4">
                <FileItem name="Q1_Review.pdf" size="2.4 MB" />
                <FileItem name="Tax_Statement_2025.pdf" size="1.1 MB" />
                <FileItem name="Facility_Agreement.pdf" size="840 KB" />
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

/* --- SUB-COMPONENTS --- */



function ChatMessage({ sender, time, text, isOfficer = false }: any) {
  return (
    <div className={`flex flex-col ${isOfficer ? 'items-start' : 'items-end'}`}>
      <div className="flex gap-2 mb-2 items-baseline">
        <span className="text-[10px] font-bold uppercase tracking-tighter text-gray-400">{sender}</span>
        <span className="text-[8px] text-gray-300 font-mono">{time}</span>
      </div>
      <div className={`max-w-[80%] p-4 text-sm leading-relaxed ${
        isOfficer 
          ? 'bg-slate-100 text-aurum-navy rounded-r-2xl rounded-bl-2xl' 
          : 'bg-aurum-navy text-white rounded-l-2xl rounded-br-2xl shadow-lg'
      }`}>
        {text}
      </div>
    </div>
  );
}

function OfficerStat({ label, value }: any) {
  return (
    <div className="flex justify-between">
      <span className="text-[9px] font-bold text-gray-400 uppercase">{label}</span>
      <span className="text-xs font-bold">{value}</span>
    </div>
  );
}

function FileItem({ name, size }: any) {
  return (
    <div className="flex justify-between items-center group cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-50 group-hover:bg-aurum-gold transition-colors">
          <Clock size={12} className="text-aurum-navy" />
        </div>
        <span className="text-xs font-bold text-aurum-navy group-hover:underline">{name}</span>
      </div>
      <span className="text-[9px] font-mono text-gray-300">{size}</span>
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