"use client";

import React, { useEffect, useState } from 'react';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Download, 
  Search, 
  Filter, 
  Clock, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

interface Transaction {
  id: string;
  sender_name: string;
  receiver_name: string;
  amount: string;
  type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  created_at: string;
  reference: string;
}

export default function AuditTrail() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/transactions')
      .then(res => res.json())
      .then(data => {
        setTxns(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif font-black text-aurum-navy tracking-tight italic">
            Audit <span className="text-aurum-gold">Trail</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
            Real-time Immutable Transaction Ledger
          </p>
        </div>
        <button className="flex items-center gap-2 bg-aurum-navy text-white px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest hover:bg-aurum-gold hover:text-aurum-navy transition-all">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* FILTERS BAR */}
      <div className="bg-white border border-slate-200 p-4 flex gap-4 items-center shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
          <input 
            type="text" 
            placeholder="Search Reference, TXN ID, or Entity..." 
            className="w-full pl-10 pr-4 py-2 text-xs outline-none focus:border-aurum-gold border-transparent border transition-all"
          />
        </div>
        <button className="border border-slate-200 px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
          <Filter size={14} /> Filter By Status
        </button>
      </div>

      {/* LEDGER TABLE */}
      <div className="bg-white border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Timestamp</th>
              <th className="p-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Transaction ID</th>
              <th className="p-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Parties</th>
              <th className="p-5 text-[10px] uppercase tracking-widest font-black text-slate-400">Amount</th>
              <th className="p-5 text-[10px] uppercase tracking-widest font-black text-slate-400 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {txns.map((txn) => (
              <tr key={txn.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5 whitespace-nowrap">
                  <p className="text-[11px] font-bold text-aurum-navy uppercase">
                    {new Date(txn.created_at).toLocaleDateString()}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono italic">
                    {new Date(txn.created_at).toLocaleTimeString()}
                  </p>
                </td>
                <td className="p-5">
                  <p className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-tighter">
                    {txn.id.split('-')[0]}...{txn.id.slice(-4)}
                  </p>
                </td>
                <td className="p-5">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-black text-aurum-navy">{txn.sender_name || 'EXTERNAL'}</span>
                    <span className="text-[9px] text-slate-300 font-bold uppercase tracking-tighter italic">TO: {txn.receiver_name}</span>
                  </div>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-2">
                    {txn.type === 'DEPOSIT' ? (
                      <ArrowDownLeft className="text-green-500" size={14} />
                    ) : (
                      <ArrowUpRight className="text-red-500" size={14} />
                    )}
                    <span className="text-sm font-mono font-black text-aurum-navy">
                      ${parseFloat(txn.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </td>
                <td className="p-5 text-right">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm ${
                    txn.status === 'SUCCESS' ? 'bg-green-50 text-green-700' : 
                    txn.status === 'PENDING' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-700'
                  }`}>
                    {txn.status === 'SUCCESS' && <CheckCircle2 size={10} />}
                    {txn.status === 'PENDING' && <Clock size={10} className="animate-pulse" />}
                    {txn.status === 'FAILED' && <AlertCircle size={10} />}
                    {txn.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}