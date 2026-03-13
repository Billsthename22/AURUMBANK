"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import { 
  Search, 
  MoreHorizontal, 
  UserCheck, 
  UserX, 
  ShieldAlert, 
  Filter, 
  Loader2,
  Circle
} from 'lucide-react';

interface User {
  id: string;
  full_name: string;
  email: string;
  acc_number: string;
  kyc_status: string;
  is_verified: boolean;
  role: string;
  is_active?: boolean; // Added for status tracking
}

export default function UserLedger() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('/api/admin/users/allusers');
        const data = await res.json();
        const userData = Array.isArray(data) ? data : data.users || [];
        setUsers(userData);
      } catch (error) {
        console.error("Ledger sync failure", error);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = (users || []).filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.acc_number?.includes(searchTerm)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* HEADER & SEARCH */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h2 className="text-4xl font-serif font-black text-aurum-navy tracking-tight italic">
            Institutional <span className="text-aurum-gold">Ledger</span>
          </h2>
          <p className="text-slate-400 text-[10px] mt-1 uppercase tracking-[0.2em] font-bold">
            Verified Entities: {users?.filter(u => u.kyc_status === 'Verified').length || 0}
          </p>
        </div>

        <div className="flex gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-aurum-gold transition-colors" size={16} />
            <input 
              type="text" 
              placeholder="Search Ledger..."
              className="w-full bg-white border border-slate-200 pl-10 pr-4 py-3 text-xs outline-none focus:border-aurum-gold transition-all shadow-sm"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="bg-white border border-slate-200 p-3 text-slate-400 hover:text-aurum-navy shadow-sm transition-all">
            <Filter size={18} />
          </button>
        </div>
      </div>

      {/* DATA TABLE */}
      <div className="bg-white border border-slate-200 shadow-sm rounded-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Identify</th>
              <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Account Details</th>
              <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400">Status & KYC</th>
              <th className="p-5 text-[10px] uppercase tracking-[0.2em] font-black text-slate-400 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={4} className="p-20 text-center">
                  <Loader2 className="animate-spin mx-auto text-aurum-gold mb-4" size={32} />
                  <p className="text-[10px] uppercase font-black tracking-widest text-slate-300">Syncing Secure Records...</p>
                </td>
              </tr>
            ) : filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="p-5">
                  {/* WRAP IN LINK FOR NAVIGATION */}
                  <Link href={`/admin/users/${user.id}`} className="flex items-center gap-4 cursor-pointer">
                    <div className="relative">
                        <div className="w-10 h-10 bg-slate-900 text-aurum-gold flex items-center justify-center font-black text-xs rounded-sm group-hover:bg-aurum-navy transition-colors">
                        {user.full_name?.charAt(0) || "?"}
                        </div>
                        {/* Activity Indicator Overlay */}
                        <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${user.is_active ? 'bg-green-500' : 'bg-slate-300'}`} />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 group-hover:text-aurum-gold transition-colors">{user.full_name}</p>
                      <p className="text-[10px] font-mono text-slate-400 tracking-tighter">{user.email}</p>
                    </div>
                  </Link>
                </td>
                <td className="p-5">
                  <p className="text-xs font-mono font-bold text-slate-600 tracking-widest">
                    {user.acc_number || "UNASSIGNED"}
                  </p>
                  <p className="text-[9px] uppercase font-black text-slate-300 mt-1">{user.role}</p>
                </td>
                <td className="p-5">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 text-[9px] font-black uppercase tracking-widest rounded-sm border ${
                      user.kyc_status === 'Verified' 
                        ? 'bg-green-50 border-green-200 text-green-700' 
                        : 'bg-amber-50 border-amber-200 text-amber-700'
                    }`}>
                      {user.kyc_status}
                    </span>
                    <div className="flex items-center gap-1.5 border-l pl-3 border-slate-200">
                        {user.is_verified ? (
                        <UserCheck size={14} className="text-blue-500" />
                        ) : (
                        <UserX size={14} className="text-slate-300" />
                        )}
                        <span className="text-[9px] uppercase font-bold text-slate-400">
                            {user.is_active ? 'Active' : 'Offline'}
                        </span>
                    </div>
                  </div>
                </td>
                <td className="p-5 text-right">
                  <Link href={`/admin/users/${user.id}`} className="inline-block p-2 text-slate-300 hover:text-aurum-navy transition-colors">
                    <MoreHorizontal size={20} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {!loading && filteredUsers.length === 0 && (
          <div className="p-20 text-center">
            <ShieldAlert className="mx-auto text-slate-200 mb-4" size={48} />
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">No matching entities found in ledger.</p>
          </div>
        )}
      </div>
    </div>
  );
}