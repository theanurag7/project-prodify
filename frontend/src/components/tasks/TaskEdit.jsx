import React, { useState } from 'react';
import { updateTask } from '../../api/tasks';

export default function TaskEdit({ task, onClose, onSaved }) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState(task?.priority || 'normal');
  const [completed, setCompleted] = useState(Boolean(task?.completed));
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!title.trim()) return setErr('Title is required');
    setLoading(true);
    try {
      const payload = { title, description, priority, completed };
      await updateTask(task._id || task.id, payload);
      if (onSaved) onSaved();
      if (onClose) onClose();
    } catch (error) {
      console.error('update failed', error);
      setErr(error?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form onSubmit={submit} className="w-full max-w-lg bg-white p-6 rounded shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Edit Task</h3>
          <button type="button" onClick={onClose} className="text-slate-600">Close</button>
        </div>

        {err && <div className="text-red-600 mb-2">{err}</div>}

        <label className="block mb-2">
          <span className="text-sm">Title</span>
          <input value={title} onChange={(e)=>setTitle(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Description</span>
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} className="mt-1 block w-full p-2 border rounded" />
        </label>

        <label className="block mb-2">
          <span className="text-sm">Priority</span>
          <select value={priority} onChange={(e)=>setPriority(e.target.value)} className="mt-1 block p-2 border rounded">
            <option value="low">Low</option>
            <option value="normal">Normal</option>
            <option value="high">High</option>
          </select>
        </label>

        <label className="flex items-center gap-2 mb-4">
          <input type="checkbox" checked={completed} onChange={(e)=>setCompleted(e.target.checked)} />
          <span className="text-sm">Completed</span>
        </label>

        <div className="flex gap-2">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-slate-800 text-white rounded">
            {loading ? 'Saving…' : 'Save'}
          </button>
          <button type="button" onClick={onClose} className="px-4 py-2 border rounded">Cancel</button>
        </div>
      </form>
    </div>
  );
}
