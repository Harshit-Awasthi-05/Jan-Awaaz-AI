import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Users,
  CheckCircle2,
  Filter,
  ArrowUpRight,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import StatCard from '../components/StatCard';
import GrievanceTable from '../components/GrievanceTable';
import SparkleIcon from '../components/SparkleIcon';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const CustomBarShape = (props) => {
  const { x, y, width, height, fill } = props;
  const radius = 6;
  return (
    <path
      d={`M${x},${y + height}
         L${x},${y + radius}
         Q${x},${y} ${x + radius},${y}
         L${x + width - radius},${y}
         Q${x + width},${y} ${x + width},${y + radius}
         L${x + width},${y + height}
         Z`}
      fill={fill}
    />
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-[#0F172A] text-white px-3 py-2 rounded-lg shadow-dropdown text-xs">
      <p className="font-semibold mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[#CBD5E1]">
          <span style={{ color: p.color }}>●</span> {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

function formatDate(isoString) {
  if (!isoString) return '';
  return new Date(isoString).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboard() {
  const { mpToken, mpInfo } = useAuth();
  const [overview, setOverview] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mpToken) return;

    async function fetchOverview() {
      try {
        const res = await fetch(`${API_BASE}/mp/dashboard/overview`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });
        if (!res.ok) throw new Error('Failed to load dashboard data.');
        setOverview(await res.json());
      } catch (err) {
        setError(err.message);
      }
    }

    async function fetchComplaints() {
      try {
        const res = await fetch(`${API_BASE}/mp/dashboard/complaints`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });
        if (!res.ok) throw new Error('Failed to load complaints.');
        const data = await res.json();
        const mapped = (data.complaints || []).slice(0, 5).map((c) => ({
          id: c.complaint_id,
          subject: c.summary || 'No description available',
          citizen: c.citizen_name || 'Unknown Citizen',
          category: c.category || 'Uncategorized',
          status: c.status || 'submitted',
          priority: c.severity || 'Low',
          date: formatDate(c.created_at),
        }));
        setGrievances(mapped);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
    fetchComplaints();
  }, [mpToken]);

  if (loading) {
    return <p className="text-sm text-[#64748B]">Loading dashboard...</p>;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Overview</h2>
          <p className="text-sm text-[#64748B] mt-0.5">
            Welcome back,{' '}
            <span className="font-medium text-[#475569]">{mpInfo?.email || 'MP'}</span>
          </p>
        </div>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {/* Stat Cards — only metrics we can honestly compute */}
      <div className="grid grid-cols-3 gap-4 stagger-children">
        <StatCard
          title="Total Grievances"
          value={overview?.total_grievances ?? 0}
          icon={MessageSquare}
          color="#2563EB"
        />
        <StatCard
          title="Active Citizens"
          value={overview?.active_citizens ?? 0}
          icon={Users}
          color="#8B5CF6"
        />
        <StatCard
          title="Resolved"
          value={overview?.resolved_count ?? 0}
          icon={CheckCircle2}
          color="#22C55E"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Weekly Activity — real data, last 7 days */}
        <div className="col-span-8 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                Weekly Activity
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">Grievances filed vs resolved (last 7 days)</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#2563EB]" />
                Filed
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#14B8A6]" />
                Resolved
              </span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={overview?.weekly_activity || []} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} allowDecimals={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="filed" fill="#2563EB" shape={<CustomBarShape />} barSize={20} name="Filed" />
              <Bar dataKey="resolved" fill="#14B8A6" shape={<CustomBarShape />} barSize={20} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown — real data */}
        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
          <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-1">Categories</h3>
          <p className="text-xs text-[#94A3B8] mb-5">Breakdown by type</p>
          {(!overview?.category_breakdown || overview.category_breakdown.length === 0) ? (
            <p className="text-xs text-[#94A3B8]">No data yet.</p>
          ) : (
            <div className="space-y-3.5">
              {overview.category_breakdown.map((cat, i) => {
                const colors = ['#2563EB', '#14B8A6', '#8B5CF6', '#F59E0B', '#EF4444', '#64748B'];
                const color = colors[i % colors.length];
                return (
                  <div key={cat.name}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-[#475569] font-medium">{cat.name}</span>
                      <span className="text-xs text-[#94A3B8]">{cat.count} ({cat.pct}%)</span>
                    </div>
                    <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${cat.pct}%`, backgroundColor: color }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights — genuinely computed, full width */}
      <div className="bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white animate-fade-in-up">
        <div className="flex items-center gap-2 mb-4">
          <SparkleIcon className="w-5 h-5" />
          <h3 className="text-base font-semibold tracking-tight">AI Insights</h3>
        </div>
        <div className="space-y-3">
          {(overview?.ai_insights || []).map((insight, i) => (
            <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-[#CBD5E1] leading-relaxed">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Grievance Table */}
      <div>
        <div className="flex items-center justify-between mb-4 animate-fade-in-up">
          <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
            Recent Grievances
          </h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 text-sm text-[#64748B] bg-white px-3 py-2 rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors">
              <Filter className="w-3.5 h-3.5" />
              Filter
            </button>
            <a
              href="/admin/grievances"
              className="text-sm text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
        {grievances.length === 0 ? (
          <p className="text-sm text-[#94A3B8]">No grievances filed yet.</p>
        ) : (
          <GrievanceTable grievances={grievances} onStatusChange={() => {}} />
        )}
      </div>
    </div>
  );
}