# Melty API deployment and Steam setup

## Required Steam credentials
1. Create/sign into a Steam account and enable Steam Guard.
2. Register for a Steam Web API key at https://steamcommunity.com/dev/apikey (Steam may require a domain).
3. Deploy this Node service to a public HTTPS host (Render, Railway, Fly.io, etc.). Set:
   - `BASE_URL`: the exact HTTPS service URL
   - `STEAM_API_KEY`: key from Steam's developer page
   - `SESSION_SECRET`: long random secret
   - `APP_ORIGIN`: `melty://` (or a hosted web origin)
4. Configure the Steam OpenID return URL in the service settings/domain as `BASE_URL/auth/steam/return`.
5. In the Expo app build environment set `EXPO_PUBLIC_API_URL` to the HTTPS API URL. Rebuild the APK.
6. Open Melty > Accounts > Steam > Connect. Sign into Steam in the browser, then return to the app.

## Verify endpoints
- `GET /health` should return `{"ok":true,...}`.
- After login, `GET /api/me` returns the Steam profile.
- `GET /api/steam/games` returns owned games. Steam profile/game details must be public for inventory visibility.

**Security:** Steam API key belongs only on the server. Use HTTPS. Configure a production session store (not Express MemoryStore) before public production use. OAuth browser return/deep-link session handoff still needs a mobile-safe token exchange for robust native app persistence; current Steam flow is browser-session based.
