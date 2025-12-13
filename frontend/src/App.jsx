import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Dashboard from './pages/Dashboard';
import TasksPage from './pages/TasksPage';
import PomodoroPage from './pages/PomodoroPage';
import AnalyticsPage from './pages/AnalyticsPage';
import AIChatPage from './pages/AIChatPage';
import ProtectedRoute from './components/common/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/pomodoro" element={<PomodoroPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/ai-chat" element={<AIChatPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}