# Read-Only User Role

## Overview

Currently the app has a binary auth model: logged out (no access) or logged in (full access). This feature introduces a **role system** with two roles — `admin` and `readonly` — so that some users can view the full app (map, event details, dashboard) without being able to create, edit, or delete events. Roles are stored in a Firestore `users` collection and checked client-side and in Firestore security rules.

## Key Constraints & Design Decisions

1. **Firestore `users` collection** stores user profiles with a `role` field (`"admin"` | `"readonly"`). A document is created per user with the Firebase Auth UID as the document ID.
2. **Default role is `readonly`** — if a user logs in but has no profile document (or no role field), they are treated as read-only. Only explicitly assigned admins can write.
3. **Login still required** — all users (admin and read-only) must authenticate before seeing any content. The login screen remains the gate.
4. **Read-only users see everything** — map, event details, dashboard, all data. They just cannot create, edit, or delete events.
5. **Firestore rules enforce write permissions** — the `events` collection write rules must check the user's role from the `users` collection (or use a helper function). Read remains open to any authenticated user.
6. **Dev mode** must support both roles — the mock auth should allow toggling or choosing a role for local testing.
7. **No admin UI for managing users yet** — roles are assigned manually via Firebase Console. A user management UI can be a separate future feature.

## Usage

### Read-only user experience
A read-only user logs in and sees the full map with all event markers, can click markers to view event details, can use the dashboard, and can use filters. The "+ Add Event" button, edit/delete buttons on event details, and map click-to-create are all hidden. Clicking the map does nothing.

### Admin user experience
Identical to the current experience — full CRUD access to events.

### Assigning roles
An admin opens the Firebase Console, navigates to the `users` collection, and creates/edits a document with `{ role: "admin" }` using the user's Auth UID as the document ID. Any user without an explicit `"admin"` role is read-only.

## Testing

### Success Criteria
- Read-only users can view all events, details, and dashboard
- Read-only users cannot see create/edit/delete UI elements
- Read-only users cannot write to Firestore even if they bypass the UI (security rules)
- Admin users retain full current functionality
- Users without a `users` document default to read-only
- Dev mode supports testing both roles

### Key Test Scenarios
1. Log in as read-only user → verify no "+ Add Event" button, no edit/delete on event details, map clicks do nothing
2. Log in as admin user → verify full CRUD works as before
3. Attempt a direct Firestore write as a read-only user → verify it is rejected by security rules
4. Log in as a user with no `users` document → verify they default to read-only
5. Switch dev mode role toggle → verify UI updates accordingly
