# Read-Only User Role — Implementation Plan

## Implementation Steps

### Step 1: Add User Role Type

**File to modify:** `src/types/event.ts`

Add a `UserRole` type (`"admin" | "readonly"`) and a `UserProfile` interface with `uid` and `role` fields. This keeps all domain types co-located. No new file needed.

### Step 2: Extend `useAuth.ts` to Fetch and Expose the User's Role

**File to modify:** `src/composables/useAuth.ts`

After Firebase Auth resolves the user, fetch the corresponding document from the Firestore `users` collection (`doc(db, 'users', user.uid)`). Store the role in a reactive ref. Expose two new computed properties:

- `userRole` — the raw role value (`"admin" | "readonly"`)
- `isAdmin` — convenience boolean (`true` only when role is `"admin"`)

**Key behaviors:**
- If the `users/{uid}` document doesn't exist or has no `role` field, default to `"readonly"`.
- The role fetch should happen inside the `onAuthStateChanged` callback, after we have a user. Set a brief loading state while the role is being fetched so the UI doesn't flash.
- On sign-out, reset the role to `null`.

**Dev mode:** Add a reactive `devRole` ref (default `"admin"` to preserve current dev behavior). Expose a `setDevRole(role)` function so the dev mode toggle can switch roles. Wire the `isAdmin` computed to use `devRole` when in dev mode.

### Step 3: Update Firestore Security Rules

**File to modify:** `firestore.rules`

Add a helper function `isAdmin()` that reads `get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == "admin"`.

Update the `events` collection rules:
- `read`: keep as `request.auth != null` (or `true` if you want to keep the current open read — but since login is required in the app anyway, either works).
- `create, update, delete`: change from `request.auth != null` to `request.auth != null && isAdmin()`.

Add rules for the new `users` collection:
- `read`: allow authenticated users to read their own document (`request.auth.uid == userId`).
- `write`: deny all client writes (roles are managed via Firebase Console only).

### Step 4: Update Components — Replace `isAuthenticated` with `isAdmin` for Write Actions

Three components use `isAuthenticated` to gate write-related UI. Change these to use `isAdmin` from `useAuth()`.

**`src/components/FilterBar.vue`:**
- Import `isAdmin` alongside `isAuthenticated` from `useAuth()`.
- The `+ Add Event` button (line 107): show only when `isAdmin`.
- The user email + logout section: still show for all authenticated users.
- The "Admin Login" button in the else branch: this never renders for logged-in users — no change needed.

**`src/components/EventDetail.vue`:**
- Import `isAdmin` from `useAuth()`.
- The `.detail-actions` div with Edit/Delete buttons (line 91): change `v-if="isAuthenticated"` to `v-if="isAdmin"`.

**`src/components/EventMap.vue`:**
- Import `isAdmin` from `useAuth()`.
- `handleMapClick` (line 53): change `isAuthenticated.value` to `isAdmin.value`.

**`src/App.vue`:**
- The `EventForm` rendering (line 55) is gated by `store.isFormOpen`, which can only become true via `store.openForm()`. Since we're removing all the buttons that call `openForm()` for non-admins, this is already safe. No change strictly needed, but for defense-in-depth, add `v-if="store.isFormOpen && isAdmin"`.

### Step 5: Add Dev Mode Role Toggle UI

**File to modify:** `src/components/FilterBar.vue`

When in dev mode (`isDevMode` from `useAuth()`), show a small toggle/dropdown near the user email that lets you switch between "Admin" and "Read-only" roles. This calls `setDevRole()` from `useAuth()`. Keep it minimal — a `<select>` element or two small buttons is enough.

### Step 6: Create a Seed User Document for Dev Mode (Optional)

**File to modify:** `src/data/seedEvents.ts` (or `useAuth.ts` directly)

Not strictly necessary since dev mode mocks the role locally. But if any code path ever tries to read the Firestore `users` document in dev mode, the mock should handle it. The existing dev mode pattern in `useAuth.ts` (setting `currentUser` to a mock) already bypasses Firestore, so the role mock from Step 2 should be sufficient.

## Key Decision Points

### Why Firestore `users` collection instead of Custom Claims?
Custom Claims require a Cloud Function or Firebase Admin SDK to set. The project currently has no Cloud Functions infrastructure. A Firestore document is simpler — you just create a document in the Firebase Console. The tradeoff is that Firestore rules need an extra `get()` call to check the role (which counts as a read), but at this scale that's negligible.

### Why default to `readonly` instead of `admin`?
Principle of least privilege. If someone creates a Firebase Auth user but forgets to create the `users` document, they should get the safer default. Admins are explicitly opted in.

### Why not add a `users` management UI?
The spec explicitly defers this. Roles are rare operations (you're adding a handful of users), so Firebase Console is sufficient for now.

## Testing Strategy

**Manual integration testing** is the most practical approach given the project has no test infrastructure:

1. **After Step 2:** Verify `isAdmin` reactivity in dev mode — toggle the role and confirm the computed value changes.
2. **After Step 4:** Run the app in dev mode, toggle to read-only, and verify:
   - "+ Add Event" button disappears
   - Edit/Delete buttons on event detail disappear
   - Clicking the map does not create a marker
   - Dashboard and map viewing still work
3. **After Step 3:** Deploy Firestore rules and test with a real read-only user:
   - Verify they can read events
   - Verify a direct Firestore write (e.g., via the Firebase Console's "Rules Playground" or a script) is rejected
4. **After Step 5:** Verify the dev mode toggle UI works and switches the experience in real time.

**Hints:** Unit testing `useAuth.ts` (the `isAdmin` computed, default role behavior) would be a good candidate if the project adds a testing framework later. Property-based testing is not particularly applicable here.

## Risks and Unknowns

1. **Firestore `get()` in security rules:** The `isAdmin()` helper requires a document read for every write operation. At current scale this is fine, but worth noting for future reference.
2. **Race condition on role fetch:** There's a brief window after `onAuthStateChanged` fires but before the `users` document is fetched where `userRole` is unknown. The loading state from Step 2 should handle this, but verify the UI doesn't flash write UI briefly.
3. **Existing users:** Current Firebase Auth users won't have `users` documents. They'll default to read-only until you manually create documents with `role: "admin"` for them. Make sure to do this before deploying, or current admins will lose write access.
