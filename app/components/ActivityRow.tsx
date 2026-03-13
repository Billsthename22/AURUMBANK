import React from 'react';

interface ActivityRowProps {
  user: string;
  action: string;
  amount: string | number;
  time: string;
  type?: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER' | 'KYC_UPDATE';
}

export const ActivityRow = ({ user, action, amount, time, type }: ActivityRowProps) => {
  // Determine color based on amount prefix or type
  const isCredit = amount.toString().startsWith('+') || type === 'DEPOSIT';
  const isNeutral = amount.toString() === 'N/A' || amount.toString() === '$0.00';

  return (
    <div className="p-5 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-default border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-4">
        {/* Avatar Placeholder with Initials */}
        <div className="w-10 h-10 bg-slate-100 border border-slate-200 flex items-center justify-center text-aurum-navy font-black text-xs uppercase rounded-sm shrink-0">
          {user.split(' ').map(n => n[0]).join('').slice(0, 2)}
        </div>
        
        <div>
          <p className="text-sm font-black text-aurum-navy leading-tight">
            {user}
          </p>
          <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-0.5">
            {action.replace('_', ' ')}
          </p>
        </div>
      </div>

      <div className="text-right">
        <p className={`text-sm font-mono font-bold ${
          isNeutral ? 'text-slate-400' : isCredit ? 'text-green-600' : 'text-red-600'
        }`}>
          {amount}
        </p>
        <p className="text-[9px] text-slate-400 font-bold uppercase mt-1 tracking-tighter">
          {time}
        </p>
      </div>
    </div>
  );
};