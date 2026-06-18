# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v56.0.0/ before writing any code.

## Cursor Cloud specific instructions

This repo is **thisAI / WorkPulse**, an Expo SDK 56 / React Native employee attendance & HR app. There is **no backend or database** — all data is mock data (`data/`) persisted on-device via AsyncStorage. End-to-end testing only requires the Expo dev server plus a client (the web target is the lightest).

- **Run (web, for headless/agent testing):** `npm run web` (runs `expo start --web` on port 8081). The first Metro bundle takes ~15–30s before `http://localhost:8081/` returns the app; be patient on the first request.
- **Run (general dev):** `npm start` (`expo start --port 8081 --host lan`) for device/emulator. `npm run dev` runs `scripts/start-dev.sh`, which additionally launches a public `localtunnel` — only needed for external device access, not for local web testing.
- **Demo logins** (from `constants/config.ts`): employee `john.doe@company.com` / `password123`; admin `hr.admin@company.com` / `admin123`.
- **Typecheck:** `npx tsc --noEmit`. There is one pre-existing error in `components/ui/Button.tsx` about the `hovered` Pressable prop (a react-native-web-only prop) — it does not block running the app.
- **Tests/lint:** No automated test suite or ESLint config exists. `playwright` is installed as a devDependency but no Playwright tests are committed.
- `npm install` auto-runs `postinstall` (`patch-package` applies `patches/`, then `scripts/patch-expo-cors.sh` patches the Expo dev-server CORS middleware to allow tunnel hosts). This is required for the dev server to accept tunnel/proxy origins.
- Attendance punch-in verifies the office WiFi SSID (`THISAI`) and location; on web these native checks are stubbed/limited, so prefer the Leave request flow (or salary/chat) as the core action when testing on web.
