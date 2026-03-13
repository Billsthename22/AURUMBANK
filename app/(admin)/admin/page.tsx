"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Globe, ChevronRight, Fingerprint, Zap, UserPlus, LogIn } from "lucide-react";

export default function AdminPortal() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [booting, setBooting] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setBooting(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    // Determine which endpoint to hit
    const endpoint = isRegistering ? "/api/admin/register" : "/api/admin/login";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegistering) {
          setSuccess("IDENTITY_CREATED: PROCEED TO LOGIN");
          setIsRegistering(false);
        } else {
          router.push("/admin/dashboard");
        }
      } else {
        setError(data.error || "PROTOCOL_REJECTED");
      }
    } catch (err) {
      setError("UPLINK_FAILURE");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`fixed inset-0 z-[9999] bg-[#020202] flex items-center justify-center p-4 transition-opacity duration-700 ${booting ? 'opacity-0' : 'opacity-100'}`}>
      
      {/* --- BACKGROUND VISUALS --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.08)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:40px_40px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-gradient-to-b from-transparent via-aurum-gold/30 to-transparent animate-pulse" />
      </div>

      <div className="w-full max-w-md relative">
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center justify-center w-20 h-20 border border-aurum-gold/30 rounded-full mb-2 relative group">
            <div className={`absolute inset-0 rounded-full border border-aurum-gold/10 ${loading ? 'animate-spin border-t-aurum-gold' : 'animate-ping'}`} />
            <Fingerprint className="text-aurum-gold" size={32} />
          </div>
          <div>
            <h1 className="text-white text-3xl font-light tracking-[0.5em] uppercase">
              Aurum <span className="text-aurum-gold font-bold">Portal</span>
            </h1>
            <p className="text-[10px] text-white/30 font-mono tracking-[0.3em] uppercase mt-2">
              {isRegistering ? "Register New Administrator" : "Secure Entry Protocol"}
            </p>
          </div>
        </div>

        <div className="bg-[#050505]/60 backdrop-blur-2xl border border-white/10 rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden">
          <div className="h-[2px] w-full bg-white/5 relative overflow-hidden">
             <div className="absolute inset-0 bg-aurum-gold/50 w-1/3 animate-slide" />
          </div>
          
          <form onSubmit={handleSubmit} className="p-10 space-y-8">
            <div className="space-y-5">
              <input
                type="email"
                required
                placeholder="IDENTITY_ID"
                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/10 text-xs font-mono tracking-widest focus:border-aurum-gold outline-none transition-all"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
              <input
                type="password"
                required
                placeholder="ACCESS_KEY"
                className="w-full bg-transparent border-b border-white/10 py-3 text-white placeholder:text-white/10 text-xs font-mono tracking-widest focus:border-aurum-gold outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </div>

            {(error || success) && (
              <div className="text-center">
                <span className={`text-[9px] font-mono uppercase tracking-widest px-3 py-1 border rounded ${error ? 'text-red-500 bg-red-500/5 border-red-500/20' : 'text-green-500 bg-green-500/5 border-green-500/20'}`}>
                  {error || success}
                </span>
              </div>
            )}

            <div className="space-y-4">
                <button
                disabled={loading}
                className="w-full group bg-transparent border border-aurum-gold/50 hover:bg-aurum-gold text-aurum-gold hover:text-black font-bold py-4 transition-all duration-500 flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
                >
                {loading ? <Loader2 className="animate-spin" size={18} /> : (
                    <>
                    <span className="text-[10px] uppercase tracking-[0.4em]">{isRegistering ? "Create Admin" : "Establish Connection"}</span>
                    <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </>
                )}
                </button>

                <button
                type="button"
                onClick={() => { setIsRegistering(!isRegistering); setError(""); setSuccess(""); }}
                className="w-full text-[9px] font-mono text-white/20 hover:text-aurum-gold uppercase tracking-[0.3em] transition-colors flex items-center justify-center gap-2"
                >
                {isRegistering ? <LogIn size={10} /> : <UserPlus size={10} />}
                {isRegistering ? "Back to Login" : "Initialize New Admin Request"}
                </button>
            </div>
          </form>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
        .animate-slide {
          animation: slide 3s infinite linear;
        }
      `}</style>
    </div>
  );
}