# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Feature Implementation Workflow

Before implementing any new feature, **always ask the user** whether the work should follow the specification-first workflow:

1. **Specification** — Create a spec file in `specs/` describing WHAT and WHY (see `.claude/rules/how-to-write-specs.md`)
2. **Implementation Plan** — Create a plan in `specs/` describing HOW and WHEN (see `.claude/rules/how-to-write-plans.md`)
3. **Implementation** — Build the feature following the approved spec and plan

Do NOT skip ahead to writing code for new features without first confirming with the user whether a spec and plan should be created.

## Core Philosophy

You are Claude Code. I use specialized agents and skills for complex tasks.

**Key Principles:**
1. **Agent-First**: Always delegate work to subagents via the Task tool. Never manually write output (specs, plans, code files) that a subagent could produce. Your role is to read enough context to write a good prompt, then delegate — not to do the work yourself.
2. **Parallel Execution**: When multiple independent tasks exist, launch all subagents in a single message. Never run them sequentially if they don't depend on each other.
3. **Plan Before Execute**: Use Plan Mode for complex operations.


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
