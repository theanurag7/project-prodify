import React, { useEffect, useRef, useState } from 'react';
import { startPomodoroSession } from '../../api/pomodoro';

/**
 * Improved Pomodoro timer:
 * - minutes can be fractional (e.g. 0.1 => 6s) for testing
 * - secondsLeft derived from minutes on mount / when minutes change (if not running)
 * - sends durationMinutes and durationSeconds to backend
 * - prevents double submissions using busy flag
 */
export default function PomodoroTimer() {
  const [minutes, setMinutes] = useState(25);
  const [secondsLeft, setSecondsLeft] = useState(Math.ceil(25 * 60));
  const [running, setRunning] = useState(false);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');
  const intervalRef = useRef(null);

  // keep secondsLeft in sync when minutes change (only when not running)
  useEffect(() => {
    if (!running) {
      const secs = Math.max(1, Math.ceil(Number(minutes) * 60));
      setSecondsLeft(secs);
    }
  }, [minutes, running]);

  // start / stop interval
  useEffect(() => {
    if (running && !intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => s - 1);
      }, 1000);
    }
    if (!running && intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [running]);

  // when time runs out
  useEffect(() => {
    if (secondsLeft <= 0 && running && !busy) {
      // stop timer and send session
      setRunning(false);
      handleComplete();
    }
  }, [secondsLeft, running, busy]);

  const formatTime = (s) => {
    if (s < 0) s = 0;
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  const start = () => {
    setMsg('');
    // if secondsLeft is zero, reset using current minutes
    if (secondsLeft <= 0) {
      setSecondsLeft(Math.max(1, Math.ceil(Number(minutes) * 60)));
    }
    setRunning(true);
  };

  const stop = () => {
    setRunning(false);
  };

  const reset = () => {
    setRunning(false);
    setSecondsLeft(Math.max(1, Math.ceil(Number(minutes) * 60)));
    setMsg('');
  };

  const handleComplete = async () => {
    if (busy) return;
    setBusy(true);
    setMsg('Saving session...');
    try {
      const durationSeconds = Math.max(1, Math.ceil(Number(minutes) * 60));
      const durationMinutes = Number(minutes);
      const payload = {
        durationMinutes,
        durationSeconds,
        pointsEarned: 1
      };
      await startPomodoroSession(payload);
      setMsg('Session saved ✅');
    } catch (err) {
      console.error('pomodoro save failed', err);
      setMsg('Failed to save session');
    } finally {
      // allow user to retry after a short delay
      setTimeout(() => {
        setBusy(false);
        setSecondsLeft(Math.max(1, Math.ceil(Number(minutes) * 60)));
        setMsg('');
      }, 1200);
    }
  };

  return (
    <div className="max-w-xl bg-white p-6 rounded shadow">
      <h3 className="text-lg font-medium mb-3">Pomodoro Timer</h3>

      <div className="mb-3">
        <label className="block text-sm mb-1">Minutes (you can use decimals for quick tests)</label>
        <input
          type="number"
          min="0.01"
          step="0.01"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          disabled={running}
          className="w-40 p-2 border rounded"
        />
      </div>

      <div className="text-4xl font-mono mb-4">{formatTime(secondsLeft)}</div>

      <div className="flex gap-2">
        {!running ? (
          <button onClick={start} className="px-4 py-2 bg-green-600 text-white rounded">Start</button>
        ) : (
          <button onClick={stop} className="px-4 py-2 bg-yellow-500 text-white rounded">Stop</button>
        )}

        <button onClick={reset} className="px-4 py-2 bg-slate-800 text-white rounded">Reset</button>

        <button
          onClick={handleComplete}
          disabled={busy}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          title="Manually mark a session as completed and save"
        >
          {busy ? 'Saving...' : 'Save Now'}
        </button>
      </div>

      {msg && <div className="mt-3 text-sm text-slate-700">{msg}</div>}
    </div>
  );
}
