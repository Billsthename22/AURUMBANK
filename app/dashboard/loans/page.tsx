"use client";

import { useState, useMemo } from 'react';
import { 
  Wallet, 
  ArrowUpRight, 
  CreditCard, 
  Clock, 
  ShieldCheck, 
  TrendingUp, 
  Info,
  ChevronRight,
  Plus,
  AlertCircle,
  Loader2,
  CheckCircle2,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function LoansPage() {
  // Logic State
  const collateralValue = 1204320.50;
  const ltvLimit = 0.80; // 80% Max LTV
  
  const [requestAmount, setRequestAmount] = useState<number>(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Derived Logic
  const maxBorrowable = useMemo(() => collateralValue * ltvLimit, [collateralValue]);
  const currentLTV = useMemo(() => (requestAmount / collateralValue) * 100, [requestAmount]);
  const isOverLimit = requestAmount > maxBorrowable;

  // Interaction Logic
  const handleGenerateOffer = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex font-sans">
      
      {/* --- SIDEBAR NAVIGATION --- */}
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
          <NavItem href="/dashboard/loans" icon={<ShieldCheck size={18}/>} label="Loans" active />
        </nav>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className="flex-1 ml-64 p-10">
        <header className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-2xl font-serif font-bold text-aurum-navy">Capital Financing</h2>
            <p className="text-sm text-gray-400 font-medium">Leverage assets for institutional liquidity.</p>
          </div>

          {/* NEW: Navigation to Facility Builder */}
          <Link href="/dashboard/loans/new">
            <button className="bg-aurum-navy text-white px-6 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-aurum-gold transition-all flex items-center gap-2 shadow-xl hover:-translate-y-1">
              <Plus size={14}/> Establish New Facility
            </button>
          </Link>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
          
          {/* --- LEFT: ACTIVE FACILITIES --- */}
          <div className="xl:col-span-2 space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <LoanCard 
                  name="Portfolio Lombard Loan" 
                  limit="$1,000,000" 
                  utilized="$500,000" 
                  progress={50}
                />
                <LoanCard 
                  name="CRE Credit Line" 
                  limit="$5,000,000" 
                  utilized="$350,000" 
                  progress={7}
                />
             </div>
             
             <div className="bg-white border border-gray-100 p-8 shadow-sm">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">Recent Drawdowns</h3>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-aurum-navy font-medium">Drawdown - LN-4482-B</span>
                    <span className="font-mono font-bold">$25,000.00</span>
                  </div>
                  <div className="flex justify-between text-sm py-2 border-b border-gray-50">
                    <span className="text-aurum-navy font-medium">Interest Accrual - Monthly</span>
                    <span className="font-mono text-red-500 font-bold">$1,540.20</span>
                  </div>
                </div>
             </div>
          </div>

          {/* --- RIGHT: DYNAMIC LTV CALCULATOR --- */}
          <div className="space-y-6">
            <div className="bg-white border border-gray-100 p-8 shadow-lg relative overflow-hidden">
              <div className="flex items-center gap-2 mb-8 text-aurum-navy">
                <TrendingUp size={18} />
                <h4 className="text-xs font-bold uppercase tracking-[0.2em]">Liquidity Estimator</h4>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase block mb-4">Request Drawdown</label>
                  <div className="relative">
                    <span className="absolute left-0 top-2 text-2xl font-serif text-gray-300">$</span>
                    <input 
                      type="number" 
                      value={requestAmount || ''}
                      onChange={(e) => setRequestAmount(Number(e.target.value))}
                      placeholder="0.00"
                      className="w-full pl-6 text-3xl font-serif border-b-2 border-gray-100 outline-none focus:border-aurum-gold transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-[10px] font-bold uppercase">
                    <span className="text-gray-400">Projected LTV</span>
                    <span className={isOverLimit ? 'text-red-600' : 'text-aurum-gold'}>
                      {currentLTV.toFixed(2)}%
                    </span>
                  </div>
                  <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${isOverLimit ? 'bg-red-600' : 'bg-aurum-gold'}`}
                      style={{ width: `${Math.min(currentLTV, 100)}%` }}
                    />
                  </div>
                  {isOverLimit && (
                    <div className="flex gap-2 text-red-600 items-start mt-2">
                      <AlertCircle size={14} className="shrink-0" />
                      <p className="text-[9px] leading-tight font-bold uppercase italic">Exceeds Maximum Institutional LTV Policy (80%)</p>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-gray-100 space-y-4">
                  <div className="flex justify-between text-[10px] font-medium">
                    <span className="text-gray-400">MAX BORROWABLE</span>
                    <span className="text-aurum-navy font-bold">${maxBorrowable.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={handleGenerateOffer}
                    disabled={isOverLimit || requestAmount <= 0 || isProcessing}
                    className="w-full bg-aurum-navy text-white py-4 text-[10px] font-bold uppercase tracking-[0.2em] disabled:bg-gray-200 disabled:cursor-not-allowed hover:bg-aurum-gold transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    {isProcessing ? (
                      <><Loader2 className="animate-spin" size={16} /> Verifying...</>
                    ) : (
                      "Generate Facility Offer"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* --- SUCCESS MODAL --- */}
      {showSuccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-aurum-navy/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSuccess(false)} />
          <div className="relative bg-white max-w-md w-full p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowSuccess(false)} className="absolute top-6 right-6 text-gray-400 hover:text-aurum-navy">
              <X size={20} />
            </button>
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-50 rounded-full">
                <CheckCircle2 className="text-green-600" size={32} />
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-aurum-navy">Facility Authorized</h3>
                <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                  Your request for <span className="font-bold text-aurum-navy">${requestAmount.toLocaleString()}</span> has been approved. Funds will be settled into your ledger shortly.
                </p>
              </div>
              <div className="bg-slate-50 p-4 rounded text-left border border-gray-100">
                <p className="text-[10px] font-bold text-gray-400 uppercase">Auth Code</p>
                <p className="text-xs font-mono font-bold text-aurum-navy tracking-widest">AURM-TXN-{Math.random().toString(36).toUpperCase().substring(7)}</p>
              </div>
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full bg-aurum-navy text-white py-4 text-[10px] font-bold uppercase tracking-widest hover:bg-aurum-gold transition shadow-md"
              >
                Return to Finance
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function LoanCard({ name, limit, utilized, progress }: any) {
  return (
    <div className="bg-white border border-gray-100 p-6 shadow-sm hover:border-aurum-gold transition-all cursor-pointer group">
      <div className="flex justify-between items-start mb-1">
        <h4 className="font-serif font-bold text-aurum-navy">{name}</h4>
        <ChevronRight size={14} className="text-gray-300 group-hover:text-aurum-gold transition-colors" />
      </div>
      <p className="text-[10px] text-gray-400 uppercase font-bold mb-6">Limit: {limit}</p>
      
      <div className="space-y-2">
        <div className="flex justify-between text-[9px] font-bold uppercase">
          <span className="text-gray-400">Utilization</span>
          <span className="text-aurum-navy font-mono">{utilized}</span>
        </div>
        <div className="w-full h-1 bg-gray-100 rounded-full">
          <div className="bg-aurum-navy h-full transition-all duration-1000" style={{ width: `${progress}%` }} />
        </div>
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