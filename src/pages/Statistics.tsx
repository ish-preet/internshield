import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { TrendingUp, AlertTriangle, Shield, Users } from 'lucide-react';
import { useReports } from '../hooks/useReports';

export default function Statistics() {
  const { reports } = useReports();

  const scamTypeData = [
    { name: 'Fee Scams', value: reports.filter(r => r.scamType === 'fee-scam').length || 15, color: '#ef4444' },
    { name: 'Fake Jobs', value: reports.filter(r => r.scamType === 'fake-job').length || 10, color: '#f59e0b' },
    { name: 'Phishing', value: reports.filter(r => r.scamType === 'phishing').length || 5, color: '#3b82f6' },
    { name: 'Other', value: reports.filter(r => r.scamType === 'other').length || 2, color: '#8b5cf6' },
  ];

  const monthlyData = [
    { month: 'Jan', reports: 45 },
    { month: 'Feb', reports: 52 },
    { month: 'Mar', reports: 88 },
    { month: 'Apr', reports: 65 },
    { month: 'May', reports: 120 },
    { month: 'Jun', reports: 95 },
  ];

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Scam Statistics Dashboard</h1>
        <p className="text-slate-600 dark:text-slate-400">Deep dive into the data protecting students worldwide.</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {[
          { label: 'Total Reports', value: reports.length, icon: Shield, color: 'text-brand-500' },
          { label: 'High Risk', value: reports.filter(r => r.riskLevel === 'Scam').length, icon: AlertTriangle, color: 'text-red-500' },
          { label: 'Active Users', value: '12.4k', icon: Users, color: 'text-indigo-500' },
          { label: 'Growth', value: '+18%', icon: TrendingUp, color: 'text-emerald-500' },
        ].map((stat, i) => (
          <div key={i} className="glass-card p-8 text-center">
            <stat.icon className={cn("w-8 h-8 mx-auto mb-4", stat.color)} />
            <div className="text-3xl font-bold mb-1">{stat.value}</div>
            <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-8">Monthly Scam Trends</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorReports" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="reports" stroke="#0ea5e9" fillOpacity={1} fill="url(#colorReports)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="glass-card p-8">
          <h3 className="text-xl font-bold mb-8">Scam Type Distribution</h3>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={scamTypeData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {scamTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="glass-card p-8">
        <h3 className="text-xl font-bold mb-8">Scam Categories Breakdown</h3>
        <div className="grid md:grid-cols-4 gap-8">
          {scamTypeData.map((item, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-black mb-2" style={{ color: item.color }}>{item.value}</div>
              <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{item.name}</div>
              <div className="w-full h-2 bg-slate-100 rounded-full mt-4 overflow-hidden">
                <div className="h-full" style={{ width: `${(item.value / reports.length) * 100}%`, backgroundColor: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
