import React, { useState } from 'react';
import AppShell from '../components/layout/AppShell';
import TaskList from '../components/tasks/TaskList';
import TaskForm from '../components/tasks/TaskForm';

export default function TasksPage(){
  // refreshKey increments to trigger TaskList re-fetch via prop
  const [refreshKey, setRefreshKey] = useState(0);

  const handleCreated = () => {
    setRefreshKey(k => k + 1);
  };

  return (
    <AppShell>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-semibold mb-4">Tasks</h1>
        <TaskForm onCreated={handleCreated} />
        {/* pass refreshKey so TaskList re-fetches when it changes */}
        <TaskList refreshKey={refreshKey} />
      </div>
    </AppShell>
  );
}
