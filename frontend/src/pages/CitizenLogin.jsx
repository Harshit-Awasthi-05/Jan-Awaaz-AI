import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../firebase";
import { useLanguage } from "../context/LanguageContext";

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

export default function CitizenLogin() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState("phone"); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { language, toggleLanguage, t } = useLanguage();

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

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: (response) => {
          // reCAPTCHA solved
        },
        'expired-callback': () => {
          setError("Recaptcha expired, please try again.");
        }
      });
    }
  }, []);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const fullNumber = normalizePhone(phone);
      const appVerifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhoneNumber(auth, fullNumber, appVerifier);
      window.confirmationResult = confirmationResult;
      setStep("otp");
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to send OTP. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      
      if (mode === "signup" && name) {
        const idToken = await result.user.getIdToken();
        await fetch(`${API_BASE}/citizen/sync-profile`, {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`
          },
          body: JSON.stringify({ name }),
        });
      }
      
      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.message || "Invalid OTP.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm relative">
        <button
          onClick={toggleLanguage}
          className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] transition-colors"
          title="Switch language"
        >
          {language === 'en' ? 'हिं' : 'EN'}
        </button>
        <h1 className="text-lg font-bold text-[#0F172A] mb-1">
          {mode === "login" ? t('login_title') : t('signup_title')}
        </h1>
        <p className="text-xs text-[#64748B] mb-5">
          {mode === "login" ? t('login_subtitle') : t('signup_subtitle')}
        </p>

        {error && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-4">
            {error}
          </div>
        )}

        <div id="recaptcha-container"></div>

        {step === "phone" && (
          <form onSubmit={handleSendOtp} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="text-xs font-semibold text-[#475569] mb-1.5 block">
                  {t('login_name_label')}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('login_name_placeholder')}
                  required
                  className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
                />
              </div>
            )}
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1.5 block">
                {t('login_phone_label')}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t('login_phone_placeholder')}
                required
                className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white text-sm font-semibold px-4 py-3 rounded-2xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
            >
              {loading ? t('login_sending') : t('login_send_otp')}
            </button>

            <div className="text-center mt-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setMode(mode === "login" ? "signup" : "login");
                  setError("");
                }}
                className="text-xs text-[#2563EB] font-semibold hover:underline"
              >
                {mode === "login"
                  ? t('login_toggle_signup')
                  : t('login_toggle_login')}
              </button>
            </div>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-[#475569] mb-1.5 block">
                {t('login_otp_label')} {phone}
              </label>
              <input
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="6-digit code"
                required
                className="w-full px-4 py-3 text-sm bg-white rounded-2xl border border-[#E2E8F0] outline-none focus:ring-2 focus:ring-[#2563EB]/30 text-[#0F172A]"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2563EB] text-white text-sm font-semibold px-4 py-3 rounded-2xl hover:bg-[#1D4ED8] transition-colors disabled:opacity-50"
            >
              {loading ? t('login_verifying') : t('login_verify')}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}