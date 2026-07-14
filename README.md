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
- Success confirmation screen

### Admin dashboard (`/admin`)

- Overview
- Pending Requests (Approve / Reject)
- Connected Users (Disconnect)
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
