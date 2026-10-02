import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { api } from "../../services/api.js";

function StatBox({ label, value, sub }) {
  return (
    <div className="card p-5 text-center">
      <p className="text-4xl font-black text-gray-900 dark:text-white">{value ?? "—"}</p>
      <p className="text-sm font-medium text-gray-500 mt-1">{label}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/analytics").then(r => setData(r.data.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse space-y-4">{[1,2,3].map(i => <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-2xl" />)}</div>;

  const COLORS = ["#6366f1","#8b5cf6","#06b6d4"];
  const deviceData = data ? [
    { name: "Desktop", value: data.devices.desktop },
    { name: "Mobile", value: data.devices.mobile },
    { name: "Tablet", value: data.devices.tablet },
  ] : [];

  return (
    <>
      <Helmet><title>Analytics — CodeFolio Dashboard</title></Helmet>
      <div className="max-w-5xl animate-fade-in">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Analytics</h1>
          <p className="text-gray-500 mt-1">Understand who is visiting your portfolio</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatBox label="Total views" value={data?.total} />
          <StatBox label="Today" value={data?.today} />
          <StatBox label="This week" value={data?.week} />
          <StatBox label="This month" value={data?.month} />
        </div>

        {/* Views chart */}
        <div className="card p-6 mb-6">
          <h2 className="font-semibold mb-6">Views — last 30 days</h2>
          {data?.dailyViews?.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={data.dailyViews}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} tickFormatter={d => d.slice(5)} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip formatter={(v) => [v, "Views"]} labelFormatter={l => `Date: ${l}`} />
                <Area type="monotone" dataKey="views" stroke="#6366f1" fill="url(#colorViews)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          ) : <p className="text-gray-400 text-center py-10">No view data yet. Share your portfolio to get started!</p>}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top referrers */}
          <div className="card p-6">
            <h2 className="font-semibold mb-5">Top Referrers</h2>
            {data?.topReferrers?.length > 0 ? (
              <div className="space-y-3">
                {data.topReferrers.map(r => (
                  <div key={r.referrer} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{r.referrer === "Direct" ? "Direct" : r.referrer}</p>
                    </div>
                    <span className="text-sm font-bold text-primary-600">{r.count}</span>
                    <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                      <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${Math.min((r.count / data.total) * 100, 100)}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : <p className="text-gray-400 text-sm">No referrer data yet.</p>}
          </div>

          {/* Devices */}
          <div className="card p-6">
            <h2 className="font-semibold mb-5">Devices</h2>
            {data?.devices && (data.devices.desktop + data.devices.mobile + data.devices.tablet) > 0 ? (
              <div className="flex items-center gap-6">
                <PieChart width={120} height={120}>
                  <Pie data={deviceData} cx={55} cy={55} innerRadius={30} outerRadius={55} dataKey="value">
                    {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                  </Pie>
                </PieChart>
                <div className="space-y-2">
                  {deviceData.map((d, i) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i] }} />
                      <span className="text-sm">{d.name}: <strong>{d.value}</strong></span>
                    </div>
                  ))}
                </div>
              </div>
            ) : <p className="text-gray-400 text-sm">No device data yet.</p>}
          </div>
        </div>
      </div>
    </>
  );
}
