import { useState, useEffect } from 'react';
import { Check, Clock, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

function formatRelativeTime(isoString) {
  if (!isoString) return '';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}

// Each complaint becomes a real "update" reflecting its actual current status —
// no fake notifications, just an activity view built from real backend data.
function buildUpdateFromComplaint(c) {
  if (c.status === 'resolved') {
    return {
      title: `Grievance #${c.complaint_id} Resolved`,
      message: `Your ${c.category || 'reported'} issue has been marked resolved.`,
      Icon: Check,
      color: '#22C55E',
      bg: 'rgba(34,197,94,0.08)',
    };
  }
  if (c.status === 'in_progress') {
    return {
      title: `Grievance #${c.complaint_id} In Progress`,
      message: `Your ${c.category || 'reported'} issue is being worked on.`,
      Icon: Clock,
      color: '#F59E0B',
      bg: 'rgba(245,158,11,0.08)',
    };
  }
  return {
    title: `Grievance #${c.complaint_id} Submitted`,
    message: c.summary || 'Your report has been received and is under review.',
    Icon: Info,
    color: '#2563EB',
    bg: 'rgba(37,99,235,0.08)',
  };
}

export default function CitizenUpdates() {
  const { citizenToken } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!citizenToken) return;

    async function fetchComplaints() {
      try {
        const res = await fetch(`${API_BASE}/citizen/complaints`, {
          headers: { Authorization: `Bearer ${citizenToken}` },
        });
        if (!res.ok) throw new Error('Failed to load updates.');
        const data = await res.json();
        setComplaints(data.complaints || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, [citizenToken]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-bold text-[#0F172A] tracking-tight">Updates</h1>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading...</p>
      ) : complaints.length === 0 ? (
        <p className="text-sm text-[#94A3B8]">
          No updates yet — submit a grievance to see status updates here.
        </p>
      ) : (
        <div className="space-y-2.5 stagger-children">
          {complaints.map((c) => {
            const { title, message, Icon, color, bg } = buildUpdateFromComplaint(c);
            return (
              <div
                key={c.complaint_id}
                className="bg-white rounded-2xl p-4 shadow-card transition-all animate-fade-in-up"
              >
                <div className="flex gap-3">
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                    style={{ backgroundColor: bg }}
                  >
                    <Icon className="w-4 h-4" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#0F172A] truncate">{title}</p>
                    <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed">{message}</p>
                    <p className="text-[10px] text-[#94A3B8] mt-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {formatRelativeTime(c.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}