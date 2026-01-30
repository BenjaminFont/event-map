import L from 'leaflet'
import { EVENT_TYPE_COLORS, type EventType, type Event } from '../types/event'

const PIN_PATH = 'M12 0C7.58 0 4 3.58 4 8c0 5.25 8 13 8 13s8-7.75 8-13c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z'

function buildPinSvgUrl(color: string): string {
  return `data:image/svg+xml,${encodeURIComponent(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
          <path fill="${color}" d="${PIN_PATH}"/>
        </svg>
      `)}`
}

export function createSingleMarkerIcon(eventType: string): L.Icon {
  const color = EVENT_TYPE_COLORS[eventType as keyof typeof EVENT_TYPE_COLORS] || '#6B7280'
  return L.icon({
    iconUrl: buildPinSvgUrl(color),
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  })
}

export function createClusterIcon(count: number, events: Event[]): L.DivIcon {
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

  // Cluster icon with count
  return L.divIcon({
    html: `
      <div class="cluster-marker" style="background-color: ${color}">
        <span class="cluster-count">${count}</span>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
          <path fill="white" d="${PIN_PATH}"/>
        </svg>
      </div>
    `,
    className: 'cluster-icon',
    iconSize: [44, 44],
    iconAnchor: [22, 44],
    popupAnchor: [0, -44]
  })
}
