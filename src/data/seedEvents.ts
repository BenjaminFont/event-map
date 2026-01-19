import { Timestamp } from 'firebase/firestore'
import type { Event } from '../types/event'

// German city coordinates
const LOCATIONS: Record<string, { lat: number; lng: number }> = {
  'Solingen': { lat: 51.1652, lng: 7.0671 },
  'Stuttgart': { lat: 48.7758, lng: 9.1829 },
  'München': { lat: 48.1351, lng: 11.5820 },
  'Hamburg': { lat: 53.5511, lng: 9.9937 },
  'Köln': { lat: 50.9375, lng: 6.9603 },
  'Coburg': { lat: 50.2612, lng: 10.9627 },
  'Karlsruhe': { lat: 49.0069, lng: 8.4037 },
  'Leipzig': { lat: 51.3397, lng: 12.3731 },
  'Remote': { lat: 51.1657, lng: 10.4515 }, // Center of Germany
}

function getCoords(location: string): { lat: number; lng: number } {
  for (const [city, coords] of Object.entries(LOCATIONS)) {
    if (location.toLowerCase().includes(city.toLowerCase())) {
      return coords
    }
  }
  return { lat: 51.1657, lng: 10.4515 } // Center of Germany as fallback
}

// All events from "Liste Talks& OPT Themen.pdf"
export const seedEvents: Omit<Event, 'createdAt'>[] = [
  {
    id: '1',
    title: 'Warum MCP das TCP/IP der KI ist',
    date: '2025-05-13',
    location: { name: 'Solingen Office', ...getCoords('Solingen') },
    eventType: 'Video',
    eventName: 'Codecentric Video Day',
    reference: 'https://www.youtube.com/watch?v=jaM1jjlfdWo&t=3s',
    status: 'completed',
    hoursInvested: 8,
    audience: 'internal',
    company: 'Codecentric',
    images: []
  },
  {
    id: '2',
    title: 'Was TCP/IP für das Internet war, ist MCP für die LLM-Ökosysteme',
    date: '2025-05-20',
    location: { name: 'Stuttgart Office', ...getCoords('Stuttgart') },
    eventType: 'Meet Up',
    eventName: 'tech&talk Stuttgart: KI-Agenten in Interaktion',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  },
  {
    id: '3',
    title: 'Versteckt aber mächtig der Agent in deiner Bash - Claude Code',
    date: '2025-05-27',
    location: { name: 'Solingen Office', ...getCoords('Solingen') },
    eventType: 'Meet Up',
    eventName: 'tech&talk Meetup: Vibe Coding / AI-powered working',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  },
  {
    id: '4',
    title: 'Model Context Protocol: Wie kann MCP bei der Automatisierung im Arbeitsalltag helfen?',
    date: '2025-05-27',
    location: { name: 'Solingen Office', ...getCoords('Solingen') },
    eventType: 'Podcast',
    eventName: 'Model Context Protocol Podcast',
    reference: 'https://www.youtube.com/watch?v=qi-0W24sMHg&t=8s',
    status: 'completed',
    hoursInvested: 2,
    audience: 'external',
    images: []
  },
  {
    id: '5',
    title: 'AI-powered working: Claude Code',
    date: '2025-06-06',
    location: { name: 'Remote', ...getCoords('Remote') },
    eventType: 'Talk',
    eventName: 'AI-powered working',
    status: 'completed',
    hoursInvested: 2,
    audience: 'internal',
    company: 'Codecentric',
    images: []
  },
  {
    id: '6',
    title: 'Intelligente Unterstützung – gemeinsam entwickeln wir KI-Lösungen für uns und unsere Kunden',
    date: '2025-07-09',
    location: { name: 'Phantasialand Köln', ...getCoords('Köln') },
    eventType: 'Kunden Event',
    eventName: 'KI-Lösungen Workshop',
    status: 'completed',
    hoursInvested: 8,
    audience: 'external',
    images: []
  },
  {
    id: '7',
    title: 'AI Workshop HUK',
    date: '2025-08-06',
    endDate: '2025-08-07',
    location: { name: 'Coburg', ...getCoords('Coburg') },
    eventType: 'Workshop',
    eventName: 'AI Powered Working',
    status: 'completed',
    hoursInvested: 16,
    audience: 'external',
    company: 'HUK',
    images: []
  },
  {
    id: '8',
    title: 'WEBINAR - KI Agenten',
    date: '2025-09-04',
    location: { name: 'Remote', ...getCoords('Remote') },
    eventType: 'Webinar',
    eventName: 'KI Agenten',
    status: 'completed',
    hoursInvested: 2,
    audience: 'external',
    images: []
  },
  {
    id: '9',
    title: 'n8n Meet Up München',
    date: '2025-09-04',
    location: { name: 'München', ...getCoords('München') },
    eventType: 'Meet Up',
    eventName: 'n8n Meet Up',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  },
  {
    id: '10',
    title: 'diamant software KI Agenten Vorstellung',
    date: '2025-09-09',
    location: { name: 'Remote', ...getCoords('Remote') },
    eventType: 'Kunden Event',
    eventName: 'KI Agenten',
    status: 'completed',
    hoursInvested: 2,
    audience: 'external',
    company: 'Diamant Software',
    images: []
  },
  {
    id: '11',
    title: 'Wie n8n agentische Use Cases ermöglicht',
    date: '2025-09-25',
    location: { name: 'Solingen', ...getCoords('Solingen') },
    eventType: 'Talk',
    eventName: 'KI mit Verantwortung: Agentic AI für eine smarte und sichere Unternehmensführung',
    description: 'Business Acceleration Club',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  },
  {
    id: '12',
    title: 'AI Powered Working Sprint Intro',
    date: '2025-09-30',
    location: { name: 'Hamburg', ...getCoords('Hamburg') },
    eventType: 'Workshop',
    eventName: 'AI Sprint',
    status: 'completed',
    hoursInvested: 8,
    audience: 'external',
    images: []
  },
  {
    id: '13',
    title: 'AI Powered Working Sprint Review',
    date: '2025-10-21',
    location: { name: 'Hamburg', ...getCoords('Hamburg') },
    eventType: 'Workshop',
    eventName: 'AI Sprint',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  },
  {
    id: '14',
    title: 'Geschäftsprozesse intelligent automatisiert - wie n8n agentische Use Cases ermöglicht',
    date: '2025-10-23',
    location: { name: 'München', ...getCoords('München') },
    eventType: 'Talk',
    eventName: 'KI mit Verantwortung: Agentic AI für eine smarte und sichere Unternehmensführung',
    description: 'Business Acceleration Club',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  },
  {
    id: '15',
    title: 'Versteckt aber mächtig der Agent in deiner Bash - Claude Code',
    date: '2025-10-28',
    location: { name: 'Stuttgart', ...getCoords('Stuttgart') },
    eventType: 'Meet Up',
    eventName: 'tech&talk Stuttgart - AI-Assisted Coding',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  },
  {
    id: '16',
    title: 'Versteckt aber mächtig der Agent in deiner Bash - Claude Code',
    date: '2025-10-29',
    location: { name: 'Karlsruhe', ...getCoords('Karlsruhe') },
    eventType: 'Meet Up',
    eventName: 'tech&talk Karlsruhe - AI-Assisted Coding',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  },
  {
    id: '17',
    title: 'MCP',
    date: '2025-11-07',
    location: { name: 'Remote', ...getCoords('Remote') },
    eventType: 'Talk',
    eventName: 'AI-powered working: MCP',
    status: 'completed',
    hoursInvested: 2,
    audience: 'internal',
    company: 'Codecentric',
    images: []
  },
  {
    id: '18',
    title: 'HPE Ingram Gen AI Workshop',
    date: '2025-11-18',
    location: { name: 'Solingen', ...getCoords('Solingen') },
    eventType: 'Workshop',
    eventName: 'HPE Ingram Gen AI Workshop',
    status: 'completed',
    hoursInvested: 8,
    audience: 'external',
    company: 'HPE Ingram',
    images: []
  },
  {
    id: '19',
    title: 'Agentic AI in der Versicherung: Potenziale, Praxis und Erfolgsfaktoren für die Automatisierung der Zukunft',
    date: '2025-11-18',
    location: { name: 'Leipzig', ...getCoords('Leipzig') },
    eventType: 'Conference',
    eventName: 'Leipzig - Messekongress IT',
    status: 'completed',
    hoursInvested: 8,
    audience: 'external',
    images: []
  },
  {
    id: '20',
    title: 'Model Context Protocol: Der technische Standard für integrierte KI-Agenten',
    date: '2025-12-03',
    location: { name: 'Stuttgart', ...getCoords('Stuttgart') },
    eventType: 'Meet Up',
    eventName: 'Building AI Applications with MCP & n8n',
    description: 'Am Beispiel intelligenter Vertriebs-automatisierung mit c4 Gen AI Suite und n8n',
    status: 'completed',
    hoursInvested: 4,
    audience: 'external',
    images: []
  }
]

// Convert to full Event objects with Timestamp
export function getSeedEventsWithTimestamp(): Event[] {
  return seedEvents.map(event => ({
    ...event,
    createdAt: Timestamp.now()
  }))
}
