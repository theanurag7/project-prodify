import React from 'react';
import AppShell from '../components/layout/AppShell';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';

export default function PomodoroPage(){
  return (
    <AppShell>
      <h1 className="text-2xl font-semibold mb-4">Pomodoro</h1>
      <PomodoroTimer />
    </AppShell>
  );
}
