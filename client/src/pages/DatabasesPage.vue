<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-sm uppercase text-slate-500">Подключение</p>
        <h2 class="text-3xl font-semibold text-white">
          Базы сервера #{{ connectionId }}
        </h2>
      </div>
      <button
        class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-brand"
        @click="load"
      >
        Обновить
      </button>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div class="grid gap-4 lg:grid-cols-3">
        <div
          v-for="db in databases.databases"
          :key="db"
          class="rounded-xl border border-slate-800 bg-slate-950/40 p-4"
        >
          <p class="text-lg font-semibold text-white">{{ db }}</p>
          <div class="mt-4 flex gap-3">
            <RouterLink
              :to="{ name: 'tables', params: { connectionId, dbName: db } }"
              class="rounded-lg bg-brand/20 px-3 py-1 text-sm text-brand"
            >
              Таблицы
            </RouterLink>
            <button
              class="rounded-lg border border-rose-500/40 px-3 py-1 text-sm text-rose-300 hover:bg-rose-500/20"
              @click="removeDb(db)"
            >
              Удалить
            </button>
          </div>
        </div>
      </div>

      <form class="mt-6 flex gap-3" @submit.prevent="createDb">
        <input
          v-model="newDb"
          placeholder="Название базы"
          class="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
          required
        />
        <button class="rounded-lg bg-brand px-4 py-2 text-white">Создать</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useDatabasesStore } from '../store/databases.js';
import api from '../services/api.js';

const route = useRoute();

const databases = useDatabasesStore();
const newDb = ref('');

const connectionId = computed(() => Number(route.params.connectionId));

const getConnectionId = () => connectionId.value;

const load = () => databases.fetchDatabases(getConnectionId());

onMounted(load);
watch(connectionId, load);

const createDb = async () => {
  await api.post(`/db/${getConnectionId()}/databases`, { name: newDb.value });
  newDb.value = '';
  load();
};

const removeDb = async (dbName) => {
  await api.delete(`/db/${getConnectionId()}/databases/${dbName}`);
  load();
};
</script>

