import { useState } from 'react';
import {
  MessageSquare,
  Users,
  CheckCircle2,
  Clock,
  TrendingUp,
  Filter,
  Download,
  Sparkles,
  ArrowUpRight,
  CalendarDays,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import StatCard from '../components/StatCard';
import GrievanceTable from '../components/GrievanceTable';
import SparkleIcon from '../components/SparkleIcon';
import StatusChip from '../components/StatusChip';

const barData = [
  { name: 'Mon', grievances: 12, resolved: 8 },
  { name: 'Tue', grievances: 19, resolved: 14 },
  { name: 'Wed', grievances: 15, resolved: 11 },
  { name: 'Thu', grievances: 22, resolved: 18 },
  { name: 'Fri', grievances: 18, resolved: 15 },
  { name: 'Sat', grievances: 9, resolved: 7 },
  { name: 'Sun', grievances: 6, resolved: 5 },
];

const trendData = [
  { name: 'Jan', value: 120 },
  { name: 'Feb', value: 98 },
  { name: 'Mar', value: 145 },
  { name: 'Apr', value: 132 },
  { name: 'May', value: 168 },
  { name: 'Jun', value: 155 },
  { name: 'Jul', value: 189 },
];

const grievances = [
  {
    id: '2847',
    subject: 'Water supply disruption in Sector 15',
    citizen: 'Rahul Kumar',
    category: 'Water Supply',
    status: 'processing',
    priority: 'High',
    date: 'Jul 4, 2026',
  },
  {
    id: '2846',
    subject: 'Broken footpath near Central Market',
    citizen: 'Anjali Sharma',
    category: 'Infrastructure',
    status: 'assigned',
    priority: 'Medium',
    date: 'Jul 4, 2026',
  },
  {
    id: '2845',
    subject: 'Noise pollution from construction site',
    citizen: 'Vikram Singh',
    category: 'Environment',
    status: 'pending',
    priority: 'Low',
    date: 'Jul 3, 2026',
  },
  {
    id: '2844',
    subject: 'Request for street light installation',
    citizen: 'Priya Patel',
    category: 'Infrastructure',
    status: 'verified',
    priority: 'Medium',
    date: 'Jul 3, 2026',
  },
  {
    id: '2843',
    subject: 'Sewage overflow on Ring Road',
    citizen: 'Suresh Yadav',
    category: 'Sanitation',
    status: 'resolved',
    priority: 'High',
    date: 'Jul 2, 2026',
  },
  {
    id: '2842',
    subject: 'Unauthorized parking in residential area',
    citizen: 'Meena Gupta',
    category: 'Traffic',
    status: 'rejected',
    priority: 'Low',
    date: 'Jul 2, 2026',
  },
  {
    id: '2841',
    subject: 'Delayed pension disbursement',
    citizen: 'Ram Prasad',
    category: 'Welfare',
    status: 'processing',
    priority: 'High',
    date: 'Jul 1, 2026',
  },
];

const categoryBreakdown = [
  { name: 'Infrastructure', count: 34, pct: 28, color: '#2563EB' },
  { name: 'Water Supply', count: 26, pct: 21, color: '#14B8A6' },
  { name: 'Sanitation', count: 22, pct: 18, color: '#8B5CF6' },
  { name: 'Traffic', count: 18, pct: 15, color: '#F59E0B' },
  { name: 'Welfare', count: 12, pct: 10, color: '#EF4444' },
  { name: 'Others', count: 10, pct: 8, color: '#64748B' },
];

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

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState('This Week');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between animate-fade-in-up">
        <div>
          <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
            Overview
          </h2>
          <p className="text-sm text-[#64748B] mt-0.5">
            Welcome back, <span className="font-medium text-[#475569]">MP Rajesh Sharma</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 shadow-card border border-[#E2E8F0]">
            <CalendarDays className="w-4 h-4 text-[#64748B]" />
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="text-sm text-[#0F172A] bg-transparent outline-none cursor-pointer font-medium"
            >
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
              <option>This Quarter</option>
            </select>
          </div>
          <button className="flex items-center gap-2 bg-[#2563EB] text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-[#1D4ED8] transition-colors shadow-sm active:scale-[0.98]">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 stagger-children">
        <StatCard
          title="Total Grievances"
          value="1,284"
          change="+12.5%"
          changeType="up"
          icon={MessageSquare}
          color="#2563EB"
        />
        <StatCard
          title="Active Citizens"
          value="3,842"
          change="+8.2%"
          changeType="up"
          icon={Users}
          color="#8B5CF6"
        />
        <StatCard
          title="Resolved"
          value="847"
          change="+23.1%"
          changeType="up"
          icon={CheckCircle2}
          color="#22C55E"
        />
        <StatCard
          title="Avg. Resolution Time"
          value="3.2 days"
          change="-15.4%"
          changeType="up"
          icon={Clock}
          color="#14B8A6"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-12 gap-4">
        {/* Bar Chart */}
        <div className="col-span-8 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                Weekly Activity
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">Grievances filed vs resolved</p>
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
            <BarChart data={barData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="grievances"
                fill="#2563EB"
                shape={<CustomBarShape />}
                radius={[6, 6, 0, 0]}
                barSize={20}
                name="Filed"
              />
              <Bar
                dataKey="resolved"
                fill="#14B8A6"
                shape={<CustomBarShape />}
                radius={[6, 6, 0, 0]}
                barSize={20}
                name="Resolved"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
          <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-1">
            Categories
          </h3>
          <p className="text-xs text-[#94A3B8] mb-5">Breakdown by type</p>
          <div className="space-y-3.5">
            {categoryBreakdown.map((cat) => (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-[#475569] font-medium">{cat.name}</span>
                  <span className="text-xs text-[#94A3B8]">{cat.count} ({cat.pct}%)</span>
                </div>
                <div className="h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${cat.pct}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Insights + Trend */}
      <div className="grid grid-cols-12 gap-4">
        {/* AI Insights */}
        <div className="col-span-5 bg-gradient-to-br from-[#0F172A] to-[#1E293B] rounded-2xl p-6 text-white animate-fade-in-up">
          <div className="flex items-center gap-2 mb-4">
            <SparkleIcon className="w-5 h-5" />
            <h3 className="text-base font-semibold tracking-tight">AI Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                <span className="text-[#14B8A6] font-semibold">↑ 34% surge</span> in water-related
                complaints from Sector 12-18. Consider scheduling a community meeting.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                <span className="text-[#22C55E] font-semibold">Resolution time improved</span> by
                2.1 days compared to last month. Infrastructure dept leading improvements.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 border border-white/10">
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                <span className="text-[#F59E0B] font-semibold">3 grievances overdue</span> past
                SLA. Immediate attention needed for IDs #2841, #2839, #2835.
              </p>
            </div>
          </div>
        </div>

        {/* Trend Chart */}
        <div className="col-span-7 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-[#0F172A] tracking-tight">
                Monthly Trend
              </h3>
              <p className="text-xs text-[#94A3B8] mt-0.5">Grievance volume over time</p>
            </div>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#22C55E]">
              <TrendingUp className="w-4 h-4" />
              +18.2%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="trendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#2563EB" stopOpacity={0.15} />
                  <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#94A3B8' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#2563EB"
                strokeWidth={2}
                fill="url(#trendGradient)"
                name="Grievances"
              />
            </AreaChart>
          </ResponsiveContainer>
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
            <button className="text-sm text-[#2563EB] font-medium hover:text-[#1D4ED8] transition-colors flex items-center gap-1">
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <GrievanceTable grievances={grievances} />
      </div>
    </div>
  );
}
