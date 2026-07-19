# MktConnect — Starlink Hotspot Platform

Premium captive portal and admin dashboard for a commercial Starlink Wi-Fi hotspot business.

Built as a production-ready frontend, ready to connect later to MikroTik RouterOS API, Yenga, Orange Money, Moov Money, Telecel Cash, Wave, and a FastAPI backend.

## Stack

- React + TypeScript
- Vite
- Tailwind CSS
- shadcn-style UI primitives
- Framer Motion
- Lucide Icons
- React Router

## Features

### Captive portal (`/`)

- Welcome landing with brand, title and Wi-Fi illustration
- Internet package selection (2 Hours → 1 Month)
- Payment methods: Orange Money, Moov Money, Telecel Cash, Wave, Pay on Site
- Sticky order summary on desktop / bottom summary on mobile
- Mobile Money phone checkout
- Success → MikroTik activation → live session screen

### MikroTik simulation (`/session`)

- Grants hotspot access for **exactly** the paid package duration
- Hard ceiling: remaining time cannot exceed what was purchased
- Demo clock: `1 package hour ≈ 8 real seconds` (so expiry is testable)
- Blocks a second purchase while a session is still active
- Auto-disconnects at 100% consumption
- Admin Connected Users mirrors live simulated sessions

### Admin dashboard (`/admin`)

- Overview
- Pending Requests (Approve → MikroTik grant / Reject)
- Connected Users (live sessions + Disconnect)
- Packages CRUD
- Payments
- Statistics
- Settings

## Getting started

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

Test payment + MikroTik simulation:

```bash
npm run build
npm run preview -- --host 127.0.0.1 --port 4173
npm run test:payment
npm run test:mikrotik
```

## Project structure

```text
src/
  components/   # UI, portal and admin components
  data/         # Mock catalog and dashboard data
  pages/        # Portal + admin routes
  types/        # Shared TypeScript models
  lib/          # Utilities
```

Mock data lives in `src/data/mock.ts` so backend integration can replace it without rewriting the UI.
