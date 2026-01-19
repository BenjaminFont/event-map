<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { Event } from '../../types/event'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  events: Event[]
}>()

const chartData = computed(() => {
  let internal = 0
  let external = 0

  props.events.forEach(event => {
    if (event.audience === 'internal') {
      internal++
    } else {
      external++
    }
  })

  const total = internal + external
  const internalPct = total > 0 ? Math.round((internal / total) * 100) : 0
  const externalPct = total > 0 ? Math.round((external / total) * 100) : 0

  return {
    labels: ['Internal Events', 'External Events'],
    datasets: [
      {
        data: [internal, external],
        backgroundColor: ['#10B981', '#A78BFA'],
        borderWidth: 0,
        cutout: '70%'
      }
    ],
    percentages: [internalPct, externalPct]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: '#1F2937',
      padding: 12,
      cornerRadius: 8
    }
  }
}

const legendItems = computed(() => {
  const colors = ['#10B981', '#A78BFA']
  return chartData.value.labels.map((label, idx) => ({
    label,
    color: colors[idx],
    percentage: chartData.value.percentages[idx]
  }))
})
</script>

<template>
  <div class="who-chart">
    <h3>Who</h3>
    <div class="chart-content">
      <div class="chart-container">
        <Doughnut :data="chartData" :options="chartOptions" />
      </div>
      <div class="legend">
        <div v-for="item in legendItems" :key="item.label" class="legend-item">
          <span class="percentage">{{ item.percentage }}%</span>
          <span class="label">{{ item.label }}</span>
          <span class="bar" :style="{ backgroundColor: item.color, width: `${item.percentage}%` }"></span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.who-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

h3 {
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
}

.chart-content {
  display: flex;
  gap: 20px;
  align-items: center;
}

.chart-container {
  width: 100px;
  height: 100px;
  flex-shrink: 0;
}

.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.legend-item {
  display: grid;
  grid-template-columns: 40px 1fr;
  grid-template-rows: auto auto;
  gap: 2px 8px;
  align-items: center;
}

.percentage {
  font-weight: 600;
  font-size: 0.95rem;
  grid-row: 1;
}

.label {
  font-size: 0.85rem;
  color: #6B7280;
  grid-row: 1;
}

.bar {
  grid-column: 2;
  grid-row: 2;
  height: 4px;
  border-radius: 2px;
  max-width: 100%;
}
</style>
