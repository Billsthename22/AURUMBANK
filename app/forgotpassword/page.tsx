"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Mail, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      });

      if (res.ok) {
        setIsSent(true);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white border border-slate-200 p-10 rounded-sm shadow-sm"
      >
        <AnimatePresence mode="wait">
          {!isSent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 text-yellow-500 rounded-sm mb-4">
                  <ShieldCheck size={32} />
                </div>
                <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase">Reset Access</h2>
                <p className="text-slate-500 text-sm mt-2">Enter your email for a recovery link.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 p-3 pl-10 rounded-sm outline-none focus:border-slate-900 transition-colors font-medium"
                      placeholder="admin@aurum.com"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-slate-900 text-white p-4 rounded-sm font-black uppercase tracking-widest text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  {loading ? <Loader2 className="animate-spin" size={16} /> : "Request Link"}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-green-50 text-green-500 rounded-full mb-6">
                <CheckCircle2 size={48} />
              </div>
              <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">Email Dispatched</h2>
              <p className="text-slate-500 text-sm mt-3 px-4">
                We've sent a secure link to <span className="font-bold text-slate-800">{email}</span>. Please check your inbox.
              </p>
              <button 
                onClick={() => setIsSent(false)}
                className="mt-8 text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 transition-colors"
              >
                Didn't get it? Try again
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center mt-8 pt-6 border-t border-slate-100">
          <Link href="/login" className="text-[10px] font-black uppercase text-slate-400 hover:text-slate-900 flex items-center justify-center gap-1">
            <ArrowLeft size={12} /> Return to Terminal
          </Link>
        </div>
      </motion.div>
    </div>
  );
}