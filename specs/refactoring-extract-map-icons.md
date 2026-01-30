# Refactoring: Extract Map Icon Factory

## Overview

`EventMap.vue` contains inline SVG generation and base64 encoding for cluster icons and single marker icons (~60 lines of icon logic mixed into the component). This refactoring extracts that logic into a dedicated `utils/mapIcons.ts` module, making it testable and keeping the component focused on map behavior.

## Key Constraints & Design Decisions

- **Pure functions only.** The icon factory module exports pure functions that take data in and return Leaflet `DivIcon` or `Icon` instances. No Vue reactivity, no component state.
- **Preserve existing icons exactly.** The visual output must be pixel-identical. Copy the SVG markup and encoding logic as-is, then clean up.
- **Leaflet types.** Functions return proper Leaflet `L.DivIcon` / `L.Icon` types. Import Leaflet in the utility module.
- **No new dependencies.** The SVG-to-base64 approach stays — don't introduce an icon library.

### Exports

| Function | Input | Output |
|----------|-------|--------|
| `createClusterIcon(count, eventTypes)` | Cluster child count and event type distribution | `L.DivIcon` with colored pie/segment SVG |
| `createSingleMarkerIcon(eventType)` | Event type string | `L.Icon` with colored marker SVG |

### Files to Modify

| File | Change |
|------|--------|
| `src/utils/mapIcons.ts` | **New file.** Pure icon factory functions. |
| `src/components/EventMap.vue` | Remove inline icon logic, import from `utils/mapIcons.ts`. |

## Usage

```ts
// EventMap.vue
import { createClusterIcon, createSingleMarkerIcon } from '@/utils/mapIcons'

// In cluster icon creation callback
const icon = createClusterIcon(cluster.getChildCount(), childEventTypes)

// In marker setup
const icon = createSingleMarkerIcon(event.eventType)
```

## Testing

1. **Visual regression** — map markers and clusters must look identical before and after
2. **All event types** — verify each event type color renders correctly on single markers
3. **Cluster icons** — verify clusters with mixed event types display the correct color distribution
4. **Edge cases** — single-event clusters, empty event type, unknown event type fallback
