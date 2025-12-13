import React, { useEffect, useState } from 'react';
import { getTasks, deleteTask } from '../../api/tasks';
import TaskCard from './TaskCard';
import TaskEdit from './TaskEdit';

export default function TaskList({ refreshKey = 0 }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    setErr('');
    try {
      const { data } = await getTasks();
      setTasks(data.tasks || data || []);
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [refreshKey]);

  const handleDelete = async (id) => {
    if (!confirm('Delete this task?')) return;
    try {
      await deleteTask(id);
      await fetchTasks();
    } catch (error) {
      console.error(error);
      alert('Delete failed');
    }
  };

  if (loading) return <div className="p-6">Loading tasks...</div>;
  if (err) return <div className="p-6 text-red-600">{err}</div>;
  if (!tasks.length) return <div className="p-6">No tasks yet. Create one later.</div>;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tasks.map(task => (
          <TaskCard
            key={task._id || task.id}
            task={task}
            onDelete={handleDelete}
            onUpdate={fetchTasks}
            onEdit={(t) => setEditingTask(t)}
          />
        ))}
      </div>

      {editingTask && (
        <TaskEdit
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSaved={fetchTasks}
        />
      )}
    </>
  );
}
