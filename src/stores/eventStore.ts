import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Event, EventType } from '../types/event'
import { useEvents } from '../composables/useEvents'

export const useEventStore = defineStore('events', () => {
  const events = ref<Event[]>([])
  const selectedEvent = ref<Event | null>(null)
  const filterType = ref<EventType | 'All'>('All')
  const isFormOpen = ref(false)
  const editingEvent = ref<Event | null>(null)
  const newMarkerPosition = ref<{ lat: number; lng: number } | null>(null)

  const { subscribeToEvents, createEvent, updateEvent, deleteEvent, loading, error } = useEvents()

  const filteredEvents = computed(() => {
    if (filterType.value === 'All') return events.value
    return events.value.filter(e => e.eventType === filterType.value)
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

  function setFilterType(type: EventType | 'All') {
    filterType.value = type
  }

  return {
    events,
    selectedEvent,
    filterType,
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
    setFilterType,
    createEvent,
    updateEvent,
    deleteEvent
  }
})
