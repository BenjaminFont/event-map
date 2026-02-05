import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Event, EventType } from '../types/event'
import { useEvents } from '../composables/useEvents'

export const useEventStore = defineStore('events', () => {
  const events = ref<Event[]>([])
  const selectedEvent = ref<Event | null>(null)
  const activeFilters = ref<EventType[]>([])
  const filterDateFrom = ref<string | null>(null)
  const filterDateTo = ref<string | null>(null)
  const isFormOpen = ref(false)
  const editingEvent = ref<Event | null>(null)
  const newMarkerPosition = ref<{ lat: number; lng: number } | null>(null)

  const { subscribeToEvents, createEvent, updateEvent, deleteEvent, loading, error } = useEvents()

  const filteredEvents = computed(() => {
    let result = events.value

    if (activeFilters.value.length > 0) {
      result = result.filter(e => activeFilters.value.includes(e.eventType))
    }

    const from = filterDateFrom.value
    const to = filterDateTo.value
    if (from || to) {
      result = result.filter(e => {
        const eventEnd = e.endDate || e.date
        if (from && eventEnd < from) return false
        if (to && e.date > to) return false
        return true
      })
    }

    return result
  })

  function initializeSubscription() {
    return subscribeToEvents(newEvents => {
      events.value = newEvents
    })
  }

  function selectEvent(event: Event | null) {
    selectedEvent.value = event
  }

  function openForm(event?: Event) {
    editingEvent.value = event || null
    isFormOpen.value = true
  }

  function closeForm() {
    isFormOpen.value = false
    editingEvent.value = null
    newMarkerPosition.value = null
  }

  function setNewMarkerPosition(lat: number, lng: number) {
    newMarkerPosition.value = { lat, lng }
    openForm()
  }

  function toggleFilter(type: EventType) {
    const idx = activeFilters.value.indexOf(type)
    if (idx >= 0) {
      activeFilters.value = activeFilters.value.filter(t => t !== type)
    } else {
      activeFilters.value = [...activeFilters.value, type]
    }
  }

  function clearFilters() {
    activeFilters.value = []
  }

  function setDateFilter(from: string | null, to: string | null) {
    filterDateFrom.value = from || null
    filterDateTo.value = to || null
  }

  function clearDateFilter() {
    filterDateFrom.value = null
    filterDateTo.value = null
  }

  return {
    events,
    selectedEvent,
    activeFilters,
    filterDateFrom,
    filterDateTo,
    isFormOpen,
    editingEvent,
    newMarkerPosition,
    filteredEvents,
    loading,
    error,
    initializeSubscription,
    selectEvent,
    openForm,
    closeForm,
    setNewMarkerPosition,
    toggleFilter,
    clearFilters,
    setDateFilter,
    clearDateFilter,
    createEvent,
    updateEvent,
    deleteEvent
  }
})
