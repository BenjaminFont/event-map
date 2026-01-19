<script setup lang="ts">
import { computed } from 'vue'
import { Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import type { Event } from '../../types/event'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps<{
  events: Event[]
}>()

// Group event types into categories for the "What" chart
const categoryMapping: Record<string, string> = {
  'Talk': 'Talks',
  'Conference': 'Talks',
  'Meet Up': 'Talks',
  'Kunden Event': 'Talks',
  'Workshop': 'Workshops',
  'Webinar': 'Workshops',
  'Podcast': 'Podcasts / Videos',
  'Video': 'Podcasts / Videos',
  'Other': 'Other'
}

const chartData = computed(() => {
  const counts: Record<string, number> = {
    'Talks': 0,
    'Workshops': 0,
    'Podcasts / Videos': 0
  }

  props.events.forEach(event => {
    const category = categoryMapping[event.eventType] || 'Other'
    if (category in counts && counts[category] !== undefined) {
      counts[category] = counts[category] + 1
    }
  })

  const total = Object.values(counts).reduce((a, b) => a + b, 0)
  const labels = Object.keys(counts)
  const data = Object.values(counts)
  const percentages = data.map(v => total > 0 ? Math.round((v / total) * 100) : 0)

  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: ['#10B981', '#A78BFA', '#93C5FD'],
        borderWidth: 0,
        cutout: '70%'
      }
    ],
    percentages
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
  const colors = ['#10B981', '#A78BFA', '#93C5FD']
  return chartData.value.labels.map((label, idx) => ({
    label,
    color: colors[idx],
    percentage: chartData.value.percentages[idx]
  }))
})
</script>

<template>
  <div class="what-chart">
    <h3>What</h3>
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
.what-chart {
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
