import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import StatusChip from '../components/StatusChip';
import SparkleIcon from '../components/SparkleIcon';
import {
  ArrowRight,
  FileText,
  Clock,
  ChevronRight,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

export default function CitizenHome() {
  const { citizenUser, citizenToken } = useAuth();
  const { t } = useLanguage();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [constituencyInfo, setConstituencyInfo] = useState(null);

  const [greetingKey] = useState(() => {
    const h = new Date().getHours();
    if (h < 12) return 'home_good_morning';
    if (h < 17) return 'home_good_afternoon';
    return 'home_good_evening';
  });

  const navigate = useNavigate();

  const quickActions = [
    { icon: FileText, label: t('home_new_complaint'), color: '#2563EB', bg: 'rgba(37,99,235,0.08)', to: '/submit' },
    { icon: Clock, label: t('home_track_status'), color: '#14B8A6', bg: 'rgba(20,184,166,0.08)', to: '/track' },
    { icon: Phone, label: t('home_call_office'), color: '#8B5CF6', bg: 'rgba(139,92,246,0.08)', to: 'tel:1800111234' },
    { icon: MessageCircle, label: t('home_ai_help'), color: '#F59E0B', bg: 'rgba(245,158,11,0.08)', to: '/updates' },
  ];

  useEffect(() => {
    if (!citizenToken) return;

    async function fetchComplaints() {
      try {
        const res = await fetch(`${API_BASE}/citizen/complaints`, {
          headers: { Authorization: `Bearer ${citizenToken}` },
        });
        if (!res.ok) throw new Error('Failed to load your complaints.');
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    // Fetch public constituency info so the card shows real data
    async function fetchConstituencyInfo() {
      try {
        const res = await fetch(`${API_BASE}/mp/info`);
        if (res.ok) {
          const data = await res.json();
          setConstituencyInfo(data);
        }
      } catch {
      }
    }

    fetchComplaints();
    fetchConstituencyInfo();
  }, [citizenToken]);

  
  const totalFiled = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'resolved').length;
  const inProgressCount = totalFiled - resolvedCount;

  const mostRecent = complaints[0];
  const recentGrievances = complaints.slice(0, 3);

  return (
    <div className="space-y-5 stagger-children">
      <div className="animate-fade-in-up">
        <p className="text-sm text-[#64748B] font-medium">{t(greetingKey)}</p>
        <h1 className="text-xl font-bold text-[#0F172A] tracking-tight mt-0.5">
          {citizenUser?.displayName || t('home_citizen')}
        </h1>
      </div>


      <div className="glass-panel relative overflow-hidden rounded-[24px] p-6 text-white animate-fade-in-up border border-white/20 shadow-[0_8px_32px_-8px_rgba(0,0,0,0.1)]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F172A] to-[#1E293B] opacity-90 -z-10" />
        <div className="flex items-center gap-2 mb-4">
          <SparkleIcon className="w-5 h-5 ai-gradient" />
          <span className="text-xs font-bold ai-gradient tracking-widest uppercase">
            {t('home_ai_summary')}
          </span>
        </div>
        {loading ? (
          <p className="text-sm text-[#CBD5E1]">{t('home_loading_reports')}</p>
        ) : totalFiled === 0 ? (
          <p className="text-sm text-[#CBD5E1]">
            {t('home_no_reports')}
          </p>
        ) : (
          <p className="text-sm leading-relaxed text-[#CBD5E1]">
            You have <span className="text-white font-semibold">{inProgressCount} active grievance{inProgressCount !== 1 ? 's' : ''}</span>.
            {mostRecent && (
              <>
                {' '}Your most recent report ({mostRecent.category || t('home_uncategorized')}) is{' '}
                <span className="text-[#14B8A6] font-semibold">{mostRecent.status}</span>.
              </>
            )}
          </p>
        )}
        <button className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-[#14B8A6] hover:text-white transition-colors">
          {t('home_view_details')} <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>


      <div className="animate-fade-in-up">
        <h2 className="text-sm font-semibold text-[#0F172A] mb-3 tracking-tight">
          {t('home_quick_actions')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {quickActions.map((action) => (
            <button
              key={action.label}
              onClick={() =>
                action.to.startsWith('tel:')
                  ? (window.location.href = action.to)
                  : navigate(action.to)
              }
              className="flex flex-col items-center gap-3 p-4 rounded-[20px] glass-panel transition-all duration-300 hover:-translate-y-1 hover:shadow-dropdown active:scale-95 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div
                className="w-12 h-12 rounded-[14px] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-sm"
                style={{ backgroundColor: action.bg }}
              >
                <action.icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <span className="text-xs font-semibold text-[#1E293B] text-center">
                {action.label}
              </span>
            </button>
          ))}
        </div>
      </div>


      <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
        <div className="glass-panel rounded-[20px] p-4 text-center transition-transform hover:-translate-y-1 hover:shadow-dropdown">
          <p className="text-2xl font-bold text-[#2563EB] mb-1">{totalFiled}</p>
          <p className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">{t('home_total_filed')}</p>
        </div>
        <div className="glass-panel rounded-[20px] p-4 text-center transition-transform hover:-translate-y-1 hover:shadow-dropdown">
          <p className="text-2xl font-bold text-[#14B8A6] mb-1">{inProgressCount}</p>
          <p className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">{t('home_in_progress')}</p>
        </div>
        <div className="glass-panel rounded-[20px] p-4 text-center transition-transform hover:-translate-y-1 hover:shadow-dropdown">
          <p className="text-2xl font-bold text-[#22C55E] mb-1">{resolvedCount}</p>
          <p className="text-xs text-[#64748B] font-semibold uppercase tracking-wider">{t('home_resolved')}</p>
        </div>
      </div>


      <div className="animate-fade-in-up">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-[#0F172A] tracking-tight">
            {t('home_recent_grievances')}
          </h2>
          <button 
            onClick={() => navigate('/track')}
            className="text-xs font-medium text-[#2563EB] hover:text-[#1D4ED8] transition-colors">
            {t('home_view_all')}
          </button>
        </div>

        {error && (
          <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2 mb-3">
            {error}
          </p>
        )}

        {!loading && recentGrievances.length === 0 && !error && (
          <p className="text-xs text-[#94A3B8] px-1">{t('home_no_reports_filed')}</p>
        )}

        <div className="space-y-2.5">
          {recentGrievances.map((g) => (
            <div
              key={g.complaint_id}
              onClick={() => navigate('/track')}
              className="bg-white rounded-2xl p-4 shadow-card hover:shadow-dropdown transition-shadow active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0 mr-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-[#94A3B8]">#{g.complaint_id}</span>
                    <span className="text-[10px] text-[#94A3B8]">•</span>
                    <span className="text-[10px] text-[#94A3B8]">{formatRelativeTime(g.created_at)}</span>
                  </div>
                  <p className="text-sm font-medium text-[#0F172A] truncate">
                    {g.summary || t('home_no_description')}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] font-medium text-[#64748B] bg-[#F1F5F9] px-2 py-0.5 rounded-md">
                      {g.category || t('home_uncategorized')}
                    </span>
                    <StatusChip status={g.status === 'resolved' ? 'resolved' : 'processing'} />
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#CBD5E1] mt-2 shrink-0" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-5 shadow-card animate-fade-in-up">
        <h2 className="text-sm font-semibold text-[#0F172A] mb-3 tracking-tight">
          {t('home_your_constituency')}
        </h2>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[rgba(37,99,235,0.08)] flex items-center justify-center shrink-0">
            <MapPin className="w-5 h-5 text-[#2563EB]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0F172A]">
              {constituencyInfo?.constituency || t('home_your_constituency')}
            </p>
            <p className="text-xs text-[#64748B] mt-0.5">
              {constituencyInfo?.mp_name ? `MP: ${constituencyInfo.mp_name}` : 'Jan Awaaz AI'}
            </p>
            <p className="text-xs text-[#94A3B8] mt-0.5">
              Jan Awaaz AI Constituency
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}