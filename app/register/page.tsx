"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useOnboardingStore } from '@/app/Store/useOnboardingStore';
import { User, Mail, Lock, Upload, Fingerprint, Landmark, ChevronRight } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { formData, setFormData } = useOnboardingStore();

 // Inside your RegisterPage component...

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    const response = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password
      }),
    });

    const data = await response.json();

    if (response.ok) {
      // Success! Move to the next step
      router.push('/register/kyc');
    } else {
      alert(data.error || "Registration failed");
    }
  } catch (err) {
    alert("Could not connect to the server.");
  }
};
  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans flex flex-col items-center py-12 px-6">
      <Link href="/" className="mb-12 flex items-center gap-2">
        <div className="w-6 h-6 bg-aurum-navy rotate-45 border border-aurum-gold" />
        <span className="font-serif font-bold tracking-widest text-aurum-navy uppercase">Aurum Global</span>
      </Link>

      <div className="w-full max-w-4xl bg-white shadow-2xl flex overflow-hidden border border-gray-100">
        {/* LEFT BAR */}
        <div className="hidden md:flex w-1/3 bg-aurum-navy p-10 flex-col text-white">
          <h3 className="text-xl font-serif mb-8 text-aurum-gold italic">Onboarding</h3>
          <div className="space-y-10 relative">
            <StepItem icon={<User size={18}/>} label="Identity" step="01" active />
            <StepItem icon={<Upload size={18}/>} label="KYC Documents" step="02" />
            <StepItem icon={<Fingerprint size={18}/>} label="Security Setup" step="03" />
            <div className="absolute top-0 left-5 w-[1px] h-full bg-white/10 -z-0" />
          </div>
        </div>

        {/* RIGHT FORM */}
        <div className="flex-1 p-10 md:p-16">
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-aurum-navy mb-2">Private Client Application</h2>
            <p className="text-gray-500 text-sm italic">Step 1: Enter your legal identification details.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">First Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({ firstName: e.target.value })}
                  className="w-full border-b border-gray-200 py-2 focus:border-aurum-gold outline-none text-sm transition-colors" 
                  placeholder="Alexander" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Last Name</label>
                <input 
                  required
                  type="text" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({ lastName: e.target.value })}
                  className="w-full border-b border-gray-200 py-2 focus:border-aurum-gold outline-none text-sm transition-colors" 
                  placeholder="Hamilton" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Corporate Email</label>
              <div className="flex items-center gap-3 border-b border-gray-200 py-2 focus-within:border-aurum-gold transition-colors">
                <Mail size={16} className="text-gray-300" />
                <input 
                  required
                  type="email" 
                  value={formData.email}
                  onChange={(e) => setFormData({ email: e.target.value })}
                  className="w-full outline-none text-sm" 
                  placeholder="a.hamilton@aurum.com" 
                />
              </div>
            </div>
            <div className="space-y-2">
  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
    Password
  </label>
  <input
    required
    type="password"
    value={formData.password || ""}
    onChange={(e) => setFormData({ password: e.target.value })}
    className="w-full border-b border-gray-200 py-2 focus:border-aurum-gold outline-none text-sm transition-colors"
    placeholder="Enter secure password"
  />
</div>
            <button type="submit" className="w-full bg-aurum-navy text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-aurum-gold transition-all flex items-center justify-center gap-2 group">
              Continue to KYC <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function StepItem({ icon, label, step, active = false }: any) {
  return (
    <div className="flex items-center gap-4 relative z-10">
      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${active ? 'border-aurum-gold bg-aurum-gold text-aurum-navy' : 'border-white/20 text-white/40'}`}>
        {icon}
      </div>
      <div>
        <p className={`text-[10px] uppercase tracking-widest font-bold ${active ? 'text-white' : 'text-white/40'}`}>Step {step}</p>
        <p className={`text-sm font-medium ${active ? 'text-aurum-gold' : 'text-white/40'}`}>{label}</p>
      </div>
    </div>
  );
}