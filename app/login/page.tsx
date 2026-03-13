"use client";

import Link from 'next/link';
import { Lock, ShieldCheck, Cpu } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();
  
  // 1. STATE FOR FORM DATA
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
const emailFromUrl = searchParams.get('email');
 // 2. API HANDLER
 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault(); // 🛑 STOP the page from refreshing
  setLoading(true);
  setError('');

  try {
    const response = await fetch('http://localhost:8080/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include', // 🛡️ ALLOW the secure cookie
    });

    if (response.ok) {
      // Use window.location.assign for a clean "Hard" redirect 
      // This ensures the browser recognizes the new secure session
      window.location.assign('/dashboard');
    } else {
      const data = await response.json();
      setError(data.error || 'Authentication Failed');
    }
  } catch (err) {
    setError('Institutional security server unreachable.');
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex font-sans bg-white">
      {/* --- LEFT SIDE: BRANDING & SECURITY ASSURANCE --- */}
      <div className="hidden lg:flex w-1/2 bg-aurum-navy p-16 flex-col justify-between relative overflow-hidden">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3 mb-20">
            <div className="w-8 h-8 bg-aurum-gold rotate-45 flex items-center justify-center">
              <span className="text-aurum-navy -rotate-45 font-bold text-sm italic">A</span>
            </div>
            <span className="text-white font-serif text-xl tracking-widest font-bold">AURUM BANK</span>
          </Link>
          
          <h2 className="text-5xl font-serif text-white leading-tight mb-8">
            Secure Access to <br />
            <span className="text-aurum-gold italic">Global Capital.</span>
          </h2>
          
          <div className="space-y-8 max-w-sm">
            <div className="flex gap-4">
              <ShieldCheck className="text-aurum-gold shrink-0" size={24} />
              <p className="text-gray-400 text-sm italic">Advanced Fraud Detection Engine monitoring all active sessions.</p>
            </div>
            <div className="flex gap-4">
              <Cpu className="text-aurum-gold shrink-0" size={24} />
              <p className="text-gray-400 text-sm italic">Hardware-level encryption for device verification and tracking.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-[10px] text-gray-500 tracking-[0.3em] uppercase">
          Institutional Security Framework v4.2
        </div>

        {/* Decorative background logo */}
        <div className="absolute -bottom-20 -left-20 w-96 h-96 border-[1px] border-aurum-gold/10 rotate-45" />
      </div>

      {/* --- RIGHT SIDE: LOGIN FORM --- */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 md:p-16">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h3 className="text-3xl font-serif font-bold text-aurum-navy mb-2">Client Login</h3>
            <p className="text-gray-500 text-sm">Please enter your institutional credentials to continue.</p>
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleLogin}>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Corporate Email</label>
              <input 
                type="email" 
                className="w-full border-b-2 border-gray-100 py-3 focus:border-aurum-gold outline-none transition-colors text-aurum-navy font-medium"
                placeholder="client@aurum-global.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Security Password</label>
              <input 
                type="password" 
                className="w-full border-b-2 border-gray-100 py-3 focus:border-aurum-gold outline-none transition-colors text-aurum-navy font-medium"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 accent-aurum-navy" />
                <span className="text-xs text-gray-500 group-hover:text-aurum-navy transition">Remember Device</span>
              </label>
              <Link href="/forgotpassword" className="text-xs font-bold text-aurum-gold hover:text-aurum-navy transition">Recover Access</Link>
            </div>

            <button
  type="submit"
  disabled={loading}
  className="w-full bg-aurum-navy text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-aurum-gold transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
>
  <Lock size={14} /> {loading ? 'Authenticating...' : 'Authenticate Session'}
</button>
          </form>

          <div className="mt-12 pt-8 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              New to AURUM? <Link href="/register" className="text-aurum-navy font-bold hover:text-aurum-gold transition">Open a Private Account</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

