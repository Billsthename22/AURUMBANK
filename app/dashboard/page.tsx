import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { jwtVerify } from "jose";
import { pool } from "@/app/lib/db";
import { 
  Settings, 
  History, 
  CreditCard, 
  ArrowRightLeft, 
  LayoutDashboard, 
  ShieldCheck,
  Download,
  Bell,
  Search,
  ChevronRight,
  Wallet
} from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const cookieStore = cookies();
  const token = (await cookieStore).get("aurum_session")?.value;
  if (!token) return redirect("/login");

  let payload: { userId: string; email: string };
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "");
    const verified = await jwtVerify(token, secret);
    payload = verified.payload as any;
  } catch (err) {
    return redirect("/login");
  }

  const userResult = await pool.query("SELECT full_name FROM users WHERE id = $1", [payload.userId]);
  const user = userResult.rows[0];
  const accountsResult = await pool.query("SELECT * FROM accounts WHERE user_id = $1", [payload.userId]);
  const accounts = accountsResult.rows;
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans text-slate-900">
      {/* --- ELITE SIDEBAR --- */}
      <aside className="w-72 bg-[#0A1128] text-white flex flex-col fixed h-full z-50 shadow-2xl">
        <div className="p-10 mb-4">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-8 h-8 bg-gradient-to-tr from-[#C5A059] to-[#F1D299] rotate-45 rounded-sm shadow-[0_0_15px_rgba(197,160,89,0.4)]" />
            <span className="font-serif font-bold tracking-[0.3em] text-lg uppercase bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
              Aurum
            </span>
          </div>
        </div>

        <nav className="flex-1 px-6 space-y-1">
          <NavItem href="/dashboard" icon={<LayoutDashboard size={20} />} label="Overview" active />
          <NavItem href="/dashboard/transfers" icon={<ArrowRightLeft size={20} />} label="Global Transfers" />
          <NavItem href="/dashboard/cards" icon={<CreditCard size={20} />} label="Issued Cards" />
          <NavItem href="/dashboard/history" icon={<History size={20} />} label="Ledger History" />
          <div className="pt-8 pb-4">
            <span className="px-4 text-[10px] uppercase tracking-[0.2em] text-slate-500 font-bold">Preferences</span>
          </div>
          <NavItem href="/dashboard/settings" icon={<Settings size={20} />} label="Security Settings" />
        </nav>

        <div className="p-6 border-t border-white/5">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Concierge</p>
            <p className="text-xs text-white font-medium mb-3">Priority support active.</p>
            <button className="w-full py-2 bg-[#C5A059] text-[#0A1128] text-[10px] font-bold uppercase rounded hover:bg-[#D4AF37] transition-colors">
              Request Call
            </button>
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 ml-72 p-12">
        {/* Top Navbar */}
        <header className="flex justify-between items-center mb-16">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#C5A059] transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search transactions or assets..." 
              className="w-full bg-white border border-slate-200 rounded-full py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#C5A059]/20 focus:border-[#C5A059] transition-all"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer">
              <Bell size={20} className="text-slate-400 hover:text-slate-600" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F8F9FA]" />
            </div>
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border border-white shadow-sm" />
          </div>
        </header>

        {/* Hero Section */}
        <div className="grid grid-cols-12 gap-8 mb-12">
          <div className="col-span-8">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck className="text-[#C5A059]" size={20} />
              <span className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em]">Verified Private Client</span>
            </div>
            <h1 className="text-5xl font-serif font-bold text-[#0A1128] mb-4 leading-tight">
              Welcome Back, <br/>{user.full_name}
            </h1>
            <p className="text-slate-500 max-w-lg">
              Manage your global holdings and institutional-grade ledgers from your secure dashboard.
            </p>
          </div>
          
          <div className="col-span-4 bg-[#0A1128] rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Wallet size={80} />
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-1">Total Liquidity</p>
            <h2 className="text-4xl font-serif font-bold mb-6">
              ${totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </h2>
            <div className="flex gap-4">
              <button className="flex-1 bg-white/10 hover:bg-white/20 backdrop-blur-md py-3 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all">
                Send
              </button>
              <button className="flex-1 bg-[#C5A059] hover:bg-[#D4AF37] py-3 rounded-xl text-[10px] text-[#0A1128] font-bold uppercase tracking-widest transition-all">
                Receive
              </button>
            </div>
          </div>
        </div>

        {/* Accounts Grid */}
        <div className="mb-16">
          <div className="flex justify-between items-end mb-8">
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Asset Portfolios</h3>
            <button className="text-xs font-bold text-[#C5A059] flex items-center gap-1 hover:gap-2 transition-all">
              View All Insights <ChevronRight size={14} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {accounts.map((acc) => (
              <div key={acc.id} className="bg-white border border-slate-100 p-8 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex justify-between items-start mb-10">
                  <div className={`p-3 rounded-2xl ${acc.account_type.toLowerCase().includes('ledger') ? 'bg-[#C5A059]/10 text-[#C5A059]' : 'bg-[#0A1128]/5 text-[#0A1128]'}`}>
                    <Wallet size={24} />
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 bg-slate-50 px-3 py-1 rounded-full uppercase tracking-tighter">
                    {acc.acc_number || "PREMIUM"}
                  </span>
                </div>
                <div>
                  <h4 className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">{acc.account_type}</h4>
                  <div className="text-3xl font-serif font-bold text-[#0A1128]">
                    ${acc.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-slate-50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-[10px] font-bold uppercase text-[#C5A059]">Details</button>
                   <Download size={16} className="text-slate-300 cursor-pointer hover:text-[#C5A059]" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity Table Placeholder */}
        <div className="bg-white rounded-[2rem] border border-slate-100 p-10 shadow-sm">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">Recent Ledger Activity</h3>
          <div className="space-y-6">
            <ActivityRow name="Morgan Stanley Transfer" date="Oct 24, 2023" amount="+$12,400.00" type="credit" />
            <ActivityRow name="Global Logistics Payment" date="Oct 22, 2023" amount="-$2,150.40" type="debit" />
            <ActivityRow name="Portfolio Rebalancing" date="Oct 18, 2023" amount="+$45,000.00" type="credit" />
          </div>
        </div>
      </main>
    </div>
  );
}

// Helper components for cleaner code
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

function ActivityRow({ name, date, amount, type }: { name: string; date: string; amount: string; type: 'credit' | 'debit' }) {
  return (
    <div className="flex justify-between items-center group cursor-pointer border-b border-slate-50 pb-4 last:border-0 last:pb-0">
      <div className="flex gap-4 items-center">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${type === 'credit' ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
          <ArrowRightLeft size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-slate-800 group-hover:text-[#C5A059] transition-colors">{name}</p>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
      </div>
      <p className={`text-sm font-bold ${type === 'credit' ? 'text-green-600' : 'text-slate-800'}`}>{amount}</p>
    </div>
  );
}