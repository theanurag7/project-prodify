import React, { useState } from 'react';
import { createTask } from '../../api/tasks';

export default function TaskForm({ onCreated }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('normal');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!title.trim()) return setErr('Title is required');
    setLoading(true);
    try {
      const payload = { title, description, priority };
      await createTask(payload);
      setTitle(''); setDescription(''); setPriority('normal');
      if (onCreated) onCreated();
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || 'Create task failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="mb-6 bg-white p-4 rounded shadow">
      <h3 className="font-medium mb-3">Create Task</h3>
      {err && <div className="text-red-600 mb-2">{err}</div>}
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="block w-full p-2 border rounded mb-2"
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="block w-full p-2 border rounded mb-2"
      />
      <select value={priority} onChange={(e) => setPriority(e.target.value)} className="p-2 border rounded mb-3">
        <option value="low">Low</option>
        <option value="normal">Normal</option>
        <option value="high">High</option>
      </select>
      <div>
        <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-800 text-white rounded">
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
    </form>
  );
}
