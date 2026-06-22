# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Cursor Cloud specific instructions

This is a single Expo SDK 56 / React Native 0.85 app (no monorepo, no separate backend in-repo). Data persistence is **cloud Firebase Firestore** (project `thisaihris`, config hardcoded in `constants/firebase.ts`); no local emulator. Outbound internet to `firestore.googleapis.com` is required for the app to load/seed/save data. Firestore auto-seeds mock data on first load.

- **Run (web, best for headless cloud testing):** `npm run dev:web` — serves Expo web on `http://localhost:8081`. The first request triggers a Metro bundle that can take ~15-30s; the server logs `Web Bundled ...` when ready. It is a long-running process — run it in tmux/background.
- `npm run dev` / `npm run dev:cloud` additionally try to open a public localtunnel (`*.loca.lt`); not needed for local in-VM testing — prefer `dev:web`.
- **Demo logins** (from README): employee `john.doe@company.com` / `password123`; admin `hr.admin@company.com` / `admin123`. Login uses the Firestore `users` collection (not Firebase Auth).
- **Type check:** `npx tsc --noEmit`. There is a known pre-existing error in `components/ui/Button.tsx` (`hovered` not in `PressableStateCallbackType`); Metro does not type-check so it does not block running the app.
- No automated test runner is configured (`playwright` is installed but there is no `test` script).
- `npm install` runs a `postinstall` that applies `patch-package` (native gradle patch) and `scripts/patch-expo-cors.sh` (whitelists tunnel/cloud hosts in the Expo CLI CORS middleware); both are idempotent.
- WiFi punch-in verification is unavailable on web — use the standard Punch In button; on web a browser location prompt may appear (allow it).
- Native Android `npm run build:apk` needs Java 21 + Android SDK (API 36) + NDK and is not set up here; use web for development/testing.
