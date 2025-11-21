import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    user: null,
    masterExists: true,
    isInitialized: false,
    loading: false,
    error: ''
  }),
  getters: {
    isAuthenticated: (state) => Boolean(state.token)
  },
  actions: {
    async checkMasterStatus() {
      const { data } = await api.get('/setup/status');
      this.masterExists = data.masterExists;
      this.isInitialized = true;
    },
    async fetchProfile() {
      if (!this.token) return;
      try {
        const { data } = await api.get('/auth/me');
        this.user = data;
      } catch {
        this.logout();
      }
    },
    async registerMaster(payload) {
      await api.post('/setup/master', payload);
      this.masterExists = true;
    },
    async login(email, password) {
      this.loading = true;
      this.error = '';
      try {
        const { data } = await api.post('/auth/login', { email, password });
        this.token = data.token;
        this.user = data.user;
        localStorage.setItem('token', data.token);
      } catch (error) {
        this.error = 'Не удалось войти. Проверьте данные';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = '';
      this.user = null;
      localStorage.removeItem('token');
    }
  }
});

