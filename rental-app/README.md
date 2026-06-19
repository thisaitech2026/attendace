# RentHub — Rental House & Shop Management App

A comprehensive mobile UI for managing rental houses and shops, built with **React Native** and **Expo**.

## Features

### Admin Panel
- **Dashboard** — Total properties, houses, shops, occupancy stats, monthly collections, due amounts, fines, recent payments, overdue accounts
- **Property Management** — Add/Edit/Delete properties (House, Apartment, Villa, Shop, Commercial Unit)
- **Customer Management** — Create and manage customer accounts (no self-registration)
- **Rental Mapping** — Map customers to properties with rent terms, due dates, grace period, fines
- **Utility Management** — EB and water connection information
- **Reports** — Property, occupancy, customer, daily/monthly collections, due, fine, and outstanding reports
- **Payment History** — View all transactions with status tracking
- **Overdue Accounts** — Automatic fine calculation (Late Days × Fine Per Day)

### Customer Panel
- **Dashboard** — View property info, rent amount, due date, outstanding amount, fines, total payable
- **Utility View** — Read-only EB service number and water connection details
- **Online Payment** — UPI, Google Pay, PhonePe, Paytm, Debit/Credit Card, Net Banking
- **Payment History** — Transaction ID, date, rent month, fine, total paid, status
- **Receipts** — Auto-generated PDF receipts (view & download)

## Tech Stack

- React Native 0.85 + Expo SDK 56
- TypeScript
- React Navigation (Stack + Bottom Tabs)
- Expo Linear Gradient & Vector Icons

## Getting Started

```bash
cd rental-app
npm install
npm start
```

Then scan the QR code with **Expo Go** on your phone, or press `w` for web preview.

### Login

Use the role toggle on the login screen:
- **Admin** — Full system control
- **Customer** — View-only + payment access

No credentials required for the UI demo — tap **Sign In**.

## Project Structure

```
rental-app/
├── App.tsx                    # App entry point
├── src/
│   ├── components/            # Reusable UI components
│   ├── data/mockData.ts       # Sample data for UI demo
│   ├── navigation/            # Admin & Customer navigators
│   ├── screens/
│   │   ├── admin/             # Admin panel screens
│   │   ├── auth/              # Login screen
│   │   └── customer/          # Customer panel screens
│   ├── theme/                 # Colors, spacing
│   └── types/                 # TypeScript interfaces
```

## SRS Coverage

| Requirement | Status |
|---|---|
| Admin Dashboard | ✅ |
| Property Management | ✅ |
| Utility Management | ✅ |
| Customer Management | ✅ |
| Rental Mapping | ✅ |
| Due & Fine Management | ✅ |
| Customer Dashboard | ✅ |
| Customer Utility View | ✅ |
| Online Payment Module | ✅ |
| Payment History | ✅ |
| Receipt Management | ✅ |
| Reports Module | ✅ |
| Role-Based Access | ✅ UI |

> This is a **UI prototype** with mock data. Backend API, authentication, and payment gateway integration are not included.
