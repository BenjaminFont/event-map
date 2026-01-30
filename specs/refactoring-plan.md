# Refactoring Plan

Overall refactoring plan for the Event Map application, based on a codebase analysis performed January 2026.

## Priority 1: High Impact

### 1. Split `EventForm.vue`

**Problem:** At 657 lines, `EventForm.vue` is the largest file in the project and violates the single responsibility principle — mixing form logic, image handling, feedback management, and submission.

**Action:**
- Extract `EventFormImages.vue` — image upload/preview section
- Extract `EventFormFeedback.vue` — feedback add/remove/display
- Keep `EventForm.vue` as the orchestrator with form state and submission

**Spec:** [refactoring-split-event-form.md](refactoring-split-event-form.md)

### 2. Consolidate dev mode into `useDevMode.ts`

**Problem:** Dev mode detection is scattered across `useAuth.ts`, `useEvents.ts`, and `firebase/config.ts`, each independently checking `import.meta.env.VITE_DEV_MODE`. No single source of truth.

**Action:**
- Create a `useDevMode.ts` composable as the canonical source of truth
- All other composables import from it instead of checking env vars directly

**Spec:** [refactoring-consolidate-dev-mode.md](refactoring-consolidate-dev-mode.md)

### 3. Extract map icon factory

**Problem:** `EventMap.vue` contains inline SVG generation and base64 encoding for both cluster icons and single marker icons (lines 62–120). This logic is untestable and clutters the component.

**Action:**
- Move icon generation to a `utils/mapIcons.ts` module
- Export `createClusterIcon()` and `createSingleMarkerIcon()` functions
- `EventMap.vue` imports and calls them

**Spec:** [refactoring-extract-map-icons.md](refactoring-extract-map-icons.md)

---

## Priority 2: Code Duplication & Consistency

### 4. Extract `<ChartLegend />` component

`WhatChart.vue` and `WhoChart.vue` have nearly identical legend rendering with percentage calculation. Extract into a single shared component.

### 5. Standardize error handling

- `useEvents.ts` and `useAuth.ts` throw after setting an error ref; `useImageUpload.ts` only sets the ref
- Forms use `alert()` for user-facing errors instead of a proper UI component
- Pick one pattern, apply consistently, and replace `alert()` with a toast/notification

### 6. Fix `useImageUpload.ts` `deleteImage`

Currently passes a full Firebase Storage URL as a storage path — this will fail at runtime. Needs to extract the path from the URL before calling `deleteObject()`.

---

## Priority 3: Cleanup & Polish

### 7. Remove unused `vue-router` dependency

Listed in `package.json` but never imported. App uses a simple view toggle. Removing it saves ~50kb from the bundle.

### 8. Fix FilterBar date state sync

Local `dateFrom`/`dateTo` refs can drift from store state if the store updates externally. Replace with `computed` getters from the store or `storeToRefs`.

### 9. Add CSS custom properties

Color values are hardcoded across components. Extract to `:root` CSS variables for consistency and future theming.

### 10. Responsive dashboard grid

`Dashboard.vue` hard-codes `grid-template-columns: repeat(4, 1fr)`. Add media queries or use CSS `auto-fit`/`auto-fill` for mobile support.
