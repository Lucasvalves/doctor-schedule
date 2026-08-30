# Doutor Agenda

A SaaS platform that simplifies clinic operations — managing doctors, patients, and appointments in one place, with a dashboard, real availability slots, and Stripe subscriptions.

---

## About

Clinics often deal with scattered schedules, manual records, and limited day-to-day visibility. **Doutor Agenda** brings these operations into a single platform: registering professionals and patients, defining specialties and availability, and booking appointments based on real calendar slots.

The goal is to reduce operational friction — less rework, fewer scheduling conflicts, and clearer visibility into who is available, when, and in which specialty — with metrics that help track clinic performance.

---

## What it offers

| Area | Capability |
| --- | --- |
| **Authentication** | Sign-in / sign-up with email and password, Google OAuth, and protected sessions |
| **Clinic** | Clinic creation and linkage to the authenticated user |
| **Doctors** | Professional registration with specialty, appointment price, and availability (days and time ranges) |
| **Patients** | Patient registration with contact details and basic profile data |
| **Appointments** | Book available slots, list appointments, and cancel when needed |
| **Dashboard** | Revenue, appointment volume, top doctors/specialties, and charts by date range |
| **Subscription** | Essential plan via Stripe (Checkout and Customer Portal) |

Typical workflow:

1. Create an account and register the clinic
2. Subscribe to a plan (when required)
3. Register doctors with specialty and availability
4. Register patients
5. Book appointments in available slots
6. Track clinic metrics on the dashboard

---

## Architecture

This repository is a **full-stack** Next.js (App Router) application — no separate API package:

```
doctor-schedule/
├── src/
│   ├── app/           # Routes (pages, layouts, and route handlers)
│   ├── actions/       # Server Actions (next-safe-action + Zod)
│   ├── components/    # Shared UI (shadcn/ui)
│   ├── db/            # Drizzle schema and client
│   ├── data/          # Queries and aggregations (e.g. dashboard)
│   ├── lib/           # Auth and infrastructure helpers
│   ├── helpers/       # Utilities (dates, currency, etc.)
│   └── providers/     # React providers (e.g. React Query)
├── drizzle.config.ts
└── public/
```

### Main layers

- **`app/`** — protected pages (`dashboard`, `doctors`, `patients`, `appointments`, `subscription`), authentication, and APIs (`/api/auth`, Stripe webhook)
- **`actions/`** — business rules exposed through typed, validated Server Actions
- **`db/`** — persistence with **Drizzle ORM** and **PostgreSQL**
- **`components/`** — design system based on **shadcn/ui** + Tailwind CSS

Core entities: `Users`, `Clinics`, `Doctors`, `Patients`, and `Appointments` (plus Better Auth session/account tables).

---

## Stack

| Layer | Technologies |
| --- | --- |
| App | Next.js 15 (App Router), React 19, TypeScript |
| UI | Tailwind CSS, shadcn/ui, Recharts, Lucide |
| Forms | React Hook Form, Zod, react-number-format |
| Data | Server Actions (`next-safe-action`), TanStack Query / Table |
| Auth | Better Auth (email/password + Google) |
| Database | PostgreSQL, Drizzle ORM |
| Payments | Stripe (Checkout, Customer Portal, webhooks) |
| Tooling | ESLint, Prettier, dayjs |

---

## Getting started

### Prerequisites

- Node.js 18+
- PostgreSQL
- Stripe account (for subscriptions)
- Google OAuth credentials (optional, for social login)

### Environment

Copy `.env.exemple` to `.env` and fill in the variables:

```bash
cp .env.exemple .env
```

| Variable | Purpose |
| --- | --- |
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_SECRET` | Authentication secret |
| `BETTER_AUTH_URL` | App base URL (e.g. `http://localhost:3000`) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Google login |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` / `STRIPE_SECRET_KEY` | Stripe integration |
| `STRIPE_ESSENTIAL_PLAN_PRICE_ID` | Essential plan Price ID |
| `STRIPE_WEBHOOK_SECRET` | Stripe webhook secret |
| `NEXT_PUBLIC_STRIPE_CUSTOMER_PORTAL_URL` | Customer portal URL |
| `NEXT_PUBLIC_APP_URL` | Public application URL |

### Install and run

```bash
npm install

# apply schema to the database (Drizzle Kit)
npx drizzle-kit push
# or: npx drizzle-kit migrate  (if using migrations)

npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Protected routes redirect to `/authentication` when there is no session.

### Stripe webhooks (local)

To test subscriptions locally, forward events to the app route:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

---

## Modules overview

| Route / area | Responsibility |
| --- | --- |
| `/authentication` | Sign-in and sign-up |
| `/clinic-form` | Initial clinic registration |
| `/dashboard` | Metrics and overview by date range |
| `/doctors` | Doctor CRUD and availability |
| `/patients` | Patient CRUD |
| `/appointments` | Create, list, and delete appointments |
| `/subscription` | Plan and subscription management |
| `/new-subscription` | Plan checkout flow |

Main Server Actions: `create-clinic`, `upsert-doctor`, `upsert-patient`, `add-appointment`, `get-available-times`, `delete-*`, `create-stripe-checkout`.

---

## Contributing

1. Create a branch from `main`
2. Keep changes focused on a single responsibility
3. Follow project patterns (Server Actions with `next-safe-action`, forms with React Hook Form + Zod, UI with shadcn)
4. Open a pull request describing the problem and the solution

---

## License

Personal / educational project. Adjust the license as needed for this repository.
