<template>
  <div class="space-y-6">
    <div class="flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-wide text-slate-500">
          Состояние инфраструктуры
        </p>
        <h2 class="text-3xl font-semibold text-white">Аналитика MySQL</h2>
      </div>
      <button
        class="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:border-brand hover:text-white"
        @click="refresh"
      >
        Обновить данные
      </button>
    </div>

    <div class="grid gap-4 md:grid-cols-3">
      <StatCard
        title="Всего запросов"
        :value="summary?.totalQueries ?? 0"
        subtitle="за период наблюдений"
      />
      <StatCard
        title="Базы данных"
        :value="summary?.databasesCount ?? 0"
        subtitle="активные базы"
      />
      <StatCard
        title="Используемый объём"
        :value="formatMb(summary?.storageUsedMb)"
        subtitle="MB"
      />
    </div>

    <div class="grid gap-4 md:grid-cols-2">
      <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 class="mb-4 text-lg font-semibold text-white">Качество запросов</h3>
        <div class="flex items-center gap-6 text-4xl font-bold">
          <span class="text-emerald-400">{{ summary?.successfulQueries ?? 0 }}</span>
          <span class="text-slate-600">/</span>
          <span class="text-rose-400">{{ summary?.failedQueries ?? 0 }}</span>
        </div>
        <p class="mt-2 text-sm text-slate-400">
          Успешные vs неуспешные операции
        </p>
      </div>
      <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
        <h3 class="mb-4 text-lg font-semibold text-white">Активные пользователи</h3>
        <p class="text-4xl font-bold text-white">
          {{ summary?.activeUsers ?? 0 }}
        </p>
        <p class="mt-2 text-sm text-slate-400">
          Пользователи, совершавшие операции за период
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue';
import { useAnalyticsStore } from '../store/analytics.js';
import StatCard from '../components/StatCard.vue';

const analytics = useAnalyticsStore();

const summary = computed(() => analytics.summary);

const refresh = () => {
  analytics.fetchSummary();
};

onMounted(refresh);

const formatMb = (value) => {
  if (!value) return '0';
  return `${value.toFixed(1)} МБ`;
};
</script>

