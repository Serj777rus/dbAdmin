<template>
  <div class="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
    <p class="text-sm uppercase tracking-wide text-slate-500">{{ title }}</p>
    <p class="mt-2 text-3xl font-semibold text-white">{{ value }}</p>
    <p class="mt-1 text-sm text-slate-400">{{ subtitle }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [String, Number],
    required: true
  },
  subtitle: {
    type: String,
    default: ''
  }
});
</script>

