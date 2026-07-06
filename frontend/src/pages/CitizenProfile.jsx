import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Shield, Globe, Bell, HelpCircle, LogOut, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  return parts.length > 1
    ? `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
    : parts[0].slice(0, 2).toUpperCase();
}

export default function CitizenProfile() {
  const { citizenUser, citizenToken, citizenLogout } = useAuth();
  const navigate = useNavigate();
  const [complaintCount, setComplaintCount] = useState(null);

  useEffect(() => {
    if (!citizenToken) return;
    fetch(`${API_BASE}/citizen/complaints`, {
      headers: { Authorization: `Bearer ${citizenToken}` },
    })
      .then((res) => res.json())
      .then((data) => setComplaintCount(data.count ?? 0))
      .catch(() => setComplaintCount(0));
  }, [citizenToken]);

  const menuItems = [
    {
      icon: FileText,
      label: 'My Grievances',
      description:
        complaintCount === null ? 'Loading...' : `${complaintCount} total filed`,
      color: '#2563EB',
    },
    { icon: Bell, label: 'Notification Settings', description: 'Manage alerts', color: '#14B8A6' },
    { icon: Globe, label: 'Language', description: 'English', color: '#8B5CF6' },
    { icon: Shield, label: 'Privacy & Security', description: 'Manage your data', color: '#F59E0B' },
    { icon: HelpCircle, label: 'Help & Support', description: 'FAQs and contact', color: '#64748B' },
  ];

  const handleSignOut = async () => {
    await citizenLogout();
    navigate('/login');
  };

  return (
    <div className="space-y-5">
      {/* Profile Card */}
      <div className="bg-white rounded-3xl p-5 shadow-card text-center animate-fade-in-up">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#2563EB] to-[#14B8A6] flex items-center justify-center text-white text-xl font-bold mx-auto mb-3">
          {getInitials(citizenUser?.displayName)}
        </div>
        <h2 className="text-base font-bold text-[#0F172A]">
          {citizenUser?.displayName || 'Citizen'}
        </h2>
        <p className="text-xs text-[#64748B] mt-0.5">
          {citizenUser?.phoneNumber || 'No phone number on file'}
        </p>
      </div>

      {/* Menu */}
      <div className="space-y-2 stagger-children">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 bg-white rounded-2xl p-4 shadow-card hover:shadow-dropdown transition-shadow text-left animate-fade-in-up"
          >
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ backgroundColor: `${item.color}14` }}
            >
              <item.icon className="w-4 h-4" style={{ color: item.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#0F172A]">{item.label}</p>
              <p className="text-[10px] text-[#94A3B8]">{item.description}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#CBD5E1] shrink-0" />
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl border border-[#EF4444]/20 text-[#EF4444] text-sm font-medium hover:bg-[rgba(239,68,68,0.05)] transition-colors"
      >
        <LogOut className="w-4 h-4" />
        Sign Out
      </button>
    </div>
  );
}