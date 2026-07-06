import { createContext, useContext, useState } from "react";

const LanguageContext = createContext(null);


const translations = {
  // CitizenLayout / MobileBottomNav
  nav_home: { en: "Home", hi: "होम" },
  nav_track: { en: "Track", hi: "ट्रैक" },
  nav_submit: { en: "Submit", hi: "सबमिट" },
  nav_updates: { en: "Updates", hi: "अपडेट" },
  nav_profile: { en: "Profile", hi: "प्रोफाइल" },

  // CitizenLogin
  login_title: { en: "Jan Awaaz AI", hi: "जन आवाज़ AI" },
  login_subtitle: { en: "Sign in to report an issue", hi: "समस्या दर्ज करने के लिए साइन इन करें" },
  login_name_label: { en: "Your Name", hi: "आपका नाम" },
  login_name_placeholder: { en: "Enter Your Name", hi: "अपना नाम लिखें" },
  login_phone_label: { en: "Phone Number", hi: "फ़ोन नंबर" },
  login_phone_placeholder: { en: "Enter your phone number", hi: "अपना फ़ोन नंबर लिखें" },
  login_send_otp: { en: "Send OTP", hi: "OTP भेजें" },
  login_sending: { en: "Sending...", hi: "भेजा जा रहा है..." },
  login_otp_label: { en: "Enter OTP sent to", hi: "OTP दर्ज करें, भेजा गया" },
  login_verify: { en: "Verify & Continue", hi: "सत्यापित करें और जारी रखें" },
  login_verifying: { en: "Verifying...", hi: "सत्यापित हो रहा है..." },

  // CitizenHome
  home_good_morning: { en: "Good Morning", hi: "सुप्रभात" },
  home_good_afternoon: { en: "Good Afternoon", hi: "नमस्कार" },
  home_good_evening: { en: "Good Evening", hi: "शुभ संध्या" },
  home_citizen: { en: "Citizen", hi: "नागरिक" },
  home_ai_summary: { en: "AI Summary", hi: "AI सारांश" },
  home_loading_reports: { en: "Loading your reports...", hi: "आपकी रिपोर्ट लोड हो रही हैं..." },
  home_no_reports: {
    en: "You haven't filed any reports yet. Tap New Complaint below to get started.",
    hi: "आपने अभी तक कोई रिपोर्ट दर्ज नहीं की है। शुरू करने के लिए नीचे नई शिकायत पर टैप करें।",
  },
  home_view_details: { en: "View Details", hi: "विवरण देखें" },
  home_quick_actions: { en: "Quick Actions", hi: "त्वरित कार्य" },
  home_new_complaint: { en: "New Complaint", hi: "नई शिकायत" },
  home_track_status: { en: "Track Status", hi: "स्थिति ट्रैक करें" },
  home_call_office: { en: "Call Office", hi: "कार्यालय कॉल करें" },
  home_ai_help: { en: "AI Help", hi: "AI सहायता" },
  home_total_filed: { en: "Total Filed", hi: "कुल दर्ज" },
  home_in_progress: { en: "In Progress", hi: "प्रगति में" },
  home_resolved: { en: "Resolved", hi: "हल हो गया" },
  home_recent_grievances: { en: "Recent Grievances", hi: "हाल की शिकायतें" },
  home_view_all: { en: "View All", hi: "सभी देखें" },
  home_no_reports_filed: { en: "No reports filed yet.", hi: "अभी तक कोई रिपोर्ट दर्ज नहीं की गई।" },
  home_no_description: { en: "No description available", hi: "कोई विवरण उपलब्ध नहीं है" },
  home_uncategorized: { en: "Uncategorized", hi: "अवर्गीकृत" },
  home_your_constituency: { en: "Your Constituency", hi: "आपका निर्वाचन क्षेत्र" },

  // CitizenSubmit
  submit_title: { en: "Submit Grievance", hi: "शिकायत दर्ज करें" },
  submit_subtitle: {
    en: "Describe your issue and we'll route it to the right department.",
    hi: "अपनी समस्या बताएं, हम इसे सही विभाग तक पहुंचाएंगे।",
  },
  submit_category_label: {
    en: "Category (optional — AI will categorize automatically)",
    hi: "श्रेणी (वैकल्पिक — AI स्वतः वर्गीकृत करेगा)",
  },
  submit_category_auto: { en: "Let AI decide", hi: "AI को तय करने दें" },
  submit_description_label: { en: "Description", hi: "विवरण" },
  submit_ai_enhanced: { en: "AI-Enhanced", hi: "AI-सक्षम" },
  submit_description_placeholder: {
    en: "Add any extra detail. Our AI will also analyze your photo directly.",
    hi: "कोई अतिरिक्त विवरण जोड़ें। हमारा AI आपकी फोटो का भी विश्लेषण करेगा।",
  },
  submit_location_label: { en: "Location", hi: "स्थान" },
  submit_location_detecting: { en: "Detecting your location...", hi: "आपका स्थान पता किया जा रहा है..." },
  submit_location_detected: { en: "Location detected", hi: "स्थान मिल गया" },
  submit_location_error: { en: "Could not detect location — tap to retry", hi: "स्थान नहीं मिला — फिर से कोशिश करें" },
  submit_location_idle: { en: "Tap to detect your location", hi: "अपना स्थान पता करने के लिए टैप करें" },
  submit_photo_label: { en: "Attach Photo", hi: "फोटो जोड़ें" },
  submit_photo_button: { en: "Photo", hi: "फोटो" },
  submit_voice_soon: { en: "Voice Note (soon)", hi: "वॉइस नोट (जल्द आ रहा है)" },
  submit_button: { en: "Submit Grievance", hi: "शिकायत भेजें" },
  submit_submitting: { en: "Submitting...", hi: "भेजा जा रहा है..." },
  submit_success_title: { en: "Report Submitted", hi: "रिपोर्ट भेज दी गई" },
  submit_success_subtitle: {
    en: "Our AI is analyzing your report. Redirecting you home...",
    hi: "हमारा AI आपकी रिपोर्ट का विश्लेषण कर रहा है। आपको होम पर भेजा जा रहा है...",
  },
};

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => localStorage.getItem("janawaaz_lang") || "en");

  const toggleLanguage = () => {
    setLanguage((prev) => {
      const next = prev === "en" ? "hi" : "en";
      localStorage.setItem("janawaaz_lang", next);
      return next;
    });
  };

  const t = (key) => translations[key]?.[language] ?? translations[key]?.en ?? key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}