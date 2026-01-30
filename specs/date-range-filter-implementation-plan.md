# Date Range Filter — Implementation Plan

## Implementation Steps

### Step 1: Extend the Pinia Store with Date Filter State

**File:** `src/stores/eventStore.ts`

Add two new reactive refs for the date filter bounds (`filterDateFrom` and `filterDateTo`, both `string | null`). Add `setDateFilter(from, to)` and `clearDateFilter()` actions. Update the `filteredEvents` computed to apply both the existing eventType filter AND the new date range filter using AND logic.

The date comparison uses simple string comparison (`>=`, `<=`) since `date` is stored in `YYYY-MM-DD` format, which is lexicographically orderable. For multi-day events with `endDate`, include the event if its `[date, endDate]` range overlaps the filter `[from, to]` range — meaning the event's start date is before or on the filter end, and the event's end date (or start date if no endDate) is on or after the filter start.

**Depends on:** Nothing — this is the foundation.

### Step 2: Update FilterBar UI with Date Inputs

**File:** `src/components/FilterBar.vue`

Add a date range section to the FilterBar template, placed after the existing event type filter buttons. Use two native `<input type="date">` elements for "From" and "To", plus a clear button that calls `store.clearDateFilter()`. Bind the inputs to local refs that sync with the store via watchers or direct `@change` handlers calling `store.setDateFilter(from, to)`.

The date filter section should be visible in both map and dashboard views (unlike the event type buttons which are map-only). Style the inputs to match the existing FilterBar aesthetic (pill-shaped, similar padding/font to `.filter-btn`).

**Depends on:** Step 1 (store must expose the new state and actions).

### Step 3: Update Dashboard to Use Filtered Events

**File:** `src/components/dashboard/Dashboard.vue`

Replace all occurrences of `store.events` with `store.filteredEvents` so the dashboard respects both the event type filter and the new date range filter. This affects:
- The `completedEvents` computed
- The `plannedEvents` computed
- The `totalHours` computed
- The `uniqueCompanies` computed
- The `allFeedback` computed
- All chart component props (`:events="store.events"` → `:events="store.filteredEvents"`)

**Depends on:** Step 1 (store `filteredEvents` must incorporate date filtering).

### Step 4: Make Event Type Filter Visible on Dashboard View

**File:** `src/components/FilterBar.vue`

Currently the event type filter buttons are wrapped in `v-if="currentView === 'map'"`. Since the dashboard now respects filters, remove this condition (or change it) so filters are visible and usable on both views.

**Depends on:** Step 3 (dashboard must use `filteredEvents` for this to make sense).

## Key Decision Points

- **String comparison for dates:** Since `date` is stored as `YYYY-MM-DD` strings, lexicographic comparison works correctly and avoids unnecessary `Date` object parsing. This is simpler and sufficient.
- **Overlap logic for multi-day events:** An event overlaps the filter range when `event.date <= filterTo` AND `(event.endDate || event.date) >= filterFrom`. This is the standard interval overlap check.
- **Dashboard uses filteredEvents:** The spec explicitly requires the dashboard to respect the date filter. This is a behavioral change — currently the dashboard shows all events. Switching to `filteredEvents` also means the dashboard will respect the event type filter, which is a sensible side-effect.
- **No external date picker library:** Native `<input type="date">` is sufficient and avoids adding dependencies. It works well across modern browsers.

## Testing Strategy

- **Incremental testing via dev mode:** Use `VITE_DEV_MODE=true` with the 20 seed events (spanning May–Dec 2025) to manually verify filtering behavior at each step.
- **Step 1 verification:** After modifying the store, temporarily log `filteredEvents` length in the browser console with different date ranges to confirm the filter logic works.
- **Step 2 verification:** After adding the UI, visually confirm the date inputs appear, interact with the store, and map markers update reactively.
- **Step 3 verification:** Switch to dashboard view with a date range active and confirm stats/charts reflect only filtered events.
- **Methodology hints:** Unit tests could cover the date overlap logic in isolation (pure function). Integration tests could verify end-to-end filtering with Playwright. However, the seed data provides a quick manual smoke test.

## Risks and Unknowns

- **FilterBar height:** Adding date inputs may cause the 60px fixed-height FilterBar to overflow, especially on mobile. The mobile responsive styles may need adjustment (the bar already switches to `flex-direction: column` and `height: auto` on small screens, so this should adapt, but worth verifying).
- **Event type filter on dashboard:** Making filters visible on the dashboard view is a UX change. If this feels wrong, the `v-if` can be kept for event type buttons while the date filter alone is shown on both views.
- **Empty state:** When filters result in zero events, the map shows no markers and the dashboard shows zeros/empty charts. This is acceptable but could benefit from a "no events match" message in a future iteration.
