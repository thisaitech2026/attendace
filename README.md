# Rental House & Shop Management System

Repository: **https://github.com/thisaitech2026/Rentalhouse**

A comprehensive full-stack application for managing rental houses and shops with Admin and Customer panels.

## Features

### Admin Panel
- **Dashboard** — Total properties, houses, shops, occupancy stats, monthly collections, due amounts, fine collections, recent payments, overdue accounts
- **Property Management** — Add/Edit/Delete properties (House, Apartment, Villa, Shop, Commercial Unit) with utility info
- **Customer Management** — Create customer accounts (no self-registration)
- **Rental Mapping** — Map customers to properties with rent terms
- **Reports** — Property, Occupancy, Customer, Daily/Monthly Collections, Due, Fine, Outstanding reports

### Customer Panel
- **Dashboard** — View personal info, property details, outstanding amounts, fines
- **Utilities** — View EB service number and water connection details
- **Online Payments** — Pay rent via UPI, Google Pay, PhonePe, Paytm, Debit/Credit Card, Net Banking
- **Payment History** — View transactions and download PDF receipts

### Core Features
- Automatic due & fine calculation (Late Days × Fine Per Day)
- Role-based access control with JWT authentication
- Auto-generated PDF receipts
- Secure encrypted passwords (bcrypt)

## Tech Stack

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** SQLite with Prisma ORM
- **Auth:** JWT with HTTP-only cookies
- **PDF:** jsPDF

## Getting Started

### Prerequisites
- Node.js 18+

### Installation

```bash
npm install
npm run db:setup
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Demo Credentials

| Role     | Username | Password     |
|----------|----------|--------------|
| Admin    | admin    | admin123     |
| Customer | rajesh   | customer123  |
| Customer | priya    | customer123  |

## Project Structure

```
src/
├── app/
│   ├── admin/          # Admin panel pages
│   ├── customer/       # Customer panel pages
│   ├── api/            # API routes
│   └── login/          # Login page
├── components/         # UI components
├── lib/                # Utilities, auth, due calculation
└── generated/prisma/   # Prisma client
prisma/
├── schema.prisma       # Database schema
└── seed.ts             # Seed data
```

## API Endpoints

- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `GET /api/admin/dashboard` — Admin dashboard stats
- `GET/POST /api/admin/properties` — Property CRUD
- `GET/POST /api/admin/customers` — Customer CRUD
- `GET/POST /api/admin/rentals` — Rental mapping
- `GET /api/admin/reports?type=` — Reports
- `GET/POST /api/customer/dashboard` — Customer dashboard & payments
- `GET /api/customer/payments` — Payment history
- `GET /api/receipts/:id` — Download PDF receipt

## License

MIT
