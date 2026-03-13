"use client";

import React, { useEffect, useState } from 'react';
import { ShieldCheck, FileText, AlertCircle, Clock, ExternalLink } from 'lucide-react';
import KycModal from '@/app/components/admin/KycModal';

export default function ComplianceHub() {
  const [pendingUsers, setPendingUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch only users with status 'Pending'
    fetch('/api/admin/users?status=pending')
      .then(res => res.json())
      .then(data => {
        setPendingUsers(data.filter((u: any) => u.kyc_status === 'Pending'));
        setLoading(false);
      });
  }, []);

  return (
    <div className="space-y-10">
      {/* HEADER */}
      <div className="flex justify-between items-start border-b border-slate-200 pb-8">
        <div>
          <h2 className="text-4xl font-serif font-black text-aurum-navy tracking-tight italic">
            Compliance <span className="text-aurum-gold">Hub</span>
          </h2>
          <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">
            Risk Assessment & Entity Verification Queue
          </p>
        </div>
        
        <div className="flex gap-8">
          <StatMini label="Awaiting Review" value={pendingUsers.length} color="text-amber-500" />
          <StatMini label="Avg. Response Time" value="4.2h" color="text-slate-400" />
        </div>
      </div>

      {/* QUEUE LIST */}
      <div className="grid grid-cols-1 gap-4">
        {pendingUsers.length > 0 ? (
          pendingUsers.map((user: any) => (
            <div 
              key={user.id} 
              className="bg-white border border-slate-200 p-6 flex items-center justify-between hover:border-aurum-gold transition-all cursor-pointer group"
              onClick={() => setSelectedUser(user)}
            >
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 flex items-center justify-center text-aurum-navy font-black rounded-sm border border-slate-100">
                  {user.full_name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-black text-aurum-navy group-hover:text-aurum-gold transition-colors">{user.full_name}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-12">
                <div className="hidden md:block">
                  <p className="text-[9px] uppercase font-black text-slate-300 tracking-widest">Submission Date</p>
                  <p className="text-xs font-bold text-aurum-navy flex items-center gap-2">
                    <Clock size={12} className="text-amber-500" /> 2 Hours Ago
                  </p>
                </div>
                <button className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-aurum-gold hover:text-aurum-navy transition-all">
                  Begin Review <ExternalLink size={14} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-sm">
            <ShieldCheck className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">Queue Clear: All Entities Verified</p>
          </div>
        )}
      </div>

      {/* MODAL INTEGRATION */}
      {selectedUser && (
        <KycModal 
          user={selectedUser} 
          onClose={() => setSelectedUser(null)} 
          onApprove={(id) => {
            // Logic to update local state after approval
            setPendingUsers(prev => prev.filter((u: any) => u.id !== id));
            setSelectedUser(null);
          }} 
        />
      )}
    </div>
  );
}

function StatMini({ label, value, color }: any) {
  return (
    <div className="text-right">
      <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">{label}</p>
      <p className={`text-2xl font-serif font-black italic ${color}`}>{value}</p>
    </div>
  );
}