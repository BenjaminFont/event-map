---
paths:
  - "team-finder-frontend/src/**/*.vue"
  - "team-finder-frontend/src/**/*.ts"
  - "team-finder-frontend/src/**/*.js"
  - "team-finder-frontend/src/router/**"
  - "team-finder-frontend/src/stores/**"
---

# Frontend Code Patterns

These rules apply when writing or modifying any frontend code. Follow them from the start -- do not write code that violates these patterns.

## Components

### Always use `<script setup lang="ts">`
Every `.vue` file must use Composition API with TypeScript. No Options API, no missing `lang="ts"`.

```vue
<!-- CORRECT -->
<script setup lang="ts">

<!-- WRONG: missing lang="ts" -->
<script setup>

<!-- WRONG: Options API -->
<script>
export default { ... }
</script>
```

### Props and emits must be typed
Use TypeScript generics, not runtime validators.

```typescript
// CORRECT
const props = defineProps<{ player: Player; isEditing: boolean }>()
const emit = defineEmits<{ (e: 'update', player: Player): void }>()

// WRONG: runtime-only, no type safety
defineProps({ player: Object, isEditing: Boolean })
defineEmits(["update"])
```

### Keep components under 300 lines
If a component exceeds 300 lines, extract sub-components. Inline dialogs, modals, and forms should be their own components.

## TypeScript

### Never use `any`
Use the correct type, a union, `unknown`, or define an interface.

```typescript
// CORRECT
const calculateRating = (skills: Skill[]): number => { ... }
const data = ref<Player | null>(null)

// WRONG
const calculateRating = (skills: any[]) => { ... }
const data = ref({})
```

### All domain objects must have interfaces in `types.ts`
Do not define ad-hoc object shapes inline. Import from `types.ts`.

## State Management (Pinia)

### No lifecycle hooks in stores
`onMounted()`, `onUnmounted()` etc. do NOT work inside Pinia stores. They silently do nothing. Call fetch actions from components instead.

```typescript
// WRONG: dead code, never executes
export const usePlayerStore = defineStore("players", () => {
  onMounted(() => { fetchPlayers() })
})

// CORRECT: call from component
// in MyComponent.vue:
onMounted(() => { playerStore.fetchPlayers() })
```

### Always use `storeToRefs()` for reactive state
Destructuring store state directly loses reactivity.

```typescript
// CORRECT
const { players, isLoading } = storeToRefs(playerStore)

// WRONG: not reactive
const { players, isLoading } = playerStore
```

### Do not duplicate store state into local refs
Use the store state directly. Copying it into a component ref causes the component and store to drift out of sync.

```typescript
// WRONG: state duplication
const players = ref<Player[]>([])
onMounted(async () => { players.value = await playerStore.fetchPlayers() })

// CORRECT: use store directly
const { selectablePlayers } = storeToRefs(playerStore)
```

## API Layer

### Always use the configured axios instance
Never create a new `axios` instance or use raw `axios.post()`. The configured instance in `api.ts` has the base URL and auth headers. Bypassing it causes auth failures.

```typescript
// CORRECT: uses configured instance with auth
import api from '@/api'
const response = await api.post('/players/upload-image', formData)

// WRONG: raw axios, no auth headers
import axios from 'axios'
const response = await axios.post('/api/players/upload-image', formData)
```

### No `console.log` in API or production code
Remove all `console.log` statements. Use proper error handling instead.

## Router

### Router files must be TypeScript
Use `.ts` extension with `RouteRecordRaw` types.

### Use lazy loading for route components
```typescript
// CORRECT
const PlayerProfiles = () => import('@/components/PlayerProfilesOverview.vue')

// WRONG: eager import bloats initial bundle
import PlayerProfiles from '@/components/PlayerProfilesOverview.vue'
```

### Always include a 404 catch-all route
```typescript
{ path: '/:pathMatch(.*)*', component: () => import('@/views/NotFound.vue') }
```

## Styling (TailwindCSS)

### Use design tokens, not hardcoded hex values
```html
<!-- CORRECT: uses the project's CSS variable -->
<div class="bg-soccer-green">

<!-- WRONG: hardcoded hex -->
<div class="bg-[#004d3f]">
```

### Never use reactive style objects for static styling
Use Tailwind classes with conditional binding (`v-show`, `:class`).

```typescript
// WRONG
const overlayStyles = reactive({
  display: "none", position: "fixed", backgroundColor: "rgba(0,0,0,0.4)"
})

// CORRECT
<div v-show="isVisible" class="fixed inset-0 bg-black/40 z-50">
```

### One styling approach per project
Do not mix inline `style` attributes, scoped CSS, and Tailwind for the same kind of styling. Use Tailwind as the primary approach. Only use scoped CSS for things Tailwind cannot express (e.g., complex selectors, animations).

## Reactivity

### Use immutable array operations
Do not mutate reactive arrays with `.splice()` or `.push()`. Use `filter()`, `map()`, or spread.

```typescript
// CORRECT
players.value = players.value.filter(p => p.id !== id)

// WRONG: in-place mutation
players.value.splice(index, 1)
```

### Use `structuredClone()` for deep copies
```typescript
// CORRECT
const copy = structuredClone(player)

// WRONG: fragile, drops functions, fails on circular refs
const copy = JSON.parse(JSON.stringify(player))
```

### Use optional chaining on refs that can be null
```typescript
// CORRECT
const name = player.value?.name ?? 'Unknown'

// WRONG: will throw if player.value is null
const name = player.value.name
```

## Error Handling

### Every async operation needs a try-catch
Never leave a promise chain unhandled. Show a user-facing error message on failure.

### Distinguish error types
Do not show the same generic message for every failure. At minimum distinguish network errors from validation errors.