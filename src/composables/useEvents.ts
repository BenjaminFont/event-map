import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  Timestamp
} from 'firebase/firestore'
import { db } from '../firebase/config'
import type { Event } from '../types/event'
import { ref } from 'vue'
import { getSeedEventsWithTimestamp } from '../data/seedEvents'
import { isDevMode } from './useDevMode'
const COLLECTION_NAME = 'events'

// Mock data for dev mode - loaded from seed data
const mockEvents = ref<Event[]>(isDevMode ? getSeedEventsWithTimestamp() : [])

let mockIdCounter = 100
// Store the subscription callback so dev mode mutations can notify the store
let devCallback: ((events: Event[]) => void) | null = null

export function useEvents() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function fetchEvents(): Promise<Event[]> {
    if (isDevMode) {
      return mockEvents.value
    }

    loading.value = true
    error.value = null
    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'))
      const snapshot = await getDocs(q)
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
    } catch (e) {
      error.value = (e as Error).message
      return []
    } finally {
      loading.value = false
    }
  }

  function subscribeToEvents(callback: (events: Event[]) => void) {
    if (isDevMode) {
      devCallback = callback
      callback(mockEvents.value)
      return () => { devCallback = null }
    }

    const q = query(collection(db, COLLECTION_NAME), orderBy('date', 'desc'))
    return onSnapshot(q, snapshot => {
      const events = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Event[]
      callback(events)
    })
  }

  async function createEvent(event: Omit<Event, 'id' | 'createdAt'>): Promise<string> {
    if (isDevMode) {
      const newId = String(++mockIdCounter)
      const newEvent: Event = {
        ...event,
        id: newId,
        createdAt: Timestamp.now()
      }
      mockEvents.value = [newEvent, ...mockEvents.value]
      devCallback?.(mockEvents.value)
      return newId
    }

    loading.value = true
    error.value = null
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), {
        ...event,
        createdAt: Timestamp.now()
      })
      return docRef.id
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function updateEvent(id: string, updates: Partial<Omit<Event, 'id' | 'createdAt'>>): Promise<void> {
    if (isDevMode) {
      const idx = mockEvents.value.findIndex(e => e.id === id)
      if (idx !== -1) {
        const existing = mockEvents.value[idx]!
        mockEvents.value[idx] = {
          ...existing,
          ...updates,
          id: existing.id,
          createdAt: existing.createdAt
        }
        mockEvents.value = [...mockEvents.value] // Trigger reactivity
        devCallback?.(mockEvents.value)
      }
      return
    }

    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      await updateDoc(docRef, updates)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  async function deleteEvent(id: string): Promise<void> {
    if (isDevMode) {
      mockEvents.value = mockEvents.value.filter(e => e.id !== id)
      devCallback?.(mockEvents.value)
      return
    }

    loading.value = true
    error.value = null
    try {
      const docRef = doc(db, COLLECTION_NAME, id)
      await deleteDoc(docRef)
    } catch (e) {
      error.value = (e as Error).message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    loading,
    error,
    fetchEvents,
    subscribeToEvents,
    createEvent,
    updateEvent,
    deleteEvent
  }
}
