<script setup lang="ts">
import { computed } from 'vue'
import type { Event } from '../../types/event'
import { STATUS_COLORS } from '../../types/event'

const props = defineProps<{
  events: Event[]
}>()

// Germany map boundaries for positioning
const mapBounds = {
  minLat: 47.27,
  maxLat: 55.06,
  minLng: 5.87,
  maxLng: 15.04
}

const mapWidth = 200
const mapHeight = 250

function latLngToXY(lat: number, lng: number) {
  const x = ((lng - mapBounds.minLng) / (mapBounds.maxLng - mapBounds.minLng)) * mapWidth
  const y = ((mapBounds.maxLat - lat) / (mapBounds.maxLat - mapBounds.minLat)) * mapHeight
  return { x, y }
}

const markers = computed(() => {
  return props.events.map(event => ({
    ...latLngToXY(event.location.lat, event.location.lng),
    status: event.status,
    color: STATUS_COLORS[event.status]
  }))
})
</script>

<template>
  <div class="where-map">
    <div class="map-header">
      <h3>Where</h3>
      <button class="expand-btn" title="View full map">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
        </svg>
      </button>
    </div>
    <div class="map-container">
      <svg :width="mapWidth" :height="mapHeight" viewBox="0 0 200 250" class="germany-outline">
        <!-- Simplified Germany outline -->
        <path
          d="M100 10 L130 20 L150 40 L160 70 L170 100 L180 130 L175 160 L160 180 L140 200 L120 220 L100 230 L80 220 L60 200 L40 180 L30 160 L25 130 L30 100 L40 70 L60 40 L80 20 Z"
          fill="#F3F4F6"
          stroke="#E5E7EB"
          stroke-width="2"
        />
        <!-- Event markers -->
        <g v-for="(marker, idx) in markers" :key="idx">
          <circle
            v-if="marker.status === 'completed'"
            :cx="marker.x"
            :cy="marker.y"
            r="6"
            :fill="marker.color"
          />
          <circle
            v-else
            :cx="marker.x"
            :cy="marker.y"
            r="5"
            fill="white"
            :stroke="marker.color"
            stroke-width="2"
          />
        </g>
      </svg>
    </div>
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
</template>

<style scoped>
.where-map {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  height: 100%;
}

.map-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.map-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.expand-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: #6B7280;
  border-radius: 4px;
}

.expand-btn:hover {
  background: #F3F4F6;
  color: #374151;
}

.map-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.germany-outline {
  max-width: 100%;
  height: auto;
}

.legend {
  display: flex;
  justify-content: center;
  gap: 16px;
  margin-top: 12px;
  font-size: 0.8rem;
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
  background: white;
  border: 2px solid #9CA3AF;
}
</style>
