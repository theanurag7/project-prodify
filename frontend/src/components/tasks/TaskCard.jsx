import React, { useState } from 'react';
import { updateTask } from '../../api/tasks';

export default function TaskCard({ task, onDelete, onUpdate, onEdit }) {
  if (!task) return null;
  const { title, description, priority, completed } = task;
  const [busy, setBusy] = useState(false);

  const toggleComplete = async () => {
    setBusy(true);
    try {
      await updateTask(task._id || task.id, { completed: !completed });
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error(err);
      alert('Failed to update task');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className={`bg-white p-4 rounded shadow-sm border ${completed ? 'opacity-70' : ''}`}>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-medium">{title}</h3>
          {description && <p className="text-sm mt-1 text-slate-600">{description}</p>}
          <div className="mt-2 text-xs text-slate-500">Priority: {priority ?? 'normal'}</div>
        </div>

        <div className="ml-4 flex flex-col items-end gap-2">

          <div className="flex gap-2">
            <button
              onClick={() => onEdit && onEdit(task)}
              className="text-sm px-2 py-1 rounded bg-blue-600 text-white"
              type="button"
            >
              Edit
            </button>

            <button
              onClick={() => onDelete && onDelete(task._id || task.id)}
              className="text-sm px-2 py-1 rounded bg-red-600 text-white"
              type="button"
            >
              Delete
            </button>
          </div>

          <button
            onClick={toggleComplete}
            disabled={busy}
            className="text-sm px-2 py-1 rounded bg-slate-800 text-white"
            type="button"
          >
            {busy ? 'Saving...' : (completed ? 'Undo' : 'Mark Done')}
          </button>

        </div>
      </div>
    </div>
  );
}
