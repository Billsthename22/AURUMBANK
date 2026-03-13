"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface AccountCardProps {
  type: string;
  balance: string;
  accNo: string;
  color: "navy" | "gold";
}

export default function AccountCard({ type, balance, accNo, color }: AccountCardProps) {
  const [showNumber, setShowNumber] = useState(false);

  // Mask all digits except last 4
  const maskedAccNo = accNo ? accNo.replace(/\d(?=\d{4})/g, "*") : "**** ****";

  return (
    <div
      className={`group relative p-6 rounded-xl shadow-md transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl cursor-pointer overflow-hidden
        ${color === "navy" ? "bg-gradient-to-br from-aurum-navy to-aurum-darknavy text-white" : "bg-white border border-gray-200 text-aurum-navy"}
      `}
    >
      {/* Top Accent Circle */}
      <div
        className={`absolute -top-4 -right-4 w-12 h-12 rounded-full opacity-20
          ${color === "navy" ? "bg-aurum-gold" : "bg-aurum-navy"}`}
      />

      {/* Account Info */}
      <div className="flex flex-col space-y-3">
        {/* Account Type */}
        <p
          className={`text-xs font-semibold uppercase tracking-wider ${
            color === "navy" ? "text-white/60" : "text-gray-400"
          }`}
        >
          {type}
        </p>

        {/* Account Number */}
        <div
          className="flex items-center gap-2 text-sm font-mono cursor-pointer select-none"
          onClick={() => setShowNumber(!showNumber)}
          title={showNumber ? "Hide account number" : "Show account number"}
        >
          <span>{showNumber ? accNo : maskedAccNo}</span>
          {showNumber ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </div>

        {/* Balance */}
        <p className="text-2xl md:text-3xl font-serif font-bold mt-2 flex items-baseline gap-1">
          <span className={color === "navy" ? "text-aurum-gold" : "text-aurum-navy"}>$</span>
          {balance}
        </p>
      </div>

      {/* Card Actions (hover) */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
        <button
          className={`px-3 py-1 text-[10px] font-bold uppercase rounded bg-white/10 backdrop-blur-sm hover:bg-white/20 ${
            color === "navy" ? "text-white" : "text-aurum-navy"
          }`}
        >
          Transfer
        </button>
        <button
          className={`px-3 py-1 text-[10px] font-bold uppercase rounded bg-white/10 backdrop-blur-sm hover:bg-white/20 ${
            color === "navy" ? "text-white" : "text-aurum-navy"
          }`}
        >
          Details
        </button>
      </div>
    </div>
  );
}