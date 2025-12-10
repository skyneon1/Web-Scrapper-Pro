import axios from 'axios';

// Use environment variable for API URL, fallback to relative path for Vercel
const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const scraperAPI = {
  createJob: async (data) => {
    const response = await api.post('/scrape', data);
    return response.data;
  },

  getJob: async (jobId) => {
    const response = await api.get(`/jobs/${jobId}`);
    return response.data;
  },

  listJobs: async (status = null, limit = 100, offset = 0) => {
    const params = { limit, offset };
    if (status) params.status = status;
    const response = await api.get('/jobs', { params });
    return response.data;
  },

  deleteJob: async (jobId) => {
    const response = await api.delete(`/jobs/${jobId}`);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },

  exportJSON: (jobId) => {
    return `${API_BASE_URL}/export/${jobId}/json`;
  },

  exportCSV: (jobId) => {
    return `${API_BASE_URL}/export/${jobId}/csv`;
  },
};

export default api;
