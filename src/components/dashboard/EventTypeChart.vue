<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip
} from 'chart.js'
import type { Event } from '../../types/event'
import { EVENT_TYPE_COLORS } from '../../types/event'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip)

const props = defineProps<{
  events: Event[]
}>()

const chartData = computed(() => {
  const counts: Record<string, number> = {}

  props.events.forEach(event => {
    counts[event.eventType] = (counts[event.eventType] || 0) + 1
  })

  // Sort by count descending, filter out zero
  const sorted = Object.entries(counts)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])

  const labels = sorted.map(([type]) => type)
  const data = sorted.map(([, count]) => count)
  const colors = labels.map(type => EVENT_TYPE_COLORS[type as keyof typeof EVENT_TYPE_COLORS] || '#6B7280')

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: colors,
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.8
      }
    ]
  }
})

const chartOptions = {
  indexAxis: 'y' as const,
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
  },
  scales: {
    x: {
      display: false,
      grid: {
        display: false
      }
    },
    y: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280',
        font: {
          size: 12
        }
      }
    }
  }
}
</script>

<template>
  <div class="event-type-chart">
    <h3>Event Types</h3>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.event-type-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

h3 {
  margin: 0 0 16px;
  font-size: 1.1rem;
  font-weight: 600;
}

.chart-container {
  flex: 1;
  min-height: 200px;
}
</style>
