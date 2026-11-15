# Melty PC game runtime integration

## Target

Melty should ultimately be a native Android launcher/runtime that can authenticate with supported stores, download games the signed-in user owns, install them into a managed prefix, and launch Windows executables locally through a compatibility stack.

## Engine decision

The current Expo app is a catalog UI. It cannot run Windows executables or perform SteamPipe downloads. This requires a native Android application and an x86-64 compatibility stack, not a React Native screen or a Steam Web API key.

GameNative is the closest public reference implementation for the desired workflow: Steam/Epic/GOG/Amazon library, install, and launch on Android. Its application is GPL-3.0. Winlator provides the Windows runtime pieces (Wine, Box86/Box64, graphics translation, container management). GameNative's own build documentation says runtime image assets are separately distributed; these must be sourced and licensed properly rather than silently copied into Melty.

References:
- https://github.com/utkarshdalal/GameNative
- https://github.com/brunodev85/winlator
- https://github.com/FEX-Emu/FEX

## Required engineering stages

1. Replace Expo-only Android shell with native Kotlin Android project while retaining Melty branding and UI.
2. Integrate a GPL-compatible store client/depot downloader and implement account auth using secure browser callbacks and encrypted token storage.
3. Integrate a legally distributable Wine/Box64/FEX runtime, graphics translation, root filesystem, and container lifecycle.
4. Connect game install manifests/depot downloads to the runtime's game prefix; support install progress, cancellation, disk space, and verification.
5. Launch games in a native surface with touch mapping, controller input, audio, suspend/resume, and per-game configuration.
6. Build on CI and test on a real ARM64 Vulkan Android device. PC game compatibility is per-game and cannot be promised universally.

## Non-goals / safety

- Never download game files from unofficial mirrors or bypass ownership checks/DRM.
- Never embed Steam API secrets in the APK.
- Steam's GetOwnedGames endpoint is metadata only; it is not a game downloader.
- Anti-cheat, launchers, DRM, and x86-only dependencies can prevent individual games from running.
- Keep upstream license notices and publish corresponding source for GPL components.
