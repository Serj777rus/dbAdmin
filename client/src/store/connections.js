import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useConnectionsStore = defineStore('connections', {
  state: () => ({
    items: [],
    loading: false,
    error: ''
  }),
  actions: {
    async fetchConnections() {
      this.loading = true;
      try {
        const { data } = await api.get('/connections');
        this.items = data;
      } finally {
        this.loading = false;
      }
    },
    async createConnection(payload) {
      const { data } = await api.post('/connections', payload);
      this.items.push(data);
    },
    async deleteConnection(id) {
      await api.delete(`/connections/${id}`);
      this.items = this.items.filter((item) => item.id !== id);
    }
  }
});

