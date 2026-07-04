import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from 'recharts';

const monthlyData = [
  { name: 'Jan', filed: 120, resolved: 95 },
  { name: 'Feb', filed: 98, resolved: 82 },
  { name: 'Mar', filed: 145, resolved: 118 },
  { name: 'Apr', filed: 132, resolved: 110 },
  { name: 'May', filed: 168, resolved: 142 },
  { name: 'Jun', filed: 155, resolved: 130 },
  { name: 'Jul', filed: 89, resolved: 72 },
];

const pieData = [
  { name: 'Resolved', value: 847, color: '#22C55E' },
  { name: 'Processing', value: 215, color: '#14B8A6' },
  { name: 'Pending', value: 122, color: '#64748B' },
  { name: 'Rejected', value: 100, color: '#EF4444' },
];

const satisfactionData = [
  { name: 'Jan', score: 72 },
  { name: 'Feb', score: 75 },
  { name: 'Mar', score: 68 },
  { name: 'Apr', score: 78 },
  { name: 'May', score: 82 },
  { name: 'Jun', score: 85 },
  { name: 'Jul', score: 88 },
];

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
  return (
    <div className="space-y-6">
      <div className="animate-fade-in-up">
        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">Analytics</h2>
        <p className="text-sm text-[#64748B] mt-0.5">Performance metrics and grievance analytics</p>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Monthly Trend */}
        <div className="col-span-8 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
          <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-1">Monthly Overview</h3>
          <p className="text-xs text-[#94A3B8] mb-5">Grievances filed vs resolved by month</p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={monthlyData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="filed" fill="#2563EB" shape={<CustomBarShape />} barSize={18} name="Filed" />
              <Bar dataKey="resolved" fill="#14B8A6" shape={<CustomBarShape />} barSize={18} name="Resolved" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Status Pie */}
        <div className="col-span-4 bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
          <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-1">Status Distribution</h3>
          <p className="text-xs text-[#94A3B8] mb-5">Current breakdown of all grievances</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                {pieData.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            {pieData.map((d) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-[#64748B]">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }} />
                {d.name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Satisfaction Trend */}
      <div className="bg-white rounded-2xl p-6 shadow-card animate-fade-in-up">
        <h3 className="text-base font-semibold text-[#0F172A] tracking-tight mb-1">Citizen Satisfaction Score</h3>
        <p className="text-xs text-[#94A3B8] mb-5">Average satisfaction rating over time</p>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={satisfactionData}>
            <defs>
              <linearGradient id="satGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22C55E" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <YAxis domain={[60, 100]} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94A3B8' }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="score" stroke="#22C55E" strokeWidth={2} fill="url(#satGradient)" name="Score" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
