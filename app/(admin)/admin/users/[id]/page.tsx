"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { 
  Loader2, ShieldCheck, Mail, Lock, FileText, 
  Download, User as UserIcon, Eye, EyeOff 
} from "lucide-react";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/admin/users/${id}`);
        if (!res.ok) throw new Error("Not found");
        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("Fetch error:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUserDetails();
  }, [id]);

  if (loading) return <div className="p-20 text-center"><Loader2 className="animate-spin mx-auto text-slate-300" size={40} /></div>;
  if (!user) return <div className="p-20 text-center text-slate-500 font-bold">User record not found.</div>;

  return (
    <div className="max-w-5xl mx-auto p-8 space-y-8 animate-in fade-in duration-500">
      
      {/* 1. HEADER CARD: Name, Email, and Status ONLY */}
      <div className="bg-white border border-slate-200 p-8 rounded-sm shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-slate-900 text-yellow-500 flex items-center justify-center text-3xl font-black rounded-sm">
            {(user.first_name || user.firstname || user.full_name)?.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 italic tracking-tight">
              {user.first_name || user.firstname || user.full_name?.split(' ')[0]} {' '}
              {user.last_name || user.surname || user.lastname || user.full_name?.split(' ')[1]}
            </h1>
            <p className="text-slate-500 font-mono flex items-center gap-2 text-sm mt-1">
              <Mail size={14} className="text-slate-400" /> {user.email}
            </p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-sm text-[10px] font-black uppercase tracking-widest border ${user.is_active ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
          {user.is_active ? "● Active Now" : "○ Inactive"}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 2. IDENTITY PROFILE: Account Specifics (No repeating name/email) */}
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 border-b pb-4">
              <UserIcon size={14} /> Account Details
            </h3>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Account Number</label>
                <p className="font-mono font-bold text-blue-900 border-b border-slate-50 pb-1">
                    {user.acc_number || 'NOT_ASSIGNED'}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Assigned Role</label>
                <p className="font-bold text-slate-800 border-b border-slate-50 pb-1">
                    {user.role || 'Standard User'}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Phone Number</label>
                <p className="font-bold text-slate-800 border-b border-slate-50 pb-1">
                    {user.phone_number || 'Not Provided'}
                </p>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 block mb-1">Registration Date</label>
                <p className="font-bold text-slate-800 border-b border-slate-50 pb-1">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </p>
              </div>
            </div>
          </div>

          {/* 3. REGISTRATION DOCUMENTS */}
          <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm">
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 border-b pb-4">
              <FileText size={14} /> Registration Documents
            </h3>
            <div className="space-y-4">
              {[
                { label: 'Government ID', url: user.id_card_url },
                { label: 'Proof of Address', url: user.address_proof_url }
              ].map((doc, i) => (
                <div key={i} className="flex justify-between items-center p-4 bg-slate-50 border border-slate-100 rounded-sm">
                  <div className="flex items-center gap-3">
                    <FileText size={16} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-700">{doc.label}</span>
                  </div>
                  {doc.url ? (
                    <a href={doc.url} target="_blank" className="text-blue-900 hover:text-yellow-600 flex items-center gap-1 text-[10px] font-black uppercase tracking-tighter">
                      <Download size={14} /> View
                    </a>
                  ) : (
                    <span className="text-[10px] font-black uppercase text-slate-300">Not Uploaded</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

       {/* RIGHT COLUMN: SECURITY & STATUS */}
<div className="space-y-8">
  <div className="bg-white border border-slate-200 p-6 rounded-sm shadow-sm border-t-4 border-t-slate-900">
    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
      <Lock size={14} /> Security Credentials
    </h3>
    <div className="space-y-6">
      <div>
        <label className="text-[10px] font-black uppercase text-slate-400 block mb-2">Registered Password (Hash)</label>
        <div className="relative group">
          <input 
            type={showPassword ? "text" : "password"} 
            readOnly 
            /* UPDATED: Changed from user.password to user.password_hash */
            value={user.password_hash || ''} 
            className="w-full font-mono text-xs bg-slate-50 border border-slate-200 p-3 pr-10 rounded-sm text-slate-600 outline-none"
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors"
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        <p className="text-[9px] text-slate-400 mt-2 italic leading-tight">
            Note: This is the encrypted hash stored in 'password_hash'.
        </p>
      </div>
      
      <div className="pt-6 border-t border-slate-100">
        <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase text-slate-400">KYC Status</span>
            <ShieldCheck size={16} className={user.kyc_status === 'Verified' ? 'text-green-500' : 'text-amber-500'} />
        </div>
        <p className="text-sm font-black text-slate-800 uppercase tracking-widest">
            {user.kyc_status || 'PENDING'}
        </p>
      </div>
    </div>
  </div>
</div>
      </div>
    </div>
  );
}