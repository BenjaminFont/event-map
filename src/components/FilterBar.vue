<script setup lang="ts">
import { useEventStore } from '../stores/eventStore'
import { useAuth } from '../composables/useAuth'
import { EVENT_TYPES, EVENT_TYPE_COLORS, type EventType } from '../types/event'
import { ref } from 'vue'
import LoginForm from './LoginForm.vue'

type ViewType = 'map' | 'dashboard'

const props = defineProps<{
  currentView: ViewType
}>()

const emit = defineEmits<{
  (e: 'change-view', view: ViewType): void
}>()

const store = useEventStore()
const { isAuthenticated, signOut, currentUser } = useAuth()

const showLogin = ref(false)

function setFilter(type: EventType | 'All') {
  store.setFilterType(type)
}

function getTypeColor(type: EventType): string {
  return EVENT_TYPE_COLORS[type]
}

function handleLogout() {
  signOut()
}
</script>

<template>
  <div class="filter-bar">
    <div class="left-section">
      <div class="view-toggle">
        <button
          class="toggle-btn"
          :class="{ active: currentView === 'map' }"
          @click="emit('change-view', 'map')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M1 6v16l7-4 8 4 7-4V2l-7 4-8-4-7 4z"/>
            <path d="M8 2v16"/>
            <path d="M16 6v16"/>
          </svg>
          Map
        </button>
        <button
          class="toggle-btn"
          :class="{ active: currentView === 'dashboard' }"
          @click="emit('change-view', 'dashboard')"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="3" width="7" height="7"/>
            <rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/>
            <rect x="3" y="14" width="7" height="7"/>
          </svg>
          Stats
        </button>
      </div>

      <div v-if="currentView === 'map'" class="filters">
        <button
          class="filter-btn"
          :class="{ active: store.filterType === 'All' }"
          @click="setFilter('All')"
        >
          All
        </button>
        <button
          v-for="type in EVENT_TYPES"
          :key="type"
          class="filter-btn"
          :class="{ active: store.filterType === type }"
          :style="store.filterType === type ? { backgroundColor: getTypeColor(type), color: 'white' } : {}"
          @click="setFilter(type)"
        >
          <span class="color-dot" :style="{ backgroundColor: getTypeColor(type) }"></span>
          {{ type }}
        </button>
      </div>
    </div>

    <div class="actions">
      <template v-if="isAuthenticated">
        <button class="btn btn-add" @click="store.openForm()">
          + Add Event
        </button>
        <span class="user-email">{{ currentUser?.email }}</span>
        <button class="btn btn-logout" @click="handleLogout">Logout</button>
      </template>
      <button v-else class="btn btn-login" @click="showLogin = true">
        Admin Login
      </button>
    </div>

    <LoginForm v-if="showLogin" @close="showLogin = false" />
  </div>
</template>

<style scoped>
.filter-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  z-index: 1000;
}

.left-section {
  display: flex;
  align-items: center;
  gap: 16px;
  overflow-x: auto;
}

.view-toggle {
  display: flex;
  background: #F3F4F6;
  border-radius: 8px;
  padding: 4px;
}

.toggle-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  color: #6B7280;
  transition: all 0.2s;
}

.toggle-btn:hover {
  color: #374151;
}

.toggle-btn.active {
  background: white;
  color: #111827;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.toggle-btn svg {
  flex-shrink: 0;
}

.filters {
  display: flex;
  gap: 8px;
  padding: 4px 0;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
  transition: all 0.2s;
}

.filter-btn:hover {
  border-color: #999;
}

.filter-btn.active {
  border-color: transparent;
  background: #3B82F6;
  color: white;
}

.color-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

.filter-btn.active .color-dot {
  display: none;
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  transition: background-color 0.2s;
}

.btn-add {
  background: #10B981;
  color: white;
}

.btn-add:hover {
  background: #059669;
}

.btn-login {
  background: #3B82F6;
  color: white;
}

.btn-login:hover {
  background: #2563EB;
}

.btn-logout {
  background: #f3f4f6;
  color: #374151;
}

.btn-logout:hover {
  background: #e5e7eb;
}

.user-email {
  font-size: 0.85rem;
  color: #666;
}

@media (max-width: 768px) {
  .filter-bar {
    flex-direction: column;
    height: auto;
    padding: 10px;
    gap: 10px;
  }

  .left-section {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
  }

  .filters {
    width: 100%;
    overflow-x: auto;
  }

  .actions {
    width: 100%;
    justify-content: flex-end;
  }

  .user-email {
    display: none;
  }
}
</style>
