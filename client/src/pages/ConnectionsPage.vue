<template>
  <div class="grid gap-6 lg:grid-cols-2">
    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm uppercase text-slate-500">Подключения</p>
          <h2 class="text-2xl font-semibold text-white">Сохранённые сервера</h2>
        </div>
        <button
          class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-brand hover:text-white"
          @click="load"
        >
          Обновить
        </button>
      </div>
      <div class="mt-6 space-y-4">
        <div
          v-for="connection in connections.items"
          :key="connection.id"
          class="rounded-xl border border-slate-800 bg-slate-900/60 p-4"
        >
          <p class="text-lg font-semibold text-white">{{ connection.name }}</p>
          <p class="text-sm text-slate-400">
            {{ connection.host }}:{{ connection.port }} · {{ connection.username }}
          </p>
          <div class="mt-4 flex gap-3">
            <RouterLink
              class="rounded-lg bg-brand/20 px-3 py-1 text-sm text-brand"
              :to="{ name: 'databases', params: { connectionId: connection.id } }"
            >
              Открыть базы
            </RouterLink>
            <button
              class="rounded-lg border border-rose-500/40 px-3 py-1 text-sm text-rose-300 hover:bg-rose-500/20"
              @click="connections.deleteConnection(connection.id)"
            >
              Удалить
            </button>
          </div>
        </div>
        <p v-if="!connections.items.length" class="text-sm text-slate-500">
          Добавьте первое подключение для работы с MySQL
        </p>
      </div>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h2 class="text-2xl font-semibold text-white">Новое подключение</h2>
      <form class="mt-6 space-y-4" @submit.prevent="handleCreate">
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="text-sm text-slate-400">Название</label>
            <input
              v-model="form.name"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
              required
            />
          </div>
          <div>
            <label class="text-sm text-slate-400">Хост</label>
            <input
              v-model="form.host"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
              required
            />
          </div>
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <div>
            <label class="text-sm text-slate-400">Порт</label>
            <input
              v-model.number="form.port"
              type="number"
              min="1"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
              required
            />
          </div>
          <div>
            <label class="text-sm text-slate-400">Пользователь</label>
            <input
              v-model="form.username"
              class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
              required
            />
          </div>
        </div>
        <div>
          <label class="text-sm text-slate-400">Пароль</label>
          <input
            v-model="form.password"
            type="password"
            class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
            required
          />
        </div>
        <label class="flex items-center gap-2 text-sm text-slate-300">
          <input v-model="form.ssl" type="checkbox" class="rounded border-slate-700 bg-slate-900" />
          Использовать SSL
        </label>
        <button
          class="w-full rounded-xl bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark"
        >
          Сохранить
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import { useConnectionsStore } from '../store/connections.js';

const connections = useConnectionsStore();

const form = reactive({
  name: '',
  host: '',
  port: 3306,
  username: '',
  password: '',
  ssl: false
});

const load = () => connections.fetchConnections();

onMounted(load);

const handleCreate = async () => {
  await connections.createConnection(form);
  Object.assign(form, { name: '', host: '', port: 3306, username: '', password: '', ssl: false });
};
</script>

