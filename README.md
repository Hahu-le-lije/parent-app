# Hahu Parent

Hahu Parent is the parent-facing mobile app for the Hahu learning platform. It helps parents sign in, manage child profiles, review learning progress, control enabled subjects, and handle subscriptions from one Expo/React Native app.

## Features

- Parent onboarding, sign in, sign up, password reset, and Google OAuth through Clerk.
- Protected app routing with Expo Router route groups for auth and main app screens.
- Child profile management with add, edit, delete, avatar, subscription, and generated child login details.
- Parent dashboard with child switching, mastery score, play time, correct answers, and AI recommendation preview.
- Subscription screens for listing plans, starting checkout, creating subscriptions, and assigning or renewing subscriptions for children.
- Subject controls for enabling and disabling learning activities per child.
- English and Amharic localization through the local `lib/i18n` modules.
- Zustand stores for children, language, progress, subjects, and subscriptions.

## Tech Stack

- Expo 54
- React 19 and React Native 0.81
- Expo Router 6
- TypeScript
- Clerk Expo SDK for authentication
- Zustand for app state
- Expo Secure Store for session token caching
- EAS configuration for native builds

## Project Structure

```text
app/                  Expo Router screens and layouts
app/(auth)/           Onboarding and authentication routes
app/(root)/           Authenticated app routes
app/(root)/(tabs)/    Home, subscriptions, children, and profile tabs
assets/               Images, icons, fonts, and app branding
components/           Shared UI components
constants/            App constants and static asset exports
lib/                  Auth helpers and localization
services/             API and mock service modules
store/                Zustand stores
types/                Shared TypeScript declarations
```

## Getting Started

### Prerequisites

- Node.js
- npm
- Expo CLI through `npx expo`
- Android Studio or Xcode if you want to run native builds locally

### Installation

```bash
npm install
```

Create a `.env` file in the project root and provide the public values used by the app:

```bash
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
EXPO_PUBLIC_API=https://your-api.example.com
```

### Run the App

Start the Expo development server:

```bash
npm start
```

Run on a specific platform:

```bash
npm run android
npm run ios
npm run web
```

## Scripts

- `npm start` starts the Expo dev server.
- `npm run android` builds and runs the Android app.
- `npm run ios` builds and runs the iOS app.
- `npm run web` starts the Expo web target.
- `npm run lint` runs Expo linting.
- `npm run reset-project` resets the starter project structure.

## Authentication

Authentication is configured in `app/_layout.tsx` with `ClerkProvider`. The app reads `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` from the environment and uses Clerk's token cache integration for Expo Secure Store.

The root route in `app/index.tsx` redirects signed-in users to the home tab and unauthenticated users to onboarding.

## API and Mock Data

Some services currently use mock in-memory data for local development:

- `services/childService.ts`
- `services/progressService.ts`
- `services/subjectService.ts`

Subscription flows use `EXPO_PUBLIC_API` and Clerk bearer tokens in `services/subscriptionService.ts`.

When connecting the remaining services to the backend, keep the response types aligned with `types/type.d.ts` and update the related Zustand stores in `store/`.

## Builds

The app is configured for EAS in `eas.json` and Expo app metadata lives in `app.json`. The Android package name is:

```text
com.izorium.Hahuparent
```

The app scheme is:

```text
hahuparent
```

## Notes for Contributors

- Use Expo Router file-based routes under `app/`.
- Keep shared UI in `components/` and app state in `store/`.
- Add localized copy in both `lib/i18n/en` and `lib/i18n/am` when adding user-facing text.
- Avoid committing real secrets. Only public Expo environment variables should be stored in `.env`, and production secrets should stay in the deployment environment.
