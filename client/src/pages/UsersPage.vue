<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-sm uppercase text-slate-500">Управление</p>
        <h2 class="text-3xl font-semibold text-white">Пользователи панели</h2>
      </div>
      <button
        class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-brand"
        @click="load"
      >
        Обновить список
      </button>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 class="text-xl font-semibold text-white">Добавить администратора</h3>
      <form class="mt-4 grid gap-4 md:grid-cols-2" @submit.prevent="createUser">
        <input
          v-model="form.fullName"
          placeholder="Имя"
          class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
          required
        />
        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
          required
        />
        <input
          v-model="form.password"
          type="password"
          placeholder="Пароль"
          class="rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand"
          required
          minlength="8"
        />
        <button class="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
          Создать
        </button>
      </form>
    </div>

    <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
      <h3 class="text-xl font-semibold text-white">Пользователи</h3>
      <table class="mt-4 min-w-full divide-y divide-slate-800 text-sm">
        <thead>
          <tr class="text-left text-slate-400">
            <th class="px-3 py-2">Имя</th>
            <th class="px-3 py-2">Email</th>
            <th class="px-3 py-2">Роль</th>
            <th class="px-3 py-2">Последний вход</th>
            <th class="px-3 py-2"></th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-900/60">
          <tr v-for="user in users" :key="user.id" class="text-white">
            <td class="px-3 py-3">{{ user.fullName }}</td>
            <td class="px-3 py-3 text-slate-300">{{ user.email }}</td>
            <td class="px-3 py-3 text-xs uppercase text-slate-400">{{ user.role }}</td>
            <td class="px-3 py-3 text-slate-400">{{ formatDate(user.lastLoginAt) }}</td>
            <td class="px-3 py-3 text-right">
              <button
                v-if="user.role !== 'master'"
                class="rounded-lg border border-rose-500/50 px-3 py-1 text-rose-400 hover:bg-rose-500/10"
                @click="remove(user.id)"
              >
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import api from '../services/api.js';

const users = ref([]);

const form = reactive({
  fullName: '',
  email: '',
  password: ''
});

const load = async () => {
  const { data } = await api.get('/users');
  users.value = data;
};

onMounted(load);

const createUser = async () => {
  await api.post('/users', form);
  Object.assign(form, { fullName: '', email: '', password: '' });
  load();
};

const remove = async (id) => {
  await api.delete(`/users/${id}`);
  load();
};

const formatDate = (value) => {
  if (!value) return '—';
  return new Date(value).toLocaleString('ru-RU');
};
</script>

