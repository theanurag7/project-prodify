import api from './axios';

// adjust endpoint paths if your backend uses different routes
export const startPomodoroSession = (payload) => api.post('/pomodoro/sessions', payload);
export const getPomodoroSessions = () => api.get('/pomodoro/sessions');
