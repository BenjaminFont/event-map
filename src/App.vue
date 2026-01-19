<script setup lang="ts">
import { ref } from 'vue'
import { useEventStore } from './stores/eventStore'
import EventMap from './components/EventMap.vue'
import EventDetail from './components/EventDetail.vue'
import EventForm from './components/EventForm.vue'
import FilterBar from './components/FilterBar.vue'
import Dashboard from './components/dashboard/Dashboard.vue'

const store = useEventStore()

type ViewType = 'map' | 'dashboard'
const currentView = ref<ViewType>('map')

function setView(view: ViewType) {
  currentView.value = view
  if (view === 'dashboard') {
    store.selectEvent(null)
  }
}
</script>

<template>
  <div class="app">
    <FilterBar :current-view="currentView" @change-view="setView" />

    <div v-if="currentView === 'map'" class="map-wrapper">
      <EventMap />
      <EventDetail />
    </div>

    <div v-else class="dashboard-wrapper">
      <Dashboard headline="Event Overview" />
    </div>

    <EventForm v-if="store.isFormOpen" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body,
#app {
  height: 100%;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
}

.app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  flex: 1;
  position: relative;
  margin-top: 60px;
}

.dashboard-wrapper {
  flex: 1;
  margin-top: 60px;
  overflow: hidden;
}

@media (max-width: 768px) {
  .map-wrapper,
  .dashboard-wrapper {
    margin-top: 110px;
  }
}
</style>
