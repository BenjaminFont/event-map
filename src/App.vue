<script setup lang="ts">
import { ref } from 'vue'
import { useEventStore } from './stores/eventStore'
import { useAuth } from './composables/useAuth'
import EventMap from './components/EventMap.vue'
import EventDetail from './components/EventDetail.vue'
import EventForm from './components/EventForm.vue'
import FilterBar from './components/FilterBar.vue'
import Dashboard from './components/dashboard/Dashboard.vue'
import LoginForm from './components/LoginForm.vue'

const store = useEventStore()
const { isAuthenticated, isAdmin, loading } = useAuth()

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
  <!-- Loading state -->
  <div v-if="loading" class="loading-screen">
    <div class="spinner"></div>
    <p>Loading...</p>
  </div>

  <!-- Login required -->
  <div v-else-if="!isAuthenticated" class="login-screen">
    <div class="login-container">
      <h1>Event Map</h1>
      <p>Please login to access the application</p>
      <LoginForm @close="() => {}" />
    </div>
  </div>

  <!-- Main app (authenticated) -->
  <div v-else class="app">
    <FilterBar :current-view="currentView" @change-view="setView" />

    <div v-if="currentView === 'map'" class="map-wrapper">
      <EventMap />
      <EventDetail />
    </div>

    <div v-else class="dashboard-wrapper">
      <Dashboard headline="Event Overview" />
    </div>

    <EventForm v-if="store.isFormOpen && isAdmin" />
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

.loading-screen {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f3f4f6;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e5e7eb;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-screen {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e3a5f 0%, #3b82f6 100%);
}

.login-container {
  text-align: center;
  color: white;
}

.login-container h1 {
  font-size: 2.5rem;
  margin-bottom: 8px;
}

.login-container > p {
  margin-bottom: 24px;
  opacity: 0.9;
}

.login-container :deep(.login-overlay) {
  position: static;
  background: none;
}

.login-container :deep(.login-form) {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.login-container :deep(.close-btn) {
  display: none;
}

.app {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.map-wrapper {
  flex: 1;
  position: relative;
}

.dashboard-wrapper {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}
</style>
