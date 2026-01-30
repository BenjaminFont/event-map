# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start development server
npm run build    # Type-check with vue-tsc then build with Vite
npm run preview  # Preview production build locally

firebase deploy --only hosting              # Deploy frontend only
firebase deploy --only firestore:rules      # Deploy Firestore rules only
firebase deploy                             # Deploy everything
```

## Architecture

Vue 3 + TypeScript application for visualizing events on an interactive map of Germany.

### State Flow
- **Pinia store** (`src/stores/eventStore.ts`) is the central state manager
- **Composables** handle Firebase operations and are consumed by the store
- Components read from store and dispatch actions

### Key Layers

**Data Layer** (`src/composables/`):
- `useEvents.ts` - Firestore CRUD with dev mode mock support
- `useAuth.ts` - Firebase Auth with auto-login in dev mode
- `useImageUpload.ts` - Firebase Storage uploads

**Store** (`src/stores/eventStore.ts`):
- Holds all events, selected event, filters, form state
- Subscribes to Firestore real-time updates via `initializeSubscription()`

**Views**:
- Map view: `EventMap.vue` with Leaflet, markers grouped by location
- Dashboard view: Chart.js statistics in `components/dashboard/`
- Toggled via `FilterBar.vue`

### Dev Mode
Set `VITE_DEV_MODE=true` in `.env` to:
- Use mock data from `src/data/seedEvents.ts` instead of Firestore
- Auto-login without Firebase Auth
- No Firebase connection required

### Authentication
App requires login - unauthenticated users see only the login screen. Auth state managed in `useAuth.ts`, checked in `App.vue`.

### Event Types
Defined in `src/types/event.ts` with color mappings in `EVENT_TYPE_COLORS`. Add new types there.
