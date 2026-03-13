import Link from 'next/link';
import { ShieldCheck, Globe, Landmark, BarChart3, ChevronRight, Lock, FileText, Users } from 'lucide-react';

export default function AurumLanding() {
  return (
    <div className="min-h-screen bg-white font-sans text-aurum-navy">
      {/* --- TOP UTILITY BAR --- */}
      <div className="bg-aurum-navy text-[10px] text-white/60 py-2 px-8 flex justify-between uppercase tracking-widest border-b border-white/10">
        <div className="flex gap-6">
          <span>Institutional Banking</span>
          <span>Asset Management</span>
          <span>Global Markets</span>
        </div>
        <div className="flex gap-4">
          <Link href="/security" className="hover:text-aurum-gold transition">Security Center</Link>
          <Link href="/compliance" className="hover:text-aurum-gold transition">Regulatory Disclosure</Link>
        </div>
      </div>

      {/* --- MAIN NAVIGATION --- */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 px-8 py-5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-aurum-navy flex items-center justify-center rotate-45 border-2 border-aurum-gold">
            <span className="text-aurum-gold -rotate-45 font-serif font-bold text-xl">A</span>
          </div>
          <div>
            <h1 className="text-2xl font-serif font-bold tracking-tighter leading-none">AURUM</h1>
            <p className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Global Bank</p>
          </div>
        </div>
        
        <div className="hidden lg:flex gap-10 text-xs font-bold uppercase tracking-widest">
          <Link href="/about" className="hover:text-aurum-gold transition">About Us</Link>
          <Link href="/investors" className="hover:text-aurum-gold transition">Investor Relations</Link>
          <Link href="/careers" className="hover:text-aurum-gold transition">Careers</Link>
          <Link href="/news" className="hover:text-aurum-gold transition">News</Link>
        </div>

        <div className="flex gap-4 items-center">
          <Link href="/login" className="text-xs font-bold uppercase tracking-widest px-4 py-2 hover:text-aurum-gold transition">
            Login
          </Link>
          <Link href="/register" className="bg-aurum-navy text-white text-xs font-bold uppercase tracking-widest px-6 py-3 hover:bg-aurum-gold transition duration-300">
            Open Account
          </Link>
        </div>
      </nav>

      {/* --- HERO SECTION --- */}
      <header className="relative bg-aurum-navy pt-32 pb-48 px-8 overflow-hidden text-white">
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="inline-block px-3 py-1 border border-aurum-gold/50 text-aurum-gold text-[10px] uppercase tracking-[0.4em] mb-8">
            Digital Banking Infrastructure 
          </div>
          <h2 className="text-6xl md:text-8xl font-serif leading-[1.1] mb-8 max-w-4xl">
            The <span className="italic">Architects</span> of <br />
            Global Finance.
          </h2>
          <p className="text-gray-400 text-xl max-w-xl mb-12 leading-relaxed font-light">
            AURUM BANK delivers a full-scale digital banking platform designed with 
            traditional global architecture and enterprise-level simulation[cite: 3, 4].
          </p>
          <div className="flex flex-wrap gap-6">
            <button className="bg-aurum-gold text-aurum-navy px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-white transition-colors duration-300">
              Begin Application [cite: 38]
            </button>
            <button className="border border-white/30 text-white px-10 py-5 font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-colors">
              Corporate Profile [cite: 29]
            </button>
          </div>
        </div>
        
        {/* Abstract Architectural Background Elements */}
        <div className="absolute bottom-0 right-0 w-1/3 h-full bg-aurum-gold/5 -skew-x-12 translate-x-20" />
      </header>

      {/* --- ENTERPRISE CAPABILITIES --- */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-4 gap-12 border-t border-gray-100 pt-16">
          <div className="lg:col-span-1">
            <h3 className="text-3xl font-serif italic mb-6">Core System Modules</h3>
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Simulating enterprise-level financial infrastructure including audit logging and fraud detection[cite: 5].
            </p>
            <Link href="/compliance" className="text-aurum-navy font-bold text-xs uppercase tracking-widest border-b-2 border-aurum-gold pb-1">
              View Compliance [cite: 31]
            </Link>
          </div>
          
          <div className="lg:col-span-3 grid md:grid-cols-2 gap-8">
            {[
              { icon: <ShieldCheck className="text-aurum-gold" />, title: "Fraud Detection", desc: "Real-time engine simulating institutional risk scoring[cite: 75, 76]." },
              { icon: <Globe className="text-aurum-gold" />, title: "Global Transfers", desc: "Internal and external transfer engines for cross-border simulation[cite: 48]." },
              { icon: <Landmark className="text-aurum-gold" />, title: "Loan Management", desc: "Automated interest calculation engines and repayment plans[cite: 51, 77]." },
              { icon: <BarChart3 className="text-aurum-gold" />, title: "Revenue Analytics", desc: "Administrative oversight with high-level financial reporting[cite: 58]." },
            ].map((feature, i) => (
              <div key={i} className="group p-8 border border-gray-50 hover:border-aurum-gold/20 hover:bg-slate-50 transition-all">
                <div className="mb-6">{feature.icon}</div>
                <h4 className="text-lg font-serif font-bold mb-3">{feature.title}</h4>
                <p className="text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SYSTEM INTEGRITY BANNER --- */}
      <section className="bg-[#F8F9FA] py-24 px-8 border-y border-gray-100">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16 items-center">
          <div className="flex items-start gap-4">
            <Lock size={40} className="text-aurum-navy shrink-0" />
            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-2">Role-Based Access</h5>
              <p className="text-sm text-gray-500">Secure environments for Customers, Risk Officers, and Admins[cite: 19].</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <FileText size={40} className="text-aurum-navy shrink-0" />
            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-2">Double-Entry Model</h5>
              <p className="text-sm text-gray-500">Full ledger transparency with comprehensive audit trails[cite: 65, 74].</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <Users size={40} className="text-aurum-navy shrink-0" />
            <div>
              <h5 className="font-bold uppercase tracking-widest text-xs mb-2">KYC Compliance</h5>
              <p className="text-sm text-gray-500">Enterprise-grade user verification and document handling[cite: 39].</p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-aurum-navy text-white pt-20 pb-10 px-8">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 mb-20">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-aurum-gold rotate-45" />
              <span className="text-2xl font-serif font-bold tracking-widest">AURUM BANK</span>
            </div>
            <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
              Designed as a simulation of enterprise financial infrastructure. 
              Our architecture provides institutional-grade banking features for the digital age[cite: 4, 5].
            </p>
          </div>
          <div>
            <h6 className="font-bold uppercase tracking-widest text-[10px] text-aurum-gold mb-6">Navigation</h6>
            <ul className="text-sm text-gray-400 space-y-3">
              <li><Link href="/about" className="hover:text-white transition">About Us [cite: 28]</Link></li>
              <li><Link href="/investors" className="hover:text-white transition">Investor Relations [cite: 29]</Link></li>
              <li><Link href="/news" className="hover:text-white transition">News [cite: 32]</Link></li>
              <li><Link href="/careers" className="hover:text-white transition">Careers [cite: 33]</Link></li>
            </ul>
          </div>
          <div>
            <h6 className="font-bold uppercase tracking-widest text-[10px] text-aurum-gold mb-6">Support</h6>
            <ul className="text-sm text-gray-400 space-y-3">
              <li><Link href="/contact" className="hover:text-white transition">Contact [cite: 34]</Link></li>
              <li><Link href="/security" className="hover:text-white transition">Security Center [cite: 30]</Link></li>
              <li><Link href="/compliance" className="hover:text-white transition">Compliance [cite: 31]</Link></li>
              <li><Link href="/faq" className="hover:text-white transition">FAQ [cite: 35]</Link></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between text-[10px] uppercase tracking-widest text-gray-500 gap-4">
          <p>© 2026 AURUM GLOBAL BANKING GROUP. ALL RIGHTS RESERVED.</p>
          <div className="flex gap-8">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Accessibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
}