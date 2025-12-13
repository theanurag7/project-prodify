import React, { useEffect, useState } from 'react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { weeklyPoints } from '../../api/analytics';

/**
 * Expects backend to return something like:
 *  { success: true, data: [{ date: '2025-12-07', points: 3 }, ...] }
 * or just an array: [{ date, points }, ...]
 *
 * The component is defensive and will handle several shapes.
 */

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
        // normalize response
        let payload = res?.data ?? res;
        if (payload?.success && payload?.data) payload = payload.data;
        // if payload is an object with keys for days, convert to array
        if (!Array.isArray(payload) && typeof payload === 'object') {
          // example: { "2025-12-01": 3, ... }
          payload = Object.keys(payload).map(k => ({ date: k, points: payload[k] }));
        }
        // ensure entries have date and points
        const normalized = (payload || []).map(item => {
          return {
            date: item.date || item._id || item.label || String(item.day || ''),
            points: Number(item.points ?? item.value ?? item.count ?? 0)
          };
        });
        // sort by date ascending (best-effort)
        normalized.sort((a,b) => new Date(a.date) - new Date(b.date));
        if (mounted) setData(normalized);
      } catch (e) {
        console.error('weekly points load err', e);
        setErr(e?.response?.data?.message || e?.message || 'Failed to load weekly points');
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

  return (
    <div className="bg-white p-4 rounded shadow">
      <h3 className="text-lg font-medium mb-3">Weekly Points</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tickFormatter={(d) => {
              // format short date
              const dt = new Date(d);
              if (isNaN(dt)) return String(d).slice(0,10);
              return `${dt.getDate()}/${dt.getMonth()+1}`;
            }} />
            <YAxis allowDecimals={false} />
            <Tooltip formatter={(value) => [value, 'Points']} labelFormatter={(label) => `Date: ${label}`} />
            <Line type="monotone" dataKey="points" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
