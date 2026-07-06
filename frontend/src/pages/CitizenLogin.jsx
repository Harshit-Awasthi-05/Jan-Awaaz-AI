import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "../firebase";

const API_BASE = "http://127.0.0.1:8000/api/v1";

export default function CitizenLogin() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const normalizePhone = (raw) => {
    const digitsOnly = raw.replace(/\D/g, "");
    const tenDigits = digitsOnly.length === 12 && digitsOnly.startsWith("91")
      ? digitsOnly.slice(2)
      : digitsOnly;

    if (tenDigits.length !== 10) {
      throw new Error("Please enter a valid 10-digit mobile number.");
    }
    return `+91${tenDigits}`;
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fullNumber = normalizePhone(phone);
      const res = await fetch(`${API_BASE}/citizen/request-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: fullNumber }),
      });
      if (!res.ok) throw new Error("Failed to send OTP. Try again.");
      setStep("otp");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fullNumber = normalizePhone(phone);
      const res = await fetch(`${API_BASE}/citizen/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: fullNumber, otp, name: name || null }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Invalid OTP.");

      await signInWithCustomToken(auth, data.custom_token);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
        <h1 className="text-lg font-bold text-[#0F172A] mb-1">Jan Awaaz AI</h1>
        <p className="text-xs text-[#64748B] mb-5">Sign in to report an issue</p>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
            {error}
          </div>
        )}

        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1.5 block">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter Your Name"
                required
                className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1.5 block">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white text-sm font-semibold px-4 py-3 rounded-2xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1.5 block">
                Enter OTP sent to {phone}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                required
                className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white text-sm font-semibold px-4 py-3 rounded-2xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}