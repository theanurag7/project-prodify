import api from './axios';

// GET /api/analytics/points/weekly
export function weeklyPoints() {
  return api.get('/analytics/points/weekly');
}