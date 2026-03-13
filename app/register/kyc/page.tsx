"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, Info, ChevronRight } from "lucide-react";
import { useOnboardingStore } from "@/app/Store/useOnboardingStore";

export default function KYCPage() {
  const router = useRouter();
  const { formData, setFormData } = useOnboardingStore();

  const passportInputRef = useRef<HTMLInputElement>(null);
  const utilityInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "passport" | "utility") => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
  
      // 5MB Limit (5 * 1024 * 1024 bytes)
      const MAX_FILE_SIZE = 5 * 1024 * 1024;
  
      if (file.size > MAX_FILE_SIZE) {
        alert(`Dossier rejected: ${file.name} exceeds the 5MB institutional limit.`);
        // Clear the input so the user can try again
        e.target.value = ""; 
        return;
      }
  
      setFormData({ 
        kycDocuments: { 
          ...formData.kycDocuments, 
          [field]: file 
        } 
      });
    }
  };
  const handleSubmit = async () => {
    if (!formData.kycDocuments?.passport || !formData.kycDocuments?.utility) {
      alert("Please upload both required documents to proceed.");
      return;
    }
  
    try {
      // 1. Sync the text data to PostgreSQL
      const response = await fetch('/api/register/kyc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          idType: formData.idType,     // From Step 1 or a hidden field
          idNumber: formData.idNumber, // From Step 1 or a hidden field
          kycStatus: 'submitted'
        }),
      });
  
      if (response.ok) {
        // 2. Mark store as uploaded
        setFormData({ kycUploaded: true });
        // 3. Move to Security
        router.push("/register/security");
      } else {
        alert("Institutional server rejected the dossier. Please check your data.");
      }
    } catch (error) {
      console.error("KYC_SUBMIT_ERROR:", error);
      alert("Connection to security server failed.");
    }
  };
  return (
    <div className="min-h-screen bg-[#F4F7FA] font-sans flex flex-col items-center py-12 px-6">
      <div className="mb-12 flex items-center gap-2">
        <div className="w-6 h-6 bg-aurum-navy rotate-45 border border-aurum-gold" />
        <span className="font-serif font-bold tracking-widest text-aurum-navy uppercase">
          Aurum Global
        </span>
      </div>

      <div className="w-full max-w-4xl bg-white shadow-2xl flex overflow-hidden border border-gray-100">
        {/* --- LEFT SIDEBAR --- */}
        <div className="hidden md:flex w-1/3 bg-aurum-navy p-10 flex-col text-white">
          <h3 className="text-xl font-serif mb-8 text-aurum-gold italic">Onboarding Process</h3>
          <div className="space-y-10 relative">
            <Step icon={<CheckCircle2 size={18} className="text-aurum-gold" />} label="Identity" complete />
            <Step icon={<Upload size={18} />} label="KYC Documents" active />
            <Step icon={<FileText size={18} />} label="Security Setup" pending />
            <div className="absolute top-0 left-5 w-[1px] h-full bg-white/10 -z-0" />
          </div>
        </div>

        {/* --- RIGHT CONTENT --- */}
        <div className="flex-1 p-10 md:p-16">
          <div className="mb-10">
            <h2 className="text-3xl font-serif font-bold text-aurum-navy mb-2">Identity Verification</h2>
            <p className="text-gray-500 text-sm italic">
              Institutional regulation requires verified documentation.
            </p>
          </div>

          <div className="space-y-8">
            {/* PASSPORT / ID */}
            <div className="group">
              <input
                type="file"
                ref={passportInputRef}
                className="hidden"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, "passport")}
              />
              <div className="flex justify-between items-end mb-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurum-navy">
                  01. Primary Identification
                </label>
                {formData.kycDocuments?.passport && (
                  <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={10} /> Ready
                  </span>
                )}
              </div>
              <div
                onClick={() => passportInputRef.current?.click()}
                className={`border-2 border-dashed p-8 rounded-sm transition-all cursor-pointer flex flex-col items-center text-center ${
                  formData.kycDocuments?.passport
                    ? "border-aurum-gold bg-aurum-gold/5"
                    : "border-gray-200 hover:border-aurum-gold hover:bg-slate-50"
                }`}
              >
                <FileText
                  className={`${formData.kycDocuments?.passport ? "text-aurum-gold" : "text-gray-300"} mb-4`}
                  size={32}
                />
                <p className="text-xs font-bold text-aurum-navy mb-1">
                  {formData.kycDocuments?.passport?.name || "Click to upload Passport / National ID"}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">PDF, JPEG, or PNG</p>
              </div>
            </div>

            {/* UTILITY BILL */}
            <div className="group">
              <input
                type="file"
                ref={utilityInputRef}
                className="hidden"
                accept=".pdf,.jpg,.png"
                onChange={(e) => handleFileChange(e, "utility")}
              />
              <div className="flex justify-between items-end mb-3">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-aurum-navy">
                  02. Proof of Residency
                </label>
                {formData.kycDocuments?.utility && (
                  <span className="text-[10px] text-green-600 font-bold flex items-center gap-1">
                    <CheckCircle2 size={10} /> Ready
                  </span>
                )}
              </div>
              <div
                onClick={() => utilityInputRef.current?.click()}
                className={`border-2 border-dashed p-8 rounded-sm transition-all cursor-pointer flex flex-col items-center text-center ${
                  formData.kycDocuments?.utility
                    ? "border-aurum-gold bg-aurum-gold/5"
                    : "border-gray-200 hover:border-aurum-gold hover:bg-slate-50"
                }`}
              >
                <Upload
                  className={`${formData.kycDocuments?.utility ? "text-aurum-gold" : "text-gray-300"} mb-4`}
                  size={32}
                />
                <p className="text-xs font-bold text-aurum-navy mb-1">
                  {formData.kycDocuments?.utility?.name || "Utility Bill or Bank Statement"}
                </p>
                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Max 3 months old</p>
              </div>
            </div>

            <div className="bg-aurum-slate p-4 flex gap-4 items-center border-l-4 border-aurum-gold">
              <Info size={18} className="text-aurum-navy" />
              <p className="text-[10px] text-gray-500 leading-tight">
                Our <span className="text-aurum-navy font-bold">Fraud Detection Engine</span> will scan these files for metadata authenticity.
              </p>
            </div>
{/* --- NEW ID DATA SECTION --- */}
<div className="grid grid-cols-2 gap-8 mb-10 pb-10 border-b border-gray-100">
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-aurum-navy">Document Type</label>
    <select 
      value={formData.idType || ""}
      onChange={(e) => setFormData({ idType: e.target.value })}
      className="w-full border-b border-gray-200 py-2 outline-none text-sm bg-transparent focus:border-aurum-gold transition-colors"
    >
      <option value="">Select...</option>
      <option value="passport">International Passport</option>
      <option value="national_id">National ID Card</option>
      <option value="driver_license">Driver&#39;s License</option>
    </select>
  </div>
  <div className="space-y-2">
    <label className="text-[10px] font-bold uppercase tracking-widest text-aurum-navy">Document Number</label>
    <input 
      type="text"
      value={formData.idNumber || ""}
      onChange={(e) => setFormData({ idNumber: e.target.value })}
      placeholder="e.g. L8900123"
      className="w-full border-b border-gray-200 py-2 outline-none text-sm focus:border-aurum-gold transition-colors"
    />
  </div>
</div>
            <button
              onClick={handleSubmit}
              className="w-full bg-aurum-navy text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-aurum-gold transition-all flex items-center justify-center gap-2"
            >
              Submit Dossier for Review <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Step Component
interface StepProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  complete?: boolean;
  pending?: boolean;
}

function Step({ icon, label, active, complete, pending }: StepProps) {
  return (
    <div className="flex items-center gap-4 relative z-10">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
          active
            ? "border-aurum-gold bg-aurum-gold text-aurum-navy"
            : complete
            ? "border-aurum-gold text-aurum-gold"
            : "border-white/20 text-white/40"
        }`}
      >
        {icon}
      </div>
      <p className={`text-sm font-medium ${active || complete ? "text-white" : "text-white/40"}`}>{label}</p>
    </div>
  );
}
