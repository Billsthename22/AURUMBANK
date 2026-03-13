"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/app/Store/useOnboardingStore";
import {
  Fingerprint,
  CheckCircle2,
  ShieldCheck,
  ShieldAlert,
} from "lucide-react";

function SecuritySetupContent() {
  const router = useRouter();
  const { formData, reset, setFormData } = useOnboardingStore();

  const [loading, setLoading] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  // 🔐 OTP STATE
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(6).fill(""));
  const [otpLoading, setOtpLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // ⏱️ Resend countdown
  useEffect(() => {
    if (!showOTPModal || resendTimer === 0) return;

    const interval = setInterval(() => {
      setResendTimer((t) => t - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [showOTPModal, resendTimer]);

  // 🔁 Initialize biometric → send OTP
  const handleEnrollBiometrics = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/register/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      
      if (!res.ok) {
        // Check if it's actually JSON before trying to read it
        const isJson = res.headers.get('content-type')?.includes('application/json');
        const errorData = isJson ? await res.json() : { message: "Server returned non-JSON error" };
        
        // Handle error response properly
        throw new Error(errorData.message || "OTP send failed");
      }

      if (!res.ok) {
        const errorText = await res.text();
        console.error("OTP API error:", errorText);
        throw new Error(errorText || "OTP send failed");
      }
      setShowOTPModal(true);
      setResendTimer(60);
      setOtpDigits(Array(6).fill(""));
    } catch (err) {
      console.error("OTP init error", err);
    } finally {
      setLoading(false);
    }
  };

  // 🔢 OTP input handler
  const handleOtpChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;

    const next = [...otpDigits];
    next[index] = value;
    setOtpDigits(next);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }

    if (next.every((d) => d !== "")) {
      handleVerifyOTP(next.join(""));
    }
  };

  // ✅ Verify OTP
  const handleVerifyOTP = async (code: string) => {
    setOtpLoading(true);

    try {
      const res = await fetch("/api/auth/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          code,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Verification failed");
      }

      setEnrolled(true);
      setShowOTPModal(false);
      setFormData({ securityMethod: "biometric" });
    } catch (err) {
      console.error("OTP verification failed", err);
    } finally {
      setOtpLoading(false);
    }
  };

  // 🔁 Resend OTP
  const handleResend = async () => {
    setResendTimer(60);
    setOtpDigits(Array(6).fill(""));

    await fetch("/api/auth/send-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email }),
    });
  };

  // 🏁 Finalize
  const handleFinalize = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/register/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          securityMethod: "biometric",
        }),
      });

      if (res.ok) {
        reset();
        router.push("/login?status=activated");
      }
    } catch (err) {
      console.error("Finalization error", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="w-full max-w-4xl bg-white shadow-2xl flex overflow-hidden border border-gray-100">
        {/* LEFT SIDEBAR */}
        <div className="hidden md:flex w-1/3 bg-aurum-navy p-10 flex-col text-white">
          <h3 className="text-xl font-serif mb-8 text-aurum-gold italic">
            Onboarding Process
          </h3>
          <div className="space-y-10 relative">
            <Step
              icon={<CheckCircle2 size={18} className="text-aurum-gold" />}
              label="Identity"
              complete
            />
            <Step
              icon={<CheckCircle2 size={18} className="text-aurum-gold" />}
              label="KYC Documents"
              complete
            />
            <Step icon={<Fingerprint size={18} />} label="Security Setup" active />
            <div className="absolute top-0 left-5 w-[1px] h-full bg-white/10 -z-0" />
          </div>
        </div>

        {/* MAIN */}
        <div className="flex-1 p-10 md:p-16 space-y-8">
          <div>
            <h2 className="text-3xl font-serif font-bold text-aurum-navy mb-2">
              Security Protocol
            </h2>
            <p className="text-gray-500 text-sm italic">
              Enroll your device biometrics for instant, secure access.
            </p>
          </div>

          {!enrolled ? (
            <div className="flex flex-col items-center py-10 border-2 border-dashed border-gray-100 rounded-lg space-y-6">
              <div
                className={`p-6 rounded-full transition-all duration-1000 ${
                  loading
                    ? "bg-aurum-gold/20 animate-pulse"
                    : "bg-slate-50"
                }`}
              >
                <Fingerprint
                  size={64}
                  className={loading ? "text-aurum-gold" : "text-aurum-navy"}
                />
              </div>
              <button
                onClick={handleEnrollBiometrics}
                disabled={loading}
                className="bg-aurum-navy text-white px-8 py-3 text-[10px] font-bold uppercase tracking-widest hover:bg-aurum-gold transition-all"
              >
                {loading ? "Initializing…" : "Initialize Scan"}
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center py-10 bg-green-50 border border-green-100 rounded-lg space-y-4">
              <CheckCircle2 size={48} className="text-green-600" />
              <p className="text-sm font-bold text-green-900 uppercase tracking-widest">
                Hardware Linked
              </p>
            </div>
          )}

          <button
            onClick={handleFinalize}
            disabled={!enrolled || loading}
            className="w-full bg-aurum-navy text-white py-4 font-bold uppercase tracking-widest text-xs hover:bg-aurum-gold transition-all disabled:opacity-30"
          >
            {loading ? "Activating Ledger…" : "Activate Institutional Account"}
            <ShieldCheck size={16} />
          </button>
        </div>
      </div>

      {/* 🔐 OTP MODAL */}
      {showOTPModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center animate-fadeIn">
          <div className="bg-white w-full max-w-md p-8 shadow-2xl animate-slideUp">
            <h3 className="text-xl font-serif text-aurum-navy mb-2">
              Verification Required
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Enter the 6-digit code sent to your email.
            </p>

            <div className="flex justify-between mb-6">
              {otpDigits.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  value={digit}
                  onChange={(e) => handleOtpChange(e.target.value, i)}
                  maxLength={1}
                  className="w-12 h-12 text-center text-xl border focus:border-aurum-gold focus:outline-none"
                />
              ))}
            </div>

            <div className="text-center text-[10px] text-gray-500">
              {resendTimer > 0 ? (
                <>Resend code in {resendTimer}s</>
              ) : (
                <button
                  onClick={handleResend}
                  className="text-aurum-gold font-bold uppercase tracking-widest"
                >
                  Resend Code
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function SecuritySetupPage() {
  return (
    <div className="min-h-screen bg-[#F4F7FA] flex items-center justify-center">
      <Suspense fallback={<p>Loading…</p>}>
        <SecuritySetupContent />
      </Suspense>
    </div>
  );
}

function Step({ icon, label, active = false, complete = false }: any) {
  return (
    <div className="flex items-center gap-4">
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
      <div>
        <p className="text-sm">{label}</p>
      </div>
    </div>
  );
}