import { useState } from 'react';
import { ArrowLeft, Bell, MessageSquare, Smartphone, Mail, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CitizenNotifications() {
  const navigate = useNavigate();
  
  const [settings, setSettings] = useState({
    push: true,
    sms: true,
    whatsapp: false,
    email: true,
    updates: true,
    announcements: false
  });

  const toggle = (key) => setSettings(prev => ({ ...prev, [key]: !prev[key] }));

  const ToggleSwitch = ({ label, description, icon: Icon, id }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-card mb-3 transition-all hover:shadow-dropdown cursor-pointer" onClick={() => toggle(id)}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#F8FAFC] flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-[#64748B]" />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#0F172A]">{label}</p>
          <p className="text-xs text-[#64748B] mt-0.5">{description}</p>
        </div>
      </div>
      <button 
        className={`w-11 h-6 rounded-full transition-colors relative flex items-center shrink-0 ${settings[id] ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'}`}
      >
        <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform absolute ${settings[id] ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  );

  return (
    <div className="space-y-4 animate-fade-in-up pb-6">
      
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate('/profile')} className="p-2 -ml-2 rounded-full hover:bg-white transition-colors active:scale-95">
          <ArrowLeft className="w-5 h-5 text-[#0F172A]" />
        </button>
        <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Notification Settings</h1>
      </div>

      
      <div>
        <h2 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3 px-2">Delivery Channels</h2>
        <div className="stagger-children">
          <ToggleSwitch id="push" label="Push Notifications" description="Direct alerts on your device" icon={Bell} />
          <ToggleSwitch id="sms" label="SMS Alerts" description="Text messages to your phone" icon={Smartphone} />
          <ToggleSwitch id="whatsapp" label="WhatsApp Integration" description="Updates directly to WhatsApp" icon={MessageSquare} />
          <ToggleSwitch id="email" label="Email Updates" description="Detailed summaries via email" icon={Mail} />
        </div>
      </div>
      
      
      <div className="mt-8">
        <h2 className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-3 px-2">Alert Types</h2>
        <div className="stagger-children">
          <ToggleSwitch id="updates" label="Grievance Status" description="When your complaints are updated" icon={AlertCircle} />
          <ToggleSwitch id="announcements" label="MP Announcements" description="News and development updates" icon={Bell} />
        </div>
      </div>
    </div>
  );
}
