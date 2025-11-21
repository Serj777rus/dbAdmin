import { defineStore } from 'pinia';
import api from '../services/api.js';

export const useDatabasesStore = defineStore('databases', {
  state: () => ({
    databases: [],
    tables: [],
    tableData: [],
    tableColumns: [],
    loading: false
  }),
  actions: {
    async fetchDatabases(connectionId) {
      this.loading = true;
      try {
        const { data } = await api.get(`/db/${connectionId}/databases`);
        this.databases = data;
      } finally {
        this.loading = false;
      }
    },
    async fetchTables(connectionId, dbName) {
      this.loading = true;
      try {
        const { data } = await api.get(
          `/db/${connectionId}/databases/${dbName}/tables`
        );
        this.tables = data;
      } finally {
        this.loading = false;
      }
    },
    async fetchTableData(connectionId, dbName, tableName) {
      this.loading = true;
      try {
        const { data } = await api.get(
          `/db/${connectionId}/databases/${dbName}/tables/${tableName}/data`
        );
        this.tableData = data.rows;
        this.tableColumns = data.columns;
      } finally {
        this.loading = false;
      }
    }
  }
});

