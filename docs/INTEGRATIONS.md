# Provider integrations

## Steam
Use Steam OpenID 2.0 on a backend. Validate the assertion against Steam, resolve SteamID, then call Steam Web API owned-games endpoints using a server-held API key. Users may hide games via privacy settings. Never trust a client-supplied SteamID.

## Microsoft / Xbox
Register an Entra app and implement OAuth authorization-code + PKCE. Xbox ownership APIs are not universally available; access depends on approved APIs/scopes and eligibility. Do not promise complete PC/Game Pass ownership imports without an approved endpoint.

## Epic Games
Register an Epic developer application and use supported OAuth scopes. Owned-library access may be restricted/unavailable; login alone does not expose inventory.

## Security
- HTTPS callbacks; validate state, nonce, and redirect URI
- Keep client secrets/API keys server-side
- Encrypt refresh tokens; support disconnect/revoke and deletion
- Never ask for provider passwords or scrape private libraries
- Do not display connected until provider flow succeeds
