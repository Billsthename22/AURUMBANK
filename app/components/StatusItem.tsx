import { Activity, ShieldAlert, Zap } from 'lucide-react';

interface StatusItemProps {
  label: string;
  status: string;
  isWarning?: boolean;
}

export const StatusItem = ({ label, status, isWarning }: StatusItemProps) => {
  return (
    <div className="flex justify-between items-center group cursor-default py-1">
      <div className="flex items-center gap-3">
        {/* Dynamic icon based on security status */}
        <div className="transition-transform duration-300 group-hover:scale-110">
          {isWarning ? (
            <ShieldAlert size={12} className="text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
          ) : (
            <Zap size={12} className="text-aurum-gold/40 group-hover:text-aurum-gold transition-colors" />
          )}
        </div>
        
        <span className="text-[10px] text-white/40 uppercase font-bold tracking-[0.2em] group-hover:text-white/80 transition-all">
          {label}
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <span className={`text-[10px] font-black uppercase tracking-widest ${
          isWarning ? 'text-red-500 font-bold' : 'text-aurum-gold'
        }`}>
          {status}
        </span>
        
        {/* Live Signal Pulse */}
        <div className="relative flex h-1.5 w-1.5">
          {isWarning && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full 
            bg-red-400 opacity-75"></span>
          )}
          <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${
            isWarning ? 'bg-red-500' : 'bg-aurum-gold/60'
          }`}></span>
        </div>
      </div>
    </div>
  );
};