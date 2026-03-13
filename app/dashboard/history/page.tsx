import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { pool } from "@/app/lib/db";
import { 
  History, Settings, CreditCard, ArrowRightLeft, LayoutDashboard, 
  Search, Download, Bell, Filter, ChevronRight, Wallet 
} from "lucide-react";
import Link from "next/link";

export default async function HistoryPage() {
  // --- AUTHENTICATION ---
  const cookieStore = cookies();
  const token = (await cookieStore).get("aurum_session")?.value;
  if (!token) return redirect("/login");

  let payload: { userId: string };
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const verified = await jwtVerify(token, secret);
    payload = verified.payload as any;
  } catch (err) {
    return redirect("/login");
  }

  // --- DATA FETCHING ---
  const transactionsResult = await pool.query(
    `SELECT *, TO_CHAR(created_at, 'Mon DD, YYYY') as date 
     FROM transactions 
     WHERE user_id = $1 
     ORDER BY created_at DESC`, 
    [payload.userId]
  );
  const transactions = transactionsResult.rows;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900">
      {/* --- ELITE SIDEBAR --- */}
      <aside className="w-72 bg-[#0A1128] text-white flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-10 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#C5A059] to-[#F1D299] rotate-45 rounded-sm" />
            <span className="font-serif font-bold tracking-[0.3em] text-lg uppercase text-white">Aurum</span>
          </div>
        </div>
        <nav className="flex-1 px-6 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" />
          <NavItem href="/dashboard/transfers" icon={<ArrowRightLeft size={20} />} label="Global Transfers" />
          <NavItem href="/dashboard/cards" icon={<CreditCard size={20} />} label="Issued Cards" />
          <NavItem href="/dashboard/history" icon={<History size={20} />} label="Ledger History" active />
          <div className="pt-8 pb-4">
            <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Preferences</span>
          </div>
          <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Security Settings" />
        </nav>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-72 p-12">
        <header className="flex justify-between items-center mb-16">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search ledger by hash or entity..." 
              className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-4 text-sm outline-none focus:border-[#C5A059] transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm">
            <Download size={14} className="text-[#C5A059]" /> Export Audit Log
          </button>
        </header>

        <div className="mb-12">
          <h1 className="text-4xl font-serif font-bold text-[#0A1128] mb-2">Institutional Ledger</h1>
          <p className="text-slate-500">Immutable record of all cross-border and internal capital movements.</p>
        </div>

        {/* --- TRANSACTION TABLE --- */}
        <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex gap-4">
              <FilterTab label="All Activity" active />
              <FilterTab label="Settled" />
              <FilterTab label="Pending" />
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold">
                <th className="px-10 py-6">Counterparty / Date</th>
                <th className="px-10 py-6">Method</th>
                <th className="px-10 py-6 text-right">Volume (USD)</th>
                <th className="px-10 py-6 text-center">Status</th>
                <th className="px-10 py-6"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {transactions.map((tx) => (
                <tr key={tx.id} className="group hover:bg-slate-50 transition-all cursor-pointer">
                  <td className="px-10 py-6">
                    <p className="text-sm font-bold text-[#0A1128] group-hover:text-[#C5A059] transition-colors">{tx.entity}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1">{tx.date}</p>
                  </td>
                  <td className="px-10 py-6">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 px-3 py-1 rounded-md">
                      {tx.type}
                    </span>
                  </td>
                  <td className={`px-10 py-6 text-sm font-bold text-right ${tx.amount > 0 ? 'text-green-600' : 'text-[#0A1128]'}`}>
                    {tx.amount > 0 ? `+ $${tx.amount.toLocaleString()}` : `- $${Math.abs(tx.amount).toLocaleString()}`}
                  </td>
                  <td className="px-10 py-6">
                    <div className="flex justify-center">
                      <span className={`px-4 py-1 text-[9px] font-bold uppercase rounded-full ${
                        tx.status === 'Cleared' ? 'bg-green-50 text-green-600' : 'bg-amber-50 text-amber-600'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <ChevronRight size={16} className="text-slate-200 group-hover:text-[#C5A059] transition-all" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {transactions.length === 0 && (
            <div className="p-20 text-center">
              <History size={48} className="mx-auto text-slate-100 mb-4" />
              <p className="text-slate-400 text-sm italic">No entries found in the current audit window.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Reuse your NavItem component
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

function FilterTab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button className={`px-4 py-1 text-[10px] font-bold uppercase tracking-widest transition-all ${
      active ? "text-[#0A1128] border-b-2 border-[#C5A059]" : "text-slate-400 hover:text-slate-600"
    }`}>
      {label}
    </button>
  );
} 