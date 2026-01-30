# Implementation Plan: Consolidate Dev Mode

**Spec:** `/specs/refactoring-consolidate-dev-mode.md`

## Implementation Steps

### Step 1: Create `src/composables/useDevMode.ts`

Create a new file that is the single source of truth for dev mode detection. It reads `import.meta.env.VITE_DEV_MODE` and exports a plain boolean constant `isDevMode`. This file has no dependencies on any other project file -- it only reads the Vite environment variable.

### Step 2: Update `src/firebase/config.ts`

- Remove the local `IS_DEV_MODE` constant (line 6) and the `export const isDevMode` re-export (line 23).
- Import `isDevMode` from `@/composables/useDevMode`.
- No other changes needed -- Firebase initialization is unconditional in this file (the comment on line 17 confirms Firebase is always initialized, even in dev mode).

**Dependency:** Step 1 must be complete.

### Step 3: Update `src/composables/useAuth.ts`

- Remove the local `IS_DEV_MODE` constant (line 10).
- Import `isDevMode` from `@/composables/useDevMode`.
- Replace all references to `IS_DEV_MODE` (lines 16, 37, 57) with `isDevMode`.
- Change the return object (line 75) from `isDevMode: IS_DEV_MODE` to just `isDevMode` (importing the value and re-exporting it through the composable return). Alternatively, remove `isDevMode` from the return entirely since no consumer uses it -- but keeping it avoids a breaking change to the composable API.

**Dependency:** Step 1 must be complete. Independent of Step 2.

### Step 4: Update `src/composables/useEvents.ts`

- Remove the local `IS_DEV_MODE` constant (line 18).
- Import `isDevMode` from `@/composables/useDevMode`.
- Replace all references to `IS_DEV_MODE` (lines 22, 33, 55, 72, 101, 131) with `isDevMode`.

**Dependency:** Step 1 must be complete. Independent of Steps 2-3.

### Step 5: Verify no remaining direct env var reads

Run a project-wide search for `VITE_DEV_MODE` in `.ts` and `.vue` files. The only remaining references should be:
- `src/composables/useDevMode.ts` (the single source of truth)
- `src/vite-env.d.ts` (TypeScript type declaration -- keep as-is)

Environment files (`.env`, `.env.example`, `.env.production`) are not code and are fine to leave as-is.

## Key Decision Points

**Where to put the new file:** The spec prescribes `src/composables/useDevMode.ts`. An alternative would be `src/utils/devMode.ts` since it is a plain constant, not a Vue composable. However, placing it in composables follows the spec and keeps it discoverable alongside `useAuth` and `useEvents` which are its primary consumers.

**Whether to remove `isDevMode` from `useAuth()` return value:** Currently no component destructures `isDevMode` from `useAuth()`, so removing it is safe. However, keeping it maintains the composable's existing API surface and costs nothing. The plan recommends keeping it but importing the value from `useDevMode` instead of re-deriving it.

**Whether to remove `isDevMode` export from `config.ts`:** Since no file imports it, removing it is safe and eliminates a redundant export. The plan recommends removing it to avoid having two exports of the same name from different modules.

## Testing Strategy

This is a pure refactor with no behavior changes. Testing is verification-based:

1. **Dev mode on** (`VITE_DEV_MODE=true`): Run `npm run dev`, confirm mock data loads on the map, auto-login works, CRUD operations work with in-memory data.
2. **Dev mode off** (`VITE_DEV_MODE=false` or unset): Run `npm run build` to confirm TypeScript compilation succeeds. If Firebase credentials are available, verify real auth and Firestore work.
3. **Static verification**: Grep for `VITE_DEV_MODE` in source files to confirm only `useDevMode.ts` and `vite-env.d.ts` reference it.

No unit tests exist in the project currently, so manual verification is appropriate.

## Risks and Unknowns

- **Circular import risk (low):** `useDevMode.ts` has zero imports from the project, so circular dependencies are not possible.
- **Module evaluation order (low):** All three consumers read `isDevMode` at module top level. Since `useDevMode.ts` only reads an env var (available immediately in Vite), import order is not a concern.
- **Missed references:** If any `.vue` single-file components reference `VITE_DEV_MODE` directly (not found in current grep), those would need updating too. The Step 5 verification catches this.
