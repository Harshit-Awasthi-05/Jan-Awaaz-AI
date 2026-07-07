import { createContext, useContext, useState } from "react";

const LanguageContext = createContext(null);


const translations = {
  
  nav_home: { en: "Home", hi: "होम" },
  nav_track: { en: "Track", hi: "ट्रैक" },
  nav_submit: { en: "Submit", hi: "सबमिट" },
  nav_updates: { en: "Updates", hi: "अपडेट" },
  nav_profile: { en: "Profile", hi: "प्रोफाइल" },

  
  login_title: { en: "Welcome Back!", hi: "वापसी पर स्वागत है!" },
  login_subtitle: { en: "Ready to track your reports? Enter your phone number.", hi: "क्या आप अपनी रिपोर्ट ट्रैक करने के लिए तैयार हैं? अपना फ़ोन नंबर दर्ज करें।" },
  signup_title: { en: "Welcome to Jan Awaaz", hi: "जन आवाज़ में आपका स्वागत है" },
  signup_subtitle: { en: "Let's get your voice heard. Register in 10 seconds.", hi: "आइए आपकी आवाज़ को आगे बढ़ाएं। 10 सेकंड में अपना अकाउंट बनाएं।" },
  login_toggle_signup: { en: "First time here? Create your profile", hi: "पहली बार आए हैं? अपनी प्रोफाइल बनाएं" },
  login_toggle_login: { en: "Already have an account? Log In", hi: "क्या आपके पास पहले से अकाउंट है? लॉग इन करें" },
  login_name_label: { en: "Your Full Name", hi: "आपका पूरा नाम" },
  login_name_placeholder: { en: "What should we call you?", hi: "हम आपको क्या कह कर बुलाएं?" },
  login_phone_label: { en: "Mobile Number", hi: "मोबाइल नंबर" },
  login_phone_placeholder: { en: "e.g. 9876543210", hi: "जैसे 9876543210" },
  login_send_otp: { en: "Send Verification Code", hi: "सत्यापन कोड भेजें" },
  login_sending: { en: "Sending Code...", hi: "कोड भेजा जा रहा है..." },
  login_otp_label: { en: "Enter the code sent to", hi: "कोड दर्ज करें, जो इस पर भेजा गया है:" },
  login_verify: { en: "Verify & Enter", hi: "सत्यापित करें और प्रवेश करें" },
  login_verifying: { en: "Verifying...", hi: "सत्यापित हो रहा है..." },


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
  },submit_error_photo: { en: "Please attach a photo of the issue.", hi: "कृपया समस्या की एक फोटो जोड़ें।" },
  submit_error_location: { en: "Please detect your location before submitting.", hi: "कृपया सबमिट करने से पहले अपना स्थान पता करें।" },
  submit_error_generic: { en: "Failed to submit your report. Please try again.", hi: "आपकी रिपोर्ट भेजने में विफल। कृपया पुनः प्रयास करें।" },
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