<script setup lang="ts">
defineProps<{
  value: number | string
  label: string
  highlighted?: boolean
}>()
</script>

<template>
  <div class="stats-card" :class="{ highlighted }">
    <div class="value">{{ value }}</div>
    <div class="label">{{ label }}</div>
  </div>
</template>

<style scoped>
.stats-card {
  background: white;
  border-radius: 12px;
  padding: 20px 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stats-card.highlighted {
  background: #10B981;
  color: white;
}

.value {
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 1;
  margin-bottom: 4px;
}

.label {
  font-size: 0.95rem;
  opacity: 0.9;
}
</style>
