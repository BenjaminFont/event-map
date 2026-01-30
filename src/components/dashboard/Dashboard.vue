<script setup lang="ts">
import { computed } from 'vue'
import { useEventStore } from '../../stores/eventStore'
import StatsCard from './StatsCard.vue'
import WhenChart from './WhenChart.vue'
import WhatChart from './WhatChart.vue'
import WhoChart from './WhoChart.vue'
import EventTypeChart from './EventTypeChart.vue'
import FeedbackCarousel from './FeedbackCarousel.vue'
import type { Feedback } from '../../types/event'

defineProps<{
  headline?: string
}>()

const store = useEventStore()

const completedEvents = computed(() =>
  store.filteredEvents.filter(e => e.status === 'completed').length
)

const plannedEvents = computed(() =>
  store.filteredEvents.filter(e => e.status === 'planned').length
)

const totalHours = computed(() =>
  store.filteredEvents.reduce((sum, e) => sum + (e.hoursInvested || 0), 0)
)

const uniqueCompanies = computed(() => {
  const companies = new Set<string>()
  store.filteredEvents.forEach(e => {
    if (e.company) companies.add(e.company)
  })
  return companies.size
})

const allFeedback = computed<Feedback[]>(() => {
  const feedback: Feedback[] = []
  store.filteredEvents.forEach(e => {
    if (e.feedback) {
      feedback.push(...e.feedback)
    }
  })
  return feedback
})
</script>

<template>
  <div class="dashboard">
    <h1 class="headline">{{ headline || 'Dashboard' }}</h1>

    <div class="stats-row">
      <StatsCard :value="completedEvents" label="Events" highlighted />
      <StatsCard :value="plannedEvents" label="Events planned" />
      <StatsCard :value="totalHours" label="Hours invested" />
      <StatsCard :value="uniqueCompanies" label="Companies / Cooperations" />
    </div>

    <div class="charts-row">
      <div class="when-section">
        <WhenChart :events="store.filteredEvents" />
      </div>
    </div>

    <div class="bottom-row">
      <EventTypeChart :events="store.filteredEvents" />
      <WhatChart :events="store.filteredEvents" />
      <WhoChart :events="store.filteredEvents" />
      <FeedbackCarousel :feedback-items="allFeedback" />
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 30px;
  background: #F9FAFB;
  min-height: 100%;
  overflow-y: auto;
}

.headline {
  font-size: 1.75rem;
  font-weight: 700;
  margin: 0 0 24px;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.charts-row {
  margin-bottom: 24px;
}

.when-section {
  min-height: 300px;
}

.bottom-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 1200px) {
  .stats-row {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .bottom-row {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .dashboard {
    padding: 20px;
  }

  .stats-row {
    grid-template-columns: 1fr;
  }

  .bottom-row {
    grid-template-columns: 1fr;
  }
}
</style>
