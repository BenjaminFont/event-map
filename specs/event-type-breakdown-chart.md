# Event Type Breakdown Chart

## Overview

Add a horizontal bar chart to the dashboard that shows the count of events per individual event type (Talk, Meet Up, Workshop, etc.). This gives a granular view of event distribution, complementing the existing "What" doughnut chart which groups types into broad categories.

## Key Constraints & Design Decisions

- **Chart type**: Horizontal bar chart — works well for categorical data with labels of varying length.
- **Data source**: Count of events from `store.events`, grouped by the `eventType` field.
- **Event types**: Use all types from `EVENT_TYPES` in `src/types/event.ts` (Talk, Podcast, Workshop, Meet Up, Kunden Event, Conference, Webinar, Video, Other). Only show types that have at least 1 event.
- **Colors**: Use the existing `EVENT_TYPE_COLORS` mapping so colors are consistent across the app.
- **Placement**: New panel in the dashboard bottom row, added alongside the existing What/Who/Feedback panels.
- **Styling**: Follow the same card pattern as other dashboard panels (white card, 12px border-radius, box-shadow, `<h3>` heading).
- **Chart library**: Use `vue-chartjs` with Chart.js `Bar` component (already used by WhenChart).
- **Sort order**: Bars sorted by count descending so the most common type is at the top.

## Usage

The chart appears automatically in the dashboard view. Given the current seed data with 20 events:

- **Meet Up**: 6 bars
- **Talk**: 4 bars
- **Workshop**: 4 bars
- **Kunden Event**: 3 bars
- etc.

Each bar is colored according to `EVENT_TYPE_COLORS`. The type label is on the y-axis, count on the x-axis.

## Testing

**Success criteria**: The chart renders in the dashboard and accurately reflects event type counts.

**Key scenarios**:
1. All event types with at least 1 event appear as bars with correct counts
2. Event types with 0 events are omitted
3. Bar colors match `EVENT_TYPE_COLORS`
4. Chart updates when events are added/updated/deleted
5. Responsive — readable on smaller screens (stacks with other bottom-row panels)
