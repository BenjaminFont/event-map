# Refactoring: Consolidate Dev Mode

## Overview

Dev mode detection (`VITE_DEV_MODE`) is currently duplicated across `useAuth.ts`, `useEvents.ts`, and `firebase/config.ts`. Each file independently reads the environment variable. This refactoring creates a single `useDevMode.ts` composable as the canonical source of truth, and updates all consumers to import from it.

## Key Constraints & Design Decisions

- **Single source of truth.** Only `useDevMode.ts` reads `import.meta.env.VITE_DEV_MODE`. All other files import from it.
- **Simple API.** The composable exports a boolean constant (`isDevMode`) and optionally a reactive ref if runtime toggling is ever needed. Start with a plain constant — don't over-engineer.
- **No behavior changes.** Dev mode must work exactly as before: mock data, auto-login, no Firebase connection required.
- **Firebase config stays conditional.** `firebase/config.ts` currently only initializes Firebase when not in dev mode. This logic stays but uses the imported `isDevMode` instead of checking the env var directly.

### Files to Modify

| File | Change |
|------|--------|
| `src/composables/useDevMode.ts` | **New file.** Exports `isDevMode` constant. |
| `src/composables/useAuth.ts` | Replace `import.meta.env.VITE_DEV_MODE` check with `isDevMode` import. |
| `src/composables/useEvents.ts` | Replace `import.meta.env.VITE_DEV_MODE` check with `isDevMode` import. |
| `src/firebase/config.ts` | Replace `import.meta.env.VITE_DEV_MODE` check with `isDevMode` import. |

## Usage

```ts
// src/composables/useDevMode.ts
export const isDevMode = import.meta.env.VITE_DEV_MODE === 'true'
```

```ts
// In any consumer
import { isDevMode } from '@/composables/useDevMode'

if (isDevMode) {
  // mock behavior
}
```

## Testing

1. **Dev mode on** (`VITE_DEV_MODE=true`) — verify mock data loads, auto-login works, no Firebase calls made
2. **Dev mode off** (env var absent or `false`) — verify Firebase initializes, real auth required, Firestore connected
3. **Check all three consumer files** — confirm none still reference `import.meta.env.VITE_DEV_MODE` directly
