"use client";

import { useState } from 'react';
import { 
  ArrowRightLeft, 
  LayoutDashboard, 
  CreditCard, 
  History, 
  Settings, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Send,
  ChevronRight,
  ArrowLeft,
  Wallet
} from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function TransfersPage() {
  const [step, setStep] = useState(1); 
  const [amount, setAmount] = useState('');
  const [receiverAcc, setReceiverAcc] = useState('');
  const [recipientName, setRecipientName] = useState(''); 
  const [isValidating, setIsValidating] = useState(false);
  const [source, setSource] = useState('facility');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [txnRef, setTxnRef] = useState('');

  const handleAccountLookup = async (acc: string) => {
    const cleanAcc = acc.toUpperCase();
    setReceiverAcc(cleanAcc);
    setError(null);
    
    if (cleanAcc.length >= 10) { 
      setIsValidating(true);
      try {
        const res = await fetch(`/api/admin/users/lookup/${encodeURIComponent(cleanAcc)}`);
        const data = await res.json();
        if (res.ok) {
          setRecipientName(data.name);
        } else {
          setRecipientName('');
          if(cleanAcc.length > 12) setError("Account identifier not recognized in our ledger.");
        }
      } catch (err) {
        setRecipientName('');
      } finally {
        setIsValidating(false);
      }
    } else {
      setRecipientName('');
    }
  };

  const handleExecute = async () => {
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/transactions/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          senderId: "CURRENT_USER_ID", 
          receiverAccNumber: receiverAcc,
          amount: amount,
          description: `Transfer via Aurum ${source}`
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Execution failed");

      setTxnRef(data.reference);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
      setStep(1); 
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900">
      {/* --- SHARED ELITE SIDEBAR --- */}
      <aside className="w-72 bg-[#0A1128] text-white flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-10 mb-4">
          <Link href="/dashboard" className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#C5A059] to-[#F1D299] rotate-45 rounded-sm shadow-[0_0_15px_rgba(197,160,89,0.4)]" />
            <span className="font-serif font-bold tracking-[0.3em] text-lg uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Aurum
            </span>
          </Link>
        </div>

        <nav className="flex-1 px-6 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem href="/dashboard/transfers" icon={<ArrowRightLeft size={20} />} label="Global Transfers" active />
          <NavItem href="/dashboard/cards" icon={<CreditCard size={20} />} label="Issued Cards" />
          <NavItem href="/dashboard/history" icon={<History size={20} />} label="Ledger History" />
          <div className="pt-8 pb-4">
            <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Preferences</span>
          </div>
          <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Security Settings" />
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10 text-center">
            <ShieldCheck size={20} className="mx-auto mb-2 text-[#C5A059]" />
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">End-to-End Encrypted</p>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-72 p-12">
        <header className="mb-12">
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
            <Link href="/dashboard" className="hover:text-[#C5A059]">Dashboard</Link>
            <ChevronRight size={12} />
            <span className="text-[#0A1128]">Move Capital</span>
          </div>
          <h1 className="text-4xl font-serif font-bold text-[#0A1128]">Execute Transfer</h1>
          <p className="text-slate-500 mt-2">Reallocate liquidity between internal ledgers or external institutions.</p>
        </header>

        <div className="max-w-3xl mx-auto">
          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-50 border-l-4 border-red-500 flex items-center gap-4 text-red-700">
              <AlertCircle size={20} />
              <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
          {step === 1 && (
  <motion.div 
    key="step1" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
    className="bg-white rounded-[2rem] border border-slate-100 shadow-xl p-12 space-y-10"
  >
    {/* Method Toggles */}
    <div className="grid grid-cols-2 gap-6">
      <MethodButton 
        active={source === 'facility'} 
        onClick={() => { setSource('facility'); setRecipientName(''); }}
        icon={<RefreshCw size={20} />}
        label="Internal Ledger"
        sub="Instant Settlement"
      />
      <MethodButton 
        active={source === 'external'} 
        onClick={() => { setSource('external'); setRecipientName(''); }}
        icon={<Send size={20} />}
        label="External Wire"
        sub="SWIFT Protocol"
      />
    </div>

    <div className="space-y-8">
      {source === 'facility' ? (
        /* INTERNAL LOOKUP VIEW */
        <div className="space-y-3">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Beneficiary Account Identifier</label>
          <div className="relative">
            <input 
              type="text" 
              value={receiverAcc}
              onChange={(e) => handleAccountLookup(e.target.value)}
              placeholder="AUR-XXXX-XXXX"
              className="w-full text-2xl font-mono border-b-2 border-slate-100 focus:border-[#C5A059] outline-none py-4 transition-all uppercase bg-transparent"
            />
            <div className="absolute right-0 top-1/2 -translate-y-1/2">
              {isValidating ? <Loader2 size={20} className="animate-spin text-[#C5A059]" /> : recipientName ? <CheckCircle2 size={24} className="text-green-500" /> : null}
            </div>
          </div>
          {recipientName && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-green-600">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest">Verified: {recipientName}</span>
            </motion.div>
          )}
        </div>
      ) : (
        /* EXTERNAL WIRE VIEW */
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">SWIFT / BIC CODE</label>
              <input 
                type="text" 
                placeholder="BRCHUS66XXX"
                className="w-full text-lg font-mono border-b border-slate-200 focus:border-[#C5A059] outline-none py-2 bg-transparent uppercase"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Recipient IBAN / Account</label>
              <input 
                type="text" 
                placeholder="US00 0000 0000..."
                onChange={(e) => {
                   setReceiverAcc(e.target.value);
                   // For external, we might "verify" manually or via a different check
                   if(e.target.value.length > 5) setRecipientName("External Beneficiary"); 
                }}
                className="w-full text-lg font-mono border-b border-slate-200 focus:border-[#C5A059] outline-none py-2 bg-transparent uppercase"
              />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Full Legal Name / Entity</label>
            <input 
              type="text" 
              placeholder="GLOBAL HOLDINGS LTD"
              className="w-full text-lg border-b border-slate-200 focus:border-[#C5A059] outline-none py-2 bg-transparent uppercase"
              onChange={(e) => setRecipientName(e.target.value)}
            />
          </div>
        </motion.div>
      )}

      {/* Amount Input - Shared between both */}
      <div className="space-y-3">
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Settlement Amount (USD)</label>
        <div className="relative border-b-2 border-slate-100 focus-within:border-[#C5A059] transition-all">
          <span className="absolute left-0 top-1/2 -translate-y-1/2 text-4xl font-serif text-slate-300">$</span>
          <input 
            type="number" 
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            className="w-full text-6xl font-serif pl-10 py-6 outline-none bg-transparent"
          />
        </div>
        <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tighter">
          {source === 'external' ? "Note: SWIFT Fees may be applied by the intermediary bank." : "Internal transfers are settled instantly with zero commission."}
        </p>
      </div>
    </div>

    <button 
      disabled={!amount || !recipientName || !receiverAcc}
      onClick={() => setStep(2)}
      className="w-full bg-[#0A1128] text-white py-6 rounded-2xl text-[11px] font-bold uppercase tracking-[0.3em] hover:bg-[#C5A059] hover:text-[#0A1128] transition-all disabled:opacity-20 shadow-2xl"
    >
      Review {source === 'external' ? 'Global Wire' : 'Execution'} Details
    </button>
  </motion.div>
)}
            {step === 2 && (
              <motion.div 
                key="step2" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-12 space-y-8 overflow-hidden relative"
              >
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-[#C5A059] to-[#F1D299]" />
                <h3 className="text-xs font-bold uppercase tracking-[0.3em] text-center text-slate-400 mb-4">Transaction Audit</h3>
                
                <div className="space-y-6 border-y border-slate-50 py-10">
                  <ReviewRow label="Beneficiary" value={recipientName} />
                  <ReviewRow label="Account" value={receiverAcc} isMono />
                  <ReviewRow label="Priority" value="High (T-0 Settlement)" />
                  <div className="pt-6 border-t border-slate-50 flex justify-between items-end">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Final Amount</span>
                    <span className="text-4xl font-serif font-bold text-[#C5A059]">${Number(amount).toLocaleString()}</span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="flex-1 py-5 rounded-xl border border-slate-200 text-[11px] font-bold uppercase tracking-widest hover:bg-slate-50 transition flex items-center justify-center gap-2">
                    <ArrowLeft size={14} /> Edit
                  </button>
                  <button 
                    onClick={handleExecute}
                    disabled={isProcessing}
                    className="flex-[2] bg-[#0A1128] text-white py-5 rounded-xl text-[11px] font-bold uppercase tracking-widest flex justify-center items-center gap-3 hover:shadow-lg transition-all"
                  >
                    {isProcessing ? <><Loader2 className="animate-spin" size={18}/> Signing Ledger...</> : 'Authorize Signature'}
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-16 text-center space-y-8"
              >
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="text-green-500" size={48} />
                </div>
                <div>
                  <h3 className="text-3xl font-serif font-bold text-[#0A1128] mb-2">Capital Finalized</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto leading-relaxed">
                    Assets have been successfully reallocated to <span className="text-[#0A1128] font-bold">{recipientName}</span>.
                  </p>
                </div>
                
                <div className="bg-slate-50 p-6 rounded-2xl border border-dashed border-slate-200">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Audit Reference</p>
                  <p className="text-xs font-mono font-bold text-[#0A1128]">{txnRef}</p>
                </div>

                <Link href="/dashboard" className="block w-full bg-[#0A1128] text-white py-5 rounded-xl text-[11px] font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#0A1128] transition-all">
                  Return to Dashboard
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

// Sub-components to match dashboard style
function NavItem({ href, icon, label, active = false }: { href: string; icon: any; label: string; active?: boolean }) {
  return (
    <Link 
      href={href} 
      className={`flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-200 ${
        active 
        ? "bg-gradient-to-r from-[#C5A059] to-[#D4AF37] text-[#0A1128] font-bold shadow-lg" 
        : "text-slate-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {icon}
      <span className="text-sm tracking-wide">{label}</span>
    </Link>
  );
}

function MethodButton({ active, onClick, icon, label, sub }: any) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-2xl border-2 text-left transition-all duration-300 ${
        active ? 'border-[#C5A059] bg-white shadow-md' : 'border-transparent bg-slate-50 opacity-60 hover:opacity-100'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${active ? 'bg-[#0A1128] text-[#C5A059]' : 'bg-slate-200 text-slate-500'}`}>
        {icon}
      </div>
      <p className="text-xs font-black uppercase tracking-widest text-[#0A1128]">{label}</p>
      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter mt-1">{sub}</p>
    </button>
  );
}

function ReviewRow({ label, value, isMono = false }: any) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-bold text-[#0A1128] ${isMono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}