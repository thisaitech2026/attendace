# thisAI — Employee Mobile App

A cross-platform mobile HR app built with **React Native** and **Expo** for employee self-service: attendance, leave, salary, and profile management.

## Features

- **Employee Profile** — View personal and work contact details
- **Attendance (Punch In/Out)** — Track daily attendance with timestamps
- **WiFi Punch-In** — Office WiFi verification before punch-in (validates connected SSID against approved office networks)
- **Manual Punch Approval** — Manual punches queue for HR admin approval
- **Leave Management** — View balances, submit requests, track approval status
- **Salary & Payslips** — Monthly breakdown with basic, allowances, deductions, and net pay
- **HR Admin** — Employee management, new hire onboarding, leave and attendance approvals

## Tech Stack

- React Native 0.85 + Expo SDK 56
- Expo Router (file-based navigation)
- TypeScript
- Firebase Firestore for cloud data
- AsyncStorage for session persistence
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

A release APK is available at [`releases/thisAI-v1.0.0.apk`](releases/thisAI-v1.0.0.apk) (arm64-v8a).

Install on Android by enabling "Install unknown apps" for your file manager, then open the APK.

**Package:** `com.thisaitech.hris`

### Build APK locally

Requirements: Java 21, Android SDK (API 36), NDK 27.1.12297006.

```bash
npm install
npm run build:apk
```

The output is copied to `releases/thisAI-v1.0.0.apk`.

For cloud builds with EAS:

```bash
npx eas-cli build --platform android --profile preview
```

## WiFi Punch-In

The app verifies attendance on the **THISAI** office WiFi. Devices must be on the `192.168.100.x` network (for example `192.168.100.15`).

Configure office settings in `constants/config.ts` and `utils/officeNetwork.ts`:

```typescript
export const ALLOWED_WIFI_SSIDS = ['THISAI'];
export const OFFICE_IP_PREFIX = '192.168.100.';
```

**Verification checks:**
1. Device is connected to WiFi
2. SSID matches **THISAI**
3. Device IP is in `192.168.100.x` (when IP can be detected)

**Requirements for WiFi SSID detection:**
- **Android**: Location permission + WiFi enabled
- **iOS**: Location permission (required by Apple for SSID access)
- **Web**: WiFi verification is not available; use manual punch or test on a device

## Project Structure

```
app/                  # Screens (Expo Router)
  (tabs)/             # Main tab navigation
  admin/              # HR admin screens
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
