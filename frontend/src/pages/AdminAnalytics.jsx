import { useState, useEffect } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000/api/v1';

const STATUS_COLORS = {
  resolved: '#22C55E',
  in_progress: '#14B8A6',
  submitted: '#2563EB',
  rejected: '#EF4444',
};
const FALLBACK_COLORS = ['#2563EB', '#14B8A6', '#8B5CF6', '#F59E0B', '#EF4444', '#64748B'];

const CustomBarShape = (props) => {
  const { x, y, width, height, fill } = props;
  const r = 6;
  return (
    <path
      d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
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
        <p key={i} className="text-[#CBD5E1]"><span style={{ color: p.color || p.fill }}>●</span> {p.name}: {p.value}</p>
      ))}
    </div>
  );
};

export default function AdminAnalytics() {
  const { mpToken } = useAuth();
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!mpToken) return;

    async function fetchOverview() {
      try {
        const res = await fetch(`${API_BASE}/mp/dashboard/overview`, {
          headers: { Authorization: `Bearer ${mpToken}` },
        });
        if (!res.ok) throw new Error('Failed to load analytics data.');
        setOverview(await res.json());
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, [mpToken]);

  const weeklyActivity = overview?.weekly_activity || [];
  const statusDistribution = (overview?.status_distribution || []).map((s, i) => ({
    ...s,
    color: STATUS_COLORS[s.name] || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
  }));
  const categoryBreakdown = overview?.category_breakdown || [];

  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Analytics</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Performance metrics and grievance analytics</p>
      </div>

      {error && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-[#64748B]">Loading analytics...</p>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4">
            {/* Weekly Activity */}
            <div className="col-span-8 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
              <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-1">Weekly Activity</h3>
              <p className="text-xs text-[#94A3B8] mb-5">Grievances filed vs resolved (last 7 days)</p>
              {weeklyActivity.length === 0 ? (
                <p className="text-xs text-[#94A3B8]">No activity data yet.</p>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={weeklyActivity} barGap={4}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="filed" fill="#2563EB" shape={<CustomBarShape />} barSize={18} name="Filed" />
                    <Bar dataKey="resolved" fill="#14B8A6" shape={<CustomBarShape />} barSize={18} name="Resolved" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Status Pie */}
            <div className="col-span-4 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
              <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-1">Status Distribution</h3>
              <p className="text-xs text-[#94A3B8] mb-5">Current breakdown of all grievances</p>
              {statusDistribution.length === 0 ? (
                <p className="text-xs text-[#94A3B8]">No data yet.</p>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                      <Pie
                        data={statusDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        dataKey="value"
                        paddingAngle={3}
                      >
                        {statusDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex flex-wrap gap-3 justify-center mt-2">
                    {statusDistribution.map((d) => (
                      <span key={d.name} className="flex items-center gap-1.5 text-xs text-[#64748B] capitalize">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                        {d.name.replace('_', ' ')}
                      </span>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Category Breakdown */}
          <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
            <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-1">Category Breakdown</h3>
            <p className="text-xs text-[#94A3B8] mb-5">Number of grievances by category</p>
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-[#94A3B8]">No category data yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryBreakdown} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" horizontal={false} />
                  <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} allowDecimals={false} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#475569' }}
                    width={80}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" fill="#2563EB" shape={<CustomBarShape />} barSize={14} name="Grievances" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </>
      )}
    </div>
  );
}
