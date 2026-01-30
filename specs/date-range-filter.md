# Date Range Filter

## Overview

Add a date range picker to the FilterBar that lets users filter displayed events by their start date (`date` field). Users select a start and end date, and only events falling within that range appear on the map. This helps users focus on events in a specific time window (e.g., "show me all events in Q3 2025").

## Key Constraints & Design Decisions

- **Filter field:** Uses the event's `date` field (string, `YYYY-MM-DD` format). For multi-day events with an `endDate`, an event should be included if its date range overlaps with the selected filter range.
- **Client-side filtering:** Filter is applied in the Pinia store's `filteredEvents` computed property alongside the existing `eventType` filter. Both filters are AND-combined — selecting "Talk" + a date range shows only talks within that range.
- **Dashboard behavior:** Currently the dashboard uses `store.events` (unfiltered). The date range filter should also apply to the dashboard so users can analyze statistics for a specific period.
- **Default state:** No date range selected means all events are shown (no time restriction). A clear/reset button removes the date filter.
- **UI placement:** The date range picker sits in the FilterBar next to the existing event type buttons. Use native HTML `<input type="date">` elements for simplicity (no external date picker library).
- **Store shape:** Add `filterDateFrom: string | null` and `filterDateTo: string | null` to the store state, with a `setDateFilter(from, to)` action and a `clearDateFilter()` action.

## Usage

1. User opens the app and sees all events on the map (no date filter active).
2. User sets a "From" date of `2025-07-01` and a "To" date of `2025-09-30`.
3. Map updates to show only events with dates in that range.
4. Combined with event type filter: if "Workshop" is also selected, only workshops in Jul–Sep 2025 appear.
5. User clicks "Clear" on the date filter to remove the time restriction and see all events again.
6. Switching to dashboard view shows statistics computed only from the date-filtered events.

## Testing

### Success Criteria
- Date range picker is visible in the FilterBar
- Selecting a date range reactively filters the map markers
- Combining date range with event type filter works correctly (AND logic)
- Clearing the date filter restores all events
- Dashboard statistics reflect the active date filter
- Multi-day events (with `endDate`) are included if they overlap the filter range

### Key Test Scenarios
1. Set a range that includes some events — only those events appear
2. Set a range that includes no events — map is empty, dashboard shows zeros
3. Set only a "From" date (no "To") — shows all events from that date onward
4. Set only a "To" date (no "From") — shows all events up to that date
5. Combine date range + event type filter — both filters apply
