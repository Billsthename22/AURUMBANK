"use client";

import { X, ShieldCheck, AlertTriangle, User, Mail, Hash } from 'lucide-react';

interface KycModalProps {
  user: any;
  onClose: () => void;
  onApprove: (id: string) => void;
}

export default function KycModal({ user, onClose, onApprove }: KycModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-aurum-navy/40 backdrop-blur-sm">
      <div className="w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* MODAL HEADER */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <h3 className="text-xs font-black uppercase tracking-[0.3em] text-aurum-navy">Entity Verification</h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Reviewing: {user.id.split('-')[0]}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-aurum-navy transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* MODAL BODY */}
        <div className="p-8 space-y-8">
          <div className="flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-100 border-2 border-slate-200 rounded-full flex items-center justify-center text-aurum-navy text-2xl font-black mb-4">
              {user.full_name.charAt(0)}
            </div>
            <h4 className="text-xl font-serif font-black text-aurum-navy italic">{user.full_name}</h4>
            <span className="text-[10px] bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-black uppercase tracking-widest mt-2">
              Status: {user.kyc_status}
            </span>
          </div>

          <div className="space-y-4">
            <InfoRow icon={<Mail size={14}/>} label="Email Address" value={user.email} />
            <InfoRow icon={<User size={14}/>} label="Legal Role" value={user.role || 'Standard Client'} />
            <InfoRow icon={<Hash size={14}/>} label="System UUID" value={user.id} isMono />
          </div>

          <div className="bg-amber-50 border border-amber-200 p-4 rounded-sm flex gap-4">
            <AlertTriangle className="text-amber-600 shrink-0" size={20} />
            <p className="text-[10px] text-amber-800 font-bold leading-relaxed uppercase">
              Warning: Authorizing this entity will generate a unique Aurum Account Number and enable live financial transactions.
            </p>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-100 bg-white grid grid-cols-2 gap-4">
          <button 
            onClick={onClose}
            className="py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-aurum-navy transition-colors"
          >
            Defer Review
          </button>
          <button 
            onClick={() => onApprove(user.id)}
            className="py-4 bg-aurum-navy text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-aurum-gold hover:text-aurum-navy transition-all shadow-lg"
          >
            <ShieldCheck size={16} /> Authorize Entity
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value, isMono }: any) {
  return (
    <div className="flex items-center gap-4 py-2 border-b border-slate-50">
      <div className="text-slate-300">{icon}</div>
      <div>
        <p className="text-[9px] text-slate-400 font-black uppercase tracking-widest">{label}</p>
        <p className={`text-xs font-bold text-aurum-navy ${isMono ? 'font-mono' : ''}`}>{value}</p>
      </div>
    </div>
  );
}