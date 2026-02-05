<script setup lang="ts">
import { computed } from 'vue'
import { useEventStore } from '../stores/eventStore'
import { useAuth } from '../composables/useAuth'
import { EVENT_TYPE_COLORS } from '../types/event'

const store = useEventStore()
const { isAdmin } = useAuth()

const event = computed(() => store.selectedEvent)

const typeColor = computed(() => {
  if (!event.value) return '#6B7280'
  return EVENT_TYPE_COLORS[event.value.eventType as keyof typeof EVENT_TYPE_COLORS] || '#6B7280'
})

function close() {
  store.selectEvent(null)
}

function edit() {
  if (event.value) {
    store.openForm(event.value)
    store.selectEvent(null)
  }
}

async function handleDelete() {
  if (event.value && confirm('Are you sure you want to delete this event?')) {
    await store.deleteEvent(event.value.id)
    store.selectEvent(null)
  }
}

function openImage(url: string) {
  window.open(url, '_blank')
}
</script>

<template>
  <div v-if="event" class="event-detail">
    <div class="detail-header">
      <h2>{{ event.title }}</h2>
      <button class="close-btn" @click="close">&times;</button>
    </div>

    <div class="event-type" :style="{ backgroundColor: typeColor }">
      {{ event.eventType }}
    </div>

    <div class="detail-content">
      <div class="detail-row">
        <span class="label">Event:</span>
        <span>{{ event.eventName }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Date:</span>
        <span>{{ event.date }}{{ event.endDate ? ` - ${event.endDate}` : '' }}</span>
      </div>

      <div class="detail-row">
        <span class="label">Location:</span>
        <span>{{ event.location.name }}</span>
      </div>

      <div v-if="event.description" class="detail-row description">
        <span class="label">Description:</span>
        <p>{{ event.description }}</p>
      </div>

      <div v-if="event.reference" class="detail-row">
        <span class="label">Reference:</span>
        <a :href="event.reference" target="_blank" rel="noopener">{{ event.reference }}</a>
      </div>

      <div v-if="event.images && event.images.length > 0" class="image-gallery">
        <span class="label">Images:</span>
        <div class="images">
          <img
            v-for="(img, idx) in event.images"
            :key="idx"
            :src="img"
            :alt="`Event image ${idx + 1}`"
            @click="openImage(img)"
          />
        </div>
      </div>
    </div>

    <div v-if="isAdmin" class="detail-actions">
      <button class="btn btn-edit" @click="edit">Edit</button>
      <button class="btn btn-delete" @click="handleDelete">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.event-detail {
  position: absolute;
  top: 0;
  right: 0;
  width: 400px;
  height: 100%;
  background: white;
  box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid #eee;
}

.detail-header h2 {
  margin: 0;
  font-size: 1.25rem;
  flex: 1;
  padding-right: 10px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;
  padding: 0;
  line-height: 1;
}

.close-btn:hover {
  color: #333;
}

.event-type {
  display: inline-block;
  margin: 15px 20px;
  padding: 4px 12px;
  border-radius: 20px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.detail-content {
  padding: 0 20px 20px;
  flex: 1;
}

.detail-row {
  margin-bottom: 12px;
}

.label {
  display: block;
  font-weight: 600;
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.detail-row a {
  color: #3B82F6;
  word-break: break-all;
}

.description p {
  margin: 0;
  white-space: pre-wrap;
}

.image-gallery {
  margin-top: 20px;
}

.images {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  margin-top: 8px;
}

.images img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  transition: transform 0.2s;
}

.images img:hover {
  transform: scale(1.02);
}

.detail-actions {
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
}

.btn {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}

.btn-edit {
  background: #3B82F6;
  color: white;
}

.btn-edit:hover {
  background: #2563EB;
}

.btn-delete {
  background: #EF4444;
  color: white;
}

.btn-delete:hover {
  background: #DC2626;
}

@media (max-width: 768px) {
  .event-detail {
    width: 100%;
  }

  .detail-header {
    padding: 16px;
    position: sticky;
    top: 0;
    background: white;
    z-index: 1;
  }

  .close-btn {
    font-size: 28px;
    padding: 4px 8px;
  }
}
</style>
