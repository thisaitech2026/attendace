# Build Native Android APK

## Prerequisites (on your computer)

1. **Node.js** 18+
2. **Android Studio** with Android SDK
3. **Java JDK** 17+

## Step 1 — Start the backend server

The Android app loads the web UI from your server. Start it on your PC:

```bash
npm install
npm run db:setup
npm run build
npm run start
```

Server runs at `http://YOUR_PC_IP:3000`

## Step 2 — Configure server URL

Edit `capacitor.config.ts` and set your PC's local IP:

```typescript
server: {
  url: "http://192.168.1.100:3000",  // replace with your IP
  cleartext: true,
}
```

- **Android Emulator:** use `http://10.0.2.2:3000`
- **Physical phone:** use your PC's WiFi IP (phone must be on same network)

## Step 3 — Sync and open Android Studio

```bash
npm run android:build
npm run android:open
```

## Step 4 — Build APK in Android Studio

1. Wait for Gradle sync to finish
2. **Build → Build Bundle(s) / APK(s) → Build APK(s)**
3. APK location: `android/app/build/outputs/apk/debug/app-debug.apk`

## Step 5 — Install on phone

Transfer the APK to your Android phone and install it.

## App features

- Native Android shell (not a browser PWA)
- Material Design UI with bottom navigation
- Card-based lists (no horizontal scrolling)
- Blue app header and native-style forms
