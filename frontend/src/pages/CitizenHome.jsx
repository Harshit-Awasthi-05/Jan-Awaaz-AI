import { useState } from 'react';
import StatusChip from '../components/StatusChip';
import SparkleIcon from '../components/SparkleIcon';
import {
  ArrowRight,
  FileText,
  Clock,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';

const recentGrievances = [
  {
    id: '2847',
    subject: 'Water supply disruption in Sector 15',
    status: 'processing',
    date: '2 hours ago',
    category: 'Water Supply',
  },
  {
    id: '2831',
    subject: 'Street lights not working on MG Road',
    status: 'assigned',
    date: '1 day ago',
    category: 'Infrastructure',
  },
  {
    id: '2819',
    subject: 'Garbage not collected for 3 days',
    status: 'resolved',
    date: '3 days ago',
    category: 'Sanitation',
  },
];

const quickActions = [
  { icon: FileText, label: 'New Complaint', color: '#2563EB', bg: 'rgba(37,99,235,0.08)' },
  { icon: Clock, label: 'Track Status', color: '#14B8A6', bg: 'rgba(20,184,166,0.08)' },
  { icon: Phone, label: 'Call Office', color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)' },
  { icon: MessageCircle, label: 'AI Help', color: '#F59E0B', bg: 'rgba(245,158,11,0.08)' },
];

export default function CitizenHome() {
  const [greeting] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  });

  return (
    <div className="space-y-5 stagger-children">
      {/* Greeting */}
      <div className="animate-fade-in-up">
        <p className="text-sm text-[#64748B] font-medium">{greeting}</p>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight mt-0.5">
          Rahul Kumar
        </h1>
      </div>

      {/* AI Summary Card */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-3xl p-5 text-white animate-fade-in-up">
        <div className="flex items-center gap-2 mb-3">
          <SparkleIcon className="w-5 h-5" />
          <span className="text-xs font-semibold text-[#14B8A6] tracking-wide uppercase">
            AI Summary
          </span>
        </div>
        <p className="text-sm leading-relaxed text-[#CBD5E1]">
          You have <span className="text-white font-semibold">3 active grievances</span>.
          Your water supply complaint is being processed and expected to resolve by{' '}
          <span className="text-[#14B8A6] font-semibold">July 8, 2026</span>.
        </p>
        <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#14B8A6] hover:text-white transition-colors">
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Quick Actions */}
      <div className="animate-fade-in-up">
        <h2 className="text-sm font-semibold text-[#0F172A] mb-3 tracking-tight">
          Quick Actions
        </h2>
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white shadow-card hover:shadow-dropdown active:scale-95 transition-all group"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
                style={{ backgroundColor: action.bg }}
              >
                <action.icon className="w-5 h-5" style={{ color: action.color }} />
              </div>
              <span className="text-[10px] font-medium text-[#475569] text-center leading-tight">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
        <div className="bg-white rounded-2xl p-3 shadow-card text-center">
          <p className="text-lg font-bold text-[#2563EB]">5</p>
          <p className="text-[10px] text-[#64748B] font-medium mt-0.5">Total Filed</p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-card text-center">
          <p className="text-lg font-bold text-[#14B8A6]">2</p>
          <p className="text-[10px] text-[#64748B] font-medium mt-0.5">In Progress</p>
        </div>
        <div className="bg-white rounded-2xl p-3 shadow-card text-center">
          <p className="text-lg font-bold text-[#22C55E]">3</p>
          <p className="text-[10px] text-[#64748B] font-medium mt-0.5">Resolved</p>
        </div>
      </div>

      {/* Recent Grievances */}
      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#0F172A] tracking-tight">
            Recent Grievances
          </h2>
          <button className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            View All
          </button>
        </div>
        <div className="space-y-2.5">
          {recentGrievances.map((g) => (
            <div
              key={g.id}
              className="bg-white rounded-2xl p-4 shadow-card hover:shadow-dropdown transition-shadow active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#94A3B8]">#{g.id}</span>
                    <span className="text-[10px] text-[#94A3B8]">•</span>
                    <span className="text-[10px] text-[#94A3B8]">{g.date}</span>
                  </div>
                  <p className="text-sm font-medium text-[#0F172A] truncate">
                    {g.subject}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                      {g.category}
                    </span>
                    <StatusChip status={g.status} />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#CBD5E1] mt-2 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Constituency Info */}
      <div className="bg-white rounded-3xl p-5 shadow-card animate-fade-in-up">
        <h2 className="text-sm font-semibold text-[#0F172A] mb-3 tracking-tight">
          Your Constituency
        </h2>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(37,99,235,0.08)] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">New Delhi South</p>
            <p className="text-xs text-[#64748B] mt-0.5">
              MP: Shri Rajesh Sharma
            </p>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Ward 42 • Block C, Sector 15
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
