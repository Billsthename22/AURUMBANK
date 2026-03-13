"use client";

import { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Check, 
  Info,
  Coins,
  TrendingUp,
  Wallet,
  ArrowUpRight,
  CreditCard,
  Clock,
  ChevronLeft,
  Lock,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewFacilityPage() {
  const router = useRouter();
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // High-Net-Worth Asset Portfolio
  const collateralPool = useMemo(() => [
    { id: 'cash_01', name: 'Cash Reserves (USD)', balance: 250000, ltv: 0.95, icon: <Wallet size={18}/>, type: 'Cash' },
    { id: 'gold_01', name: 'Physical Gold Bullion', balance: 1200000, ltv: 0.85, icon: <Coins size={18}/>, type: 'Commodity' },
    { id: 'stock_01', name: 'S&P 500 Index Fund', balance: 950000, ltv: 0.65, icon: <TrendingUp size={18}/>, type: 'Equities' },
  ], []);

  // Logic: Real-time Credit Limit Calculation
  const totalLimit = useMemo(() => {
    return collateralPool
      .filter(asset => selectedAssets.includes(asset.id))
      .reduce((acc, asset) => acc + (asset.balance * asset.ltv), 0);
  }, [selectedAssets, collateralPool]);

  const toggleAsset = (id: string) => {
    setSelectedAssets(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    setIsSubmitting(true);
    // Simulate smart contract or bank authorization
    setTimeout(() => {
      router.push('/dashboard/loans?success=true');
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F4F7FA] flex font-sans">
      
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
          <NavItem href="/dashboard/loans" icon={<ShieldCheck size={18}/>} label="Loans" active />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-64 p-10">
        <Link href="/dashboard/loans" className="flex items-center gap-2 text-gray-400 hover:text-aurum-navy transition-colors mb-8 group">
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Back to Financing</span>
        </Link>

        <header className="mb-12">
          <h2 className="text-3xl font-serif font-bold text-aurum-navy">Establish Credit Facility</h2>
          <p className="text-sm text-gray-400 mt-2">Pledge collateralized assets to unlock institutional-grade liquidity lines.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* ASSET SELECTION AREA */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex justify-between items-end mb-4">
              <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500">Available Collateral Pool</h3>
              <span className="text-[10px] text-gray-400 italic">Select assets to pledge</span>
            </div>

            <div className="space-y-4">
              {collateralPool.map((asset) => (
                <button
                  key={asset.id}
                  onClick={() => toggleAsset(asset.id)}
                  className={`w-full text-left p-6 border-2 transition-all duration-300 flex items-center justify-between group ${
                    selectedAssets.includes(asset.id) 
                      ? 'border-aurum-gold bg-white shadow-xl translate-x-2' 
                      : 'border-transparent bg-white/60 hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-5">
                    <div className={`p-4 rounded-full transition-colors ${selectedAssets.includes(asset.id) ? 'bg-aurum-gold text-aurum-navy' : 'bg-slate-100 text-gray-400'}`}>
                      {asset.icon}
                    </div>
                    <div>
                      <p className="font-serif font-bold text-aurum-navy">{asset.name}</p>
                      <div className="flex gap-4 mt-1">
                        <span className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">LTV: {asset.ltv * 100}%</span>
                        <span className="text-[9px] font-bold text-aurum-gold uppercase tracking-tighter">{asset.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-mono font-bold text-aurum-navy">${asset.balance.toLocaleString()}</p>
                    <div className={`mt-2 flex items-center justify-end gap-2 text-[9px] font-bold uppercase ${selectedAssets.includes(asset.id) ? 'text-aurum-navy' : 'text-gray-300'}`}>
                      {selectedAssets.includes(asset.id) ? 'Pledged' : 'Available'}
                      <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${selectedAssets.includes(asset.id) ? 'bg-aurum-navy border-aurum-navy text-white' : 'border-gray-200'}`}>
                        {selectedAssets.includes(asset.id) && <Check size={10} />}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* DYNAMIC CALCULATION SIDEBAR */}
          <div className="lg:col-span-5">
            <div className="bg-aurum-navy p-8 text-white shadow-2xl sticky top-10">
              <div className="flex items-center gap-2 text-aurum-gold mb-8">
                <Lock size={16} />
                <h3 className="text-xs font-bold uppercase tracking-[0.2em]">Facility Terms</h3>
              </div>

              <div className="space-y-8">
                <div>
                  <p className="text-[10px] text-white/40 uppercase font-bold mb-1">New Credit Limit</p>
                  <p className="text-5xl font-serif text-aurum-gold">
                    ${totalLimit.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4 pt-6 border-t border-white/10">
                  <SummaryRow label="Pledged Value" value={`$${collateralPool.filter(a => selectedAssets.includes(a.id)).reduce((s, a) => s + a.balance, 0).toLocaleString()}`} />
                  <SummaryRow label="Avg. LTV Ratio" value={selectedAssets.length ? `${((totalLimit / collateralPool.filter(a => selectedAssets.includes(a.id)).reduce((s, a) => s + a.balance, 0)) * 100).toFixed(1)}%` : '0%'} />
                  <SummaryRow label="Interest Type" value="Variable (SOFR + 1.2%)" />
                </div>

                <div className="bg-white/5 p-4 rounded border border-white/10 flex gap-3">
                  <Info size={18} className="text-aurum-gold shrink-0" />
                  <p className="text-[10px] text-white/60 leading-relaxed">
                    By confirming, you authorize Aurum Global to place a lien on the selected assets as collateral for this revolving credit facility.
                  </p>
                </div>

                <button 
                  onClick={handleConfirm}
                  disabled={selectedAssets.length === 0 || isSubmitting}
                  className="w-full bg-aurum-gold text-aurum-navy py-5 text-[10px] font-bold uppercase tracking-[0.3em] hover:bg-white transition-all disabled:opacity-20 flex justify-center items-center gap-2"
                >
                  {isSubmitting ? (
                    <><Loader2 className="animate-spin" size={16} /> Finalizing Ledger...</>
                  ) : (
                    "Establish Facility"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string, value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] text-white/40 uppercase font-bold tracking-widest">{label}</span>
      <span className="text-xs font-bold">{value}</span>
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