# WorkPulse — Employee Mobile App

A cross-platform mobile HR app built with **React Native** and **Expo** for employee self-service: attendance, leave, performance, salary, and profile management.

## Features

- **Employee Profile** — View personal and work contact details
- **Attendance (Punch In/Out)** — Track daily attendance with timestamps
- **WiFi Punch-In** — WorkJam-style office WiFi verification before punch-in (validates connected SSID against approved office networks)
- **Leave Management** — View balances, submit requests, track approval status
- **Performance Reviews** — Goals, ratings, strengths, and improvement areas
- **Salary & Payslips** — Monthly breakdown with basic, allowances, deductions, and net pay

## Tech Stack

- React Native 0.85 + Expo SDK 56
- Expo Router (file-based navigation)
- TypeScript
- AsyncStorage for local persistence
- `@react-native-community/netinfo` + `expo-location` for WiFi verification

## Getting Started

### Prerequisites

- Node.js 18+
- [Expo Go](https://expo.dev/go) on your phone, or Android Studio / Xcode for emulators

### Install & Run

```bash
npm install
npm start
```

Then scan the QR code with Expo Go, or press `a` for Android / `i` for iOS simulator.

### Demo Login

**Employee**

| Email | Password |
|-------|----------|
| `john.doe@company.com` | `password123` |
| `jane.smith@company.com` | `password123` |

**Admin / HR**

| Email | Password |
|-------|----------|
| `hr.admin@company.com` | `admin123` |

## Android APK

A release APK is available at [`releases/WorkPulse-v1.0.0.apk`](releases/WorkPulse-v1.0.0.apk) (arm64-v8a).

Install on Android by enabling "Install unknown apps" for your file manager, then open the APK.

### Build APK locally

Requirements: Java 21, Android SDK (API 36), NDK 27.1.12297006.

```bash
npm install
npm run build:apk
```

The output is copied to `releases/WorkPulse-v1.0.0.apk`.

For cloud builds with EAS:

```bash
npx eas-cli build --platform android --profile preview
```

## WiFi Punch-In

The app verifies attendance by checking that the device is connected to an approved office WiFi network. Configure allowed SSIDs in `constants/config.ts`:

```typescript
export const ALLOWED_WIFI_SSIDS = [
  'Office-WiFi',
  'Company-5G',
  'HQ-Guest',
  'WorkPulse-Office',
];
```

**Requirements for WiFi SSID detection:**
- **Android**: Location permission + WiFi enabled
- **iOS**: Location permission (required by Apple for SSID access)
- **Web**: WiFi verification is not available; use manual punch or test on a device

## Project Structure

```
app/                  # Screens (Expo Router)
  (tabs)/             # Main tab navigation
  login.tsx           # Authentication
  leave-request.tsx   # Leave request modal
components/ui/        # Reusable UI components
contexts/             # React context (auth + data)
services/             # Business logic & WiFi service
data/                 # Mock employee data
types/                # TypeScript interfaces
constants/            # App config & theme
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm start` | Start Expo dev server |
| `npm run android` | Run on Android |
| `npm run ios` | Run on iOS |
| `npm run web` | Run in browser |
| `npm run build:apk` | Build Android release APK |

## License

Private — for internal use.
