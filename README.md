# Melty Mobile

A mobile-first unified game library built with Expo React Native, plus an optional Steam account API.

## Run the app
```sh
npm install
npx expo start
```

## Build an Android APK
Push to `main` or open **Actions → Android APK build → Run workflow**. The workflow prebuilds the native Android project and uploads `melty-mobile-debug-apk`. Download the artifact ZIP, extract `app-debug.apk`, and install it on Android. This is a debug APK, not a Play Store-signed release.

## Steam integration (real, server-side)
The `server/` folder contains Steam OpenID sign-in and the Steam owned-games API route:
- `GET /auth/steam` starts Steam login.
- `GET /api/me` returns the authenticated Steam profile.
- `GET /api/steam/games` fetches the owned library (Steam privacy settings can hide it).
- `POST /api/logout` ends the session.

Deploy the API and set `BASE_URL`, `STEAM_API_KEY`, and a strong `SESSION_SECRET` from `.env.example`. Never put the Steam API key in the mobile app. Set Expo's `EXPO_PUBLIC_API_URL` to the API URL at build time to enable the Connect button.

## Microsoft/Xbox and Epic
The UI identifies these providers, but full inventory import is not implemented. OAuth sign-in alone does not grant owned-game data: Xbox/Microsoft inventory APIs and Epic library access require approved scopes/API access and may not be available to third-party apps. No fake connected state is shown.

## Current limitations
- Steam login and library endpoint are implemented in the API, but require deployment/configuration and a browser session.
- The app currently does not sync Steam's returned games into its local collection automatically.
- Debug APK only; production signing and store release are separate.
