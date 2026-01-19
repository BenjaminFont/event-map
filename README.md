# Event Map

An interactive map of Germany for visualizing talks and events with Firebase backend and Vue.js frontend.

## Tech Stack

- **Frontend**: Vue 3 + TypeScript + Vite
- **Map**: Leaflet.js with vue-leaflet
- **State Management**: Pinia
- **Backend**: Firebase (Firestore, Storage, Auth, Hosting)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure Firebase

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore, Storage, and Authentication (Email/Password)
3. Copy your Firebase config and update `.env`:

```env
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

### 3. Create an admin user

In Firebase Console > Authentication, add a user with email/password that will be used to log in and manage events.

### 4. Deploy Firebase rules

```bash
firebase deploy --only firestore:rules,storage:rules
```

## Development

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

```bash
firebase deploy
```

## Features

- Interactive map centered on Germany
- Color-coded markers by event type
- Event filtering by type
- Admin login to create/edit/delete events
- Image upload for events
- Responsive design

## Event Types

- Meet Up (blue)
- Podcast (purple)
- Kunden Event (green)
- Conference (amber)
- Workshop (red)
- Webinar (cyan)
- Other (gray)
