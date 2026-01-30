# Implementation Plan: Split EventForm.vue

## Implementation Steps

### Step 1: Create EventFormImages.vue

**File:** `src/components/EventFormImages.vue`

Extract the images section (template lines 342-359, script lines 104-114, styles lines 497-558) into a new component.

**Props and emits design:**

- Props: `images` (string[]), `pendingFiles` (File[])
- Emits: `files-selected` (files: File[]), `remove-image` (index: number), `remove-pending-file` (index: number)

The component renders the `ImageUpload` child component, existing image thumbnails, and pending file list. It does not mutate any data -- it forwards all user actions as emits to the parent.

**Key detail:** `ImageUpload.vue` is already a child component. `EventFormImages` will import and render it, becoming a thin wrapper that also handles the preview/remove UI. The `files-selected` event from `ImageUpload` gets re-emitted up to `EventForm`.

**Styles to move:** `.existing-images`, `.pending-files`, `.image-preview`, `.image-preview img`, `.file-preview`, `.remove-btn`, `.file-preview .remove-btn`.

### Step 2: Create EventFormFeedback.vue

**File:** `src/components/EventFormFeedback.vue`

Extract the feedback section (template lines 361-390, script lines 42 and 116-129, styles lines 560-614).

**Props and emits design:**

- Props: `feedback` (Feedback[])
- Emits: `add` (entry: Feedback), `remove` (index: number)

**Key detail:** The `newFeedback` ref and add/validation logic moves entirely into this child component. This is UI-only state for the add form and has no reason to live in the parent. The parent's `resetForm()` currently clears `newFeedback`, but after extraction the child component's own lifecycle handles this -- `App.vue` uses `v-if="store.isFormOpen"` on `EventForm` (confirmed in `src/App.vue` line 55), so when the form closes the entire component tree unmounts and child state is naturally destroyed. No special reset mechanism is needed.

**Styles to move:** `.feedback-list`, `.feedback-item`, `.feedback-text`, `.feedback-author`, `.feedback-item .remove-btn`, `.remove-btn.small`, `.add-feedback`, `.feedback-inputs`, `.btn-add-feedback`, `.btn-add-feedback:hover`.

### Step 3: Update EventForm.vue

**File:** `src/components/EventForm.vue`

Wire the two new child components into the parent form.

- Import `EventFormImages` and `EventFormFeedback`
- Remove import of `ImageUpload` (now consumed by `EventFormImages`)
- Replace template lines 342-359 with `<EventFormImages>`, passing props and handling emits
- Replace template lines 361-390 with `<EventFormFeedback>`, passing props and handling emits
- Keep `pendingFiles` ref in the parent (needed during submission at lines 171-176)
- Remove `newFeedback` ref (moved to child)
- Remove `handleFilesSelected`, `removeExistingImage`, `removePendingFile` functions -- replace with inline emit handlers or streamlined named functions
- Remove `addFeedback`, `removeFeedback` functions -- replace with handlers that push/splice `form.value.feedback` directly
- Update `resetForm()`: remove `newFeedback` reset line, keep `pendingFiles` reset
- Remove extracted styles from the `<style scoped>` block
- Keep `.remove-btn` base styles only if still used directly in EventForm (it should not be after extraction)

**Depends on:** Steps 1 and 2 (the child components must exist before wiring them in).

### Step 4: Manual Smoke Test

Verify the five test scenarios from the spec:

1. Create event with images and feedback
2. Edit existing event -- images and feedback populate
3. Remove an image -- disappears from preview and submitted data
4. Add/remove feedback entries
5. Close and reopen the form -- resets correctly

## Key Decision Points

**`.remove-btn` styles are used by both images and feedback sections.** Rather than creating a shared CSS file (which the spec explicitly forbids), duplicate the `.remove-btn` base styles into both child components. Each component only includes the variants it actually uses (`.remove-btn.small` in feedback, `.file-preview .remove-btn` in images). This keeps styles scoped and self-contained per the spec constraint.

**`newFeedback` state ownership.** Moving `newFeedback` into `EventFormFeedback` is the clean approach since it is purely UI state for the add-feedback form. The parent does not need to know about partially-typed feedback entries. The child emits a complete `Feedback` object only when the user clicks "Add". This eliminates one ref and two functions from the parent.

**`pendingFiles` stays in the parent.** Even though it is closely related to images, the submission logic (lines 171-176) needs access to the raw `File[]` for uploading. The parent passes `pendingFiles` down as a prop for display and handles mutations via emits.

## Testing Strategy

This is a pure structural refactoring with no behavior changes, so testing is focused on regression:

- **Manual integration testing** is the primary approach -- walk through each of the five scenarios listed in the spec
- **Unit testing** is not high-value here since the components are thin UI wrappers, but if tests exist for `EventForm`, they should still pass after the refactoring
- If the project adds component tests later, the extracted components will be easier to test in isolation (one benefit of this refactoring)

## Risks and Unknowns

- **Scoped style leakage:** The parent `EventForm.vue` currently has generic `input`, `select`, `textarea` styles (lines 475-495) applied via `<style scoped>`. After extraction, child components that contain these elements will not inherit those scoped styles. `EventFormFeedback` contains `textarea` and `input` elements for the add-feedback form, and `EventFormImages` does not contain raw inputs (it delegates to `ImageUpload`). The generic input/textarea styles must be duplicated into `EventFormFeedback`'s scoped style block to maintain visual consistency. Duplication is the safer path to avoid unexpected side effects from non-scoped styles.
