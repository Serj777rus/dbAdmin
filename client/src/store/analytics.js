import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useAnalyticsStore = defineStore('analytics', {
  state: () => ({
    summary: null,
    loading: false
  }),
  actions: {
    async fetchSummary() {
      this.loading = true;
      try {
        const { data } = await api.get('/analytics/summary');
        this.summary = data;
      } finally {
        this.loading = false;
      }
    }
  }
});

