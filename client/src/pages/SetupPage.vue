<template>
  <div class="flex min-h-screen items-center justify-center bg-slate-950 px-4">
    <div class="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/70 p-8 shadow-xl">
      <h1 class="mb-2 text-center text-2xl font-semibold text-white">
        Первый запуск
      </h1>
      <p class="mb-6 text-center text-sm text-slate-400">
        Создайте главного администратора для доступа к панели
      </p>
      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div>
          <label class="text-sm text-slate-400">Имя и фамилия</label>
          <input
            v-model="form.fullName"
            class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand focus:outline-none"
            required
          />
        </div>
        <div>
          <label class="text-sm text-slate-400">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand focus:outline-none"
            required
          />
        </div>
        <div>
          <label class="text-sm text-slate-400">Пароль</label>
          <input
            v-model="form.password"
            type="password"
            class="mt-1 w-full rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-white focus:border-brand focus:outline-none"
            required
            minlength="8"
          />
        </div>
        <button
          class="w-full rounded-lg bg-brand px-4 py-2 font-semibold text-white transition hover:bg-brand-dark"
        >
          Создать администратора
        </button>
      </form>
      <p v-if="success" class="mt-4 text-center text-sm text-emerald-400">
        Аккаунт создан! Можете войти.
      </p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../store/auth.js';

const auth = useAuthStore();
const router = useRouter();

const form = reactive({
  email: '',
  password: '',
  fullName: ''
});

const success = ref(false);

const handleSubmit = async () => {
  await auth.registerMaster(form);
  success.value = true;
  setTimeout(() => router.push({ name: 'login' }), 1500);
};
</script>

