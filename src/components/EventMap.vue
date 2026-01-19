<script setup lang="ts">
import { onMounted, onUnmounted, computed } from 'vue'
import { LMap, LTileLayer, LMarker, LPopup } from '@vue-leaflet/vue-leaflet'
import L from 'leaflet'
import type { LeafletMouseEvent } from 'leaflet'
import { useEventStore } from '../stores/eventStore'
import { useAuth } from '../composables/useAuth'
import { EVENT_TYPE_COLORS, type EventType } from '../types/event'
import type { Event } from '../types/event'
import 'leaflet/dist/leaflet.css'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'
import 'leaflet.markercluster'

const store = useEventStore()
const { isAuthenticated } = useAuth()

const germanCenter: [number, number] = [51.1657, 10.4515]
const defaultZoom = 6

let unsubscribe: (() => void) | null = null

// Group events by location (rounded to 2 decimal places to handle slight variations)
const groupedEvents = computed(() => {
  const groups = new Map<string, Event[]>()

  store.filteredEvents.forEach(event => {
    const key = `${event.location.lat.toFixed(2)},${event.location.lng.toFixed(2)}`
    if (!groups.has(key)) {
      groups.set(key, [])
    }
    groups.get(key)!.push(event)
  })

  return Array.from(groups.entries()).map(([key, events]) => ({
    key,
    events,
    lat: events[0]!.location.lat,
    lng: events[0]!.location.lng,
    locationName: events[0]!.location.name
  }))
})

onMounted(() => {
  unsubscribe = store.initializeSubscription()
})

onUnmounted(() => {
  if (unsubscribe) unsubscribe()
})

function handleMapClick(e: LeafletMouseEvent) {
  if (isAuthenticated.value) {
    store.setNewMarkerPosition(e.latlng.lat, e.latlng.lng)
  }
}

function handleMarkerClick(event: Event) {
  store.selectEvent(event)
}

function getClusterIcon(count: number, events: Event[]): L.Icon | L.DivIcon {
  // Get the most common event type color for the cluster
  const typeCounts = new Map<EventType, number>()
  events.forEach(e => {
    typeCounts.set(e.eventType, (typeCounts.get(e.eventType) || 0) + 1)
  })
  let maxType: EventType = events[0]?.eventType || 'Other'
  let maxCount = 0
  typeCounts.forEach((c, t) => {
    if (c > maxCount) {
      maxCount = c
      maxType = t
    }
  })
  const color = EVENT_TYPE_COLORS[maxType] || '#6B7280'

  if (count === 1) {
    return L.icon({
      iconUrl: `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path fill="${color}" d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      `)}`,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    })
  }

  // Cluster icon with count
  return L.divIcon({
    html: `
      <div class="cluster-marker" style="background-color: ${color}">
        <span class="cluster-count">${count}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="white" d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
        </svg>
      </div>
    `,
    className: 'cluster-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44]
  })
}

function getSingleMarkerIcon(eventType: string) {
  const color = EVENT_TYPE_COLORS[eventType as keyof typeof EVENT_TYPE_COLORS] || '#6B7280'
  return L.icon({
    iconUrl: `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
        <path fill="${color}" d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z"/>
      </svg>
    `)}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}
</script>

<template>
  <div class="map-container">
    <LMap
      ref="mapRef"
      :zoom="defaultZoom"
      :center="germanCenter"
      :use-global-leaflet="false"
      @click="handleMapClick"
    >
      <LTileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        layer-type="base"
        name="OpenStreetMap"
      />

      <!-- Grouped markers -->
      <LMarker
        v-for="group in groupedEvents"
        :key="group.key"
        :lat-lng="[group.lat, group.lng]"
        :icon="getClusterIcon(group.events.length, group.events) as any"
      >
        <LPopup :options="{ maxWidth: 300, maxHeight: 400 }">
          <div class="popup-content">
            <div class="popup-header">
              <strong>{{ group.locationName }}</strong>
              <span class="event-count">{{ group.events.length }} Event{{ group.events.length > 1 ? 's' : '' }}</span>
            </div>
            <div class="popup-events">
              <div
                v-for="event in group.events"
                :key="event.id"
                class="popup-event"
                @click="handleMarkerClick(event)"
              >
                <span class="event-type-dot" :style="{ backgroundColor: EVENT_TYPE_COLORS[event.eventType] || '#6B7280' }"></span>
                <div class="event-info">
                  <span class="event-title">{{ event.title }}</span>
                  <span class="event-date">{{ event.date }}</span>
                </div>
              </div>
            </div>
          </div>
        </LPopup>
      </LMarker>

      <!-- New marker position -->
      <LMarker
        v-if="store.newMarkerPosition"
        :lat-lng="[store.newMarkerPosition.lat, store.newMarkerPosition.lng]"
        :icon="getSingleMarkerIcon('Other')"
      />
    </LMap>
  </div>
</template>

<style>
/* Global styles for cluster markers */
.cluster-icon {
  background: transparent !important;
  border: none !important;
}

.cluster-marker {
  width: 44px;
  height: 44px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  position: relative;
}

.cluster-marker svg {
  transform: rotate(45deg);
  opacity: 0.9;
}

.cluster-count {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #1F2937;
  color: white;
  font-size: 12px;
  font-weight: 700;
  min-width: 22px;
  height: 22px;
  border-radius: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(45deg);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  padding: 0 6px;
}
</style>

<style scoped>
.map-container {
  width: 100%;
  height: 100%;
}

.popup-content {
  min-width: 200px;
  max-width: 280px;
}

.popup-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
  margin-bottom: 8px;
}

.popup-header strong {
  font-size: 0.95rem;
}

.event-count {
  font-size: 0.75rem;
  background: #E5E7EB;
  padding: 2px 8px;
  border-radius: 10px;
  color: #4B5563;
}

.popup-events {
  max-height: 250px;
  overflow-y: auto;
}

.popup-event {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px;
  margin: 4px 0;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s;
}

.popup-event:hover {
  background: #F3F4F6;
}

.event-type-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-top: 4px;
  flex-shrink: 0;
}

.event-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.event-title {
  font-size: 0.85rem;
  font-weight: 500;
  line-height: 1.3;
  word-wrap: break-word;
}

.event-date {
  font-size: 0.75rem;
  color: #6B7280;
}
</style>
