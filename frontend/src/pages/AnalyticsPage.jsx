import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { weeklyPoints } from '../api/analytics';

/**
 * WeeklyPointsChart
 * - fetches weekly points from backend
 * - normalizes into last 7 days (fills zeros)
 * - displays total points and a nicely formatted x-axis
 */

function formatShortDate(d) {
  const dt = new Date(d);
  if (isNaN(dt)) return String(d).slice(0,10);
  const day = dt.getDate();
  const monthShort = dt.toLocaleString(undefined, { month: 'short' }); // "Dec"
  return `${day} ${monthShort}`;
}

function isoDateOnly(d) {
  const dt = new Date(d);
  // normalize to yyyy-mm-dd
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, '0');
  const day = String(dt.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export default function WeeklyPointsChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      setErr('');
      try {
        const res = await weeklyPoints();
        // normalize response shapes
        let payload = res?.data ?? res;
        if (payload?.success && payload?.data) payload = payload.data;

        // convert to map by iso-date -> points
        const map = {};
        if (Array.isArray(payload)) {
          payload.forEach(item => {
            const dateKey = isoDateOnly(item.date || item._id || item.label || item.day || new Date());
            map[dateKey] = Number(item.points ?? item.value ?? item.count ?? item.pointsAwarded ?? 0);
          });
        } else if (payload && typeof payload === 'object') {
          // { "2025-12-01": 3, ... }
          Object.keys(payload).forEach(k => {
            map[isoDateOnly(k)] = Number(payload[k] ?? 0);
          });
        }

        // build last 7 days array (today included)
        const out = [];
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
          const dt = new Date(today);
          dt.setDate(today.getDate() - i);
          const key = isoDateOnly(dt);
          out.push({ date: key, points: map[key] ?? 0 });
        }

        if (mounted) setData(out);
      } catch (e) {
        console.error('weekly points load err', e);
        if (mounted) setErr(e?.response?.data?.message || e?.message || 'Failed to load weekly points');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6">Loading chart...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!data.length) return <div className="p-6">No points data for the last week.</div>;

  const total = data.reduce((s, it) => s + Number(it.points || 0), 0);

  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-medium">Weekly Points</h3>
        <div className="text-sm text-slate-600">Total points this week: <span className="font-semibold">{total}</span></div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => formatShortDate(d)} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [value, 'Points']} labelFormatter={(label) => `Date: ${formatShortDate(label)}`} />
            <Line type="monotone" dataKey="points" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
