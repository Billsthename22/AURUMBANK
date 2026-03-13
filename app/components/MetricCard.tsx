import React from 'react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  icon: React.ReactNode;
  highlight?: boolean; // Used for urgent alerts (e.g., Pending KYC)
}

export const MetricCard = ({ title, value, change, icon, highlight }: MetricCardProps) => {
  return (
    <div className="p-8 bg-white border border-slate-200 shadow-sm hover:border-aurum-gold/50 transition-all group relative overflow-hidden">
      {/* Subtle background accent on hover */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-slate-50 translate-x-12 -translate-y-12 rotate-45 group-hover:bg-aurum-gold/5 transition-colors" />

      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="p-3 bg-slate-50 text-aurum-navy rounded-sm group-hover:bg-aurum-gold group-hover:text-aurum-navy transition-colors">
          {icon}
        </div>
        <span className={`text-[9px] font-black px-2 py-1 uppercase tracking-tighter rounded-sm border ${
          highlight 
            ? 'bg-amber-50 border-amber-200 text-amber-700 animate-pulse' 
            : 'bg-green-50 border-green-200 text-green-700'
        }`}>
          {change}
        </span>
      </div>

      <div className="relative z-10">
        <p className="text-slate-400 text-[10px] uppercase tracking-[0.2em] font-bold">
          {title}
        </p>
        <p className="text-3xl font-serif font-black text-aurum-navy mt-1 tracking-tighter">
          {value}
        </p>
      </div>
    </div>
  );
};