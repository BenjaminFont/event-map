# Refactoring: Split EventForm.vue

## Overview

`EventForm.vue` is 657 lines and handles form state, image uploads, feedback management, and submission in a single file. This refactoring splits it into three components to improve readability, testability, and maintainability. No behavior changes — purely structural.

## Key Constraints & Design Decisions

- **No behavior changes.** The form must work identically before and after the refactoring.
- **Form state stays in the parent.** `EventForm.vue` remains the owner of the reactive form object and submission logic. Child components receive props and emit events — they do not own state.
- **Keep it to three components.** Don't over-decompose. The split targets the two clear sub-sections (images, feedback) that are self-contained.
- **Preserve scoped styles.** Each new component gets its own `<style scoped>` block with only the styles it needs. No shared CSS file.

### Component Breakdown

| Component | Responsibility |
|-----------|---------------|
| `EventForm.vue` | Form layout, field bindings, submission, open/close logic. Orchestrates children. |
| `EventFormImages.vue` | Image upload triggers, preview thumbnails, image removal. Receives current images as props, emits add/remove. |
| `EventFormFeedback.vue` | Add/remove feedback entries, display feedback list. Receives feedback array as prop, emits add/remove. |

## Usage

From the user's perspective, nothing changes. The form modal opens, fields are filled, images and feedback can be added, and the form submits. Internally:

```
EventForm.vue
  ├── <EventFormImages :images="form.images" @add="..." @remove="..." />
  └── <EventFormFeedback :feedback="form.feedback" @add="..." @remove="..." />
```

`EventForm.vue` passes the relevant slices of form state down and handles mutations via emitted events.

## Testing

1. **Create event with images and feedback** — verify all data persists correctly after submission
2. **Edit existing event** — verify images and feedback populate in the child components
3. **Remove an image** — verify it disappears from the preview and from the submitted data
4. **Add/remove feedback entries** — verify the list updates and submits correctly
5. **Close and reopen the form** — verify the form resets, including child component state
