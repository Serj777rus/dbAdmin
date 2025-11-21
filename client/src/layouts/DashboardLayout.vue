<template>
  <div class="flex min-h-screen bg-slate-950 text-slate-100">
    <aside class="hidden w-64 border-r border-slate-800 bg-slate-900/70 lg:block">
      <div class="flex h-16 items-center gap-2 px-6">
        <div class="h-10 w-10 rounded-full bg-brand/20 text-center leading-10 text-brand">
          DB
        </div>
        <div>
          <p class="text-sm uppercase tracking-wide text-slate-400">MySQL</p>
          <p class="text-lg font-semibold">Админ панель</p>
        </div>
      </div>
      <nav class="space-y-1 px-4 py-6">
        <RouterLink
          v-for="link in navLinks"
          :key="link.name"
          :to="link.to"
          class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-800"
          :class="isActive(link.to) ? 'bg-slate-800 text-white' : 'text-slate-400'"
        >
          <component :is="link.icon" class="h-5 w-5" />
          {{ link.label }}
        </RouterLink>
      </nav>
    </aside>
    <div class="flex flex-1 flex-col">
      <header
        class="flex items-center justify-between border-b border-slate-800 bg-slate-900/70 px-6 py-4"
      >
        <h1 class="text-xl font-semibold text-white">Управление MySQL</h1>
        <div class="flex items-center gap-3">
          <p class="text-sm text-slate-400">{{ auth.user?.fullName }}</p>
          <button
            class="rounded-lg border border-slate-700 px-3 py-1 text-sm text-slate-300 hover:border-brand hover:text-white"
            @click="auth.logout"
          >
            Выйти
          </button>
        </div>
      </header>
      <main class="flex-1 bg-slate-950 p-6">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../store/auth.js';
import { HomeIcon, UsersIcon, ServerStackIcon } from '@heroicons/vue/24/solid';

const auth = useAuthStore();
const route = useRoute();

const navLinks = computed(() => {
  const links = [
    { name: 'dashboard', label: 'Дашборд', to: { name: 'dashboard' }, icon: HomeIcon },
    {
      name: 'connections',
      label: 'Подключения',
      to: { name: 'connections' },
      icon: ServerStackIcon
    }
  ];
  if (auth.user?.role === 'master') {
    links.push({
      name: 'users',
      label: 'Пользователи',
      to: { name: 'users' },
      icon: UsersIcon
    });
  }
  return links;
});

const isActive = (to) => {
  if (!to.name) return false;
  return route.name === to.name;
};
</script>

