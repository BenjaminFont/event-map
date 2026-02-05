import { Timestamp } from 'firebase/firestore'

export interface EventLocation {
  name: string
  lat: number
  lng: number
}

export interface Feedback {
  text: string
  author: string
  company?: string
}

export interface Event {
  id: string
  title: string
  date: string
  endDate?: string
  location: EventLocation
  eventType: EventType
  eventName: string
  description?: string
  reference?: string
  images: string[]
  createdAt: Timestamp
  // New fields for stats
  status: EventStatus
  hoursInvested?: number
  company?: string
  audience: AudienceType
  feedback?: Feedback[]
}

export type EventStatus = 'completed' | 'planned'

export type AudienceType = 'internal' | 'external'

export type EventType =
  | 'Talk'
  | 'Podcast'
  | 'Workshop'
  | 'Meet Up'
  | 'Kunden Event'
  | 'Conference'
  | 'Webinar'
  | 'Video'
  | 'Other'

export const EVENT_STATUSES: EventStatus[] = ['completed', 'planned']

export const AUDIENCE_TYPES: AudienceType[] = ['internal', 'external']

export const EVENT_TYPES: EventType[] = [
  'Talk',
  'Podcast',
  'Workshop',
  'Meet Up',
  'Kunden Event',
  'Conference',
  'Webinar',
  'Video',
  'Other'
]

export const EVENT_TYPE_COLORS: Record<EventType, string> = {
  'Talk': '#10B981',           // green (primary in design)
  'Podcast': '#8B5CF6',        // purple
  'Workshop': '#A78BFA',       // light purple
  'Meet Up': '#3B82F6',        // blue
  'Kunden Event': '#10B981',   // green
  'Conference': '#F59E0B',     // amber
  'Webinar': '#06B6D4',        // cyan
  'Video': '#EC4899',          // pink
  'Other': '#6B7280'           // gray
}

export const STATUS_COLORS: Record<EventStatus, string> = {
  'completed': '#10B981',  // green
  'planned': '#9CA3AF'     // gray
}

export type UserRole = 'admin' | 'readonly'

export interface UserProfile {
  uid: string
  role: UserRole
}
