<script setup lang="ts">
import { computed } from 'vue'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import type { Event } from '../../types/event'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const props = defineProps<{
  events: Event[]
}>()

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const chartData = computed(() => {
  const completedByMonth = new Array(12).fill(0)
  const plannedByMonth = new Array(12).fill(0)

  props.events.forEach(event => {
    const date = new Date(event.date)
    const month = date.getMonth()
    if (event.status === 'completed') {
      completedByMonth[month]++
    } else {
      plannedByMonth[month]++
    }
  })

  // Reorder to start from current month - 6
  const currentMonth = new Date().getMonth()
  const startMonth = (currentMonth - 5 + 12) % 12
  const reorderedMonths = []
  const reorderedCompleted = []
  const reorderedPlanned = []

  for (let i = 0; i < 12; i++) {
    const idx = (startMonth + i) % 12
    reorderedMonths.push(months[idx])
    reorderedCompleted.push(completedByMonth[idx])
    reorderedPlanned.push(plannedByMonth[idx])
  }

  return {
    labels: reorderedMonths,
    datasets: [
      {
        label: 'Completed',
        data: reorderedCompleted,
        backgroundColor: '#10B981',
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.7
      },
      {
        label: 'Planned',
        data: reorderedPlanned,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        barPercentage: 0.6,
        categoryPercentage: 0.7
      }
    ]
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
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      ticks: {
        color: '#6B7280'
      }
    },
    y: {
      display: false,
      grid: {
        display: false
      }
    }
  }
}
</script>

<template>
  <div class="when-chart">
    <div class="chart-header">
      <h3>When</h3>
      <div class="legend">
        <span class="legend-item">
          <span class="dot completed"></span>
          Completed
        </span>
        <span class="legend-item">
          <span class="dot planned"></span>
          Planned
        </span>
      </div>
    </div>
    <div class="chart-container">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<style scoped>
.when-chart {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.legend {
  display: flex;
  gap: 16px;
  font-size: 0.85rem;
  color: #6B7280;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.dot.completed {
  background: #10B981;
}

.dot.planned {
  background: #E5E7EB;
}

.chart-container {
  flex: 1;
  min-height: 200px;
}
</style>
