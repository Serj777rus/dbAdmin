<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-950 px-4">
    <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
      <h1 class="mb-2 text-center text-2xl font-semibold text-white">
        Вход в панель
      </h1>
      <p class="mb-6 text-center text-sm text-slate-400">
        Управляйте MySQL базами на своём сервере
      </p>
      <form class="space-y-4" @submit.prevent="handleLogin">
        <div>
          <label class="text-sm text-slate-400">Email</label>
          <input
            v-model="email"
            type="email"
            class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand focus:outline-none"
            required
          />
        </div>
        <div>
          <label class="text-sm text-slate-400">Пароль</label>
          <input
            v-model="password"
            type="password"
            class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand focus:outline-none"
            required
          />
        </div>
        <button
          class="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark"
          :disabled="auth.loading"
        >
          {{ auth.loading ? 'Входим...' : 'Войти' }}
        </button>
      </form>
      <p v-if="auth.error" class="mt-4 text-center text-sm text-red-400">
        {{ auth.error }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.js';

const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');

const handleLogin = async () => {
  await auth.login(email.value, password.value);
  router.push({ name: 'dashboard' });
};
</script>

