# Anchor Dating Website

The website for [Anchor](https://instagram.com/anchor.dating) — a dating app where every match is a date. Built with Next.js, featuring a scroll-animated landing page and a full events ticketing flow.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19** / **TypeScript**
- **Tailwind CSS 4**
- **Framer Motion** — scroll-driven animations on the landing page
- **Stripe** — event ticket payments
- **Supabase** — database, auth, and session management
- **QR Code** (`qrcode.react`) — ticket generation

## Routes

| Route | Description |
|---|---|
| `/` | Landing page — scroll-animated hero with app screenshots, place images, and App Store badge |
| `/events` | Events hub — browse events, RSVP, purchase tickets, view ticket history |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/admin/scan/[id]` | Admin ticket scanner (per-event) |

## Events Flow

1. **Browse Events** → User sees upcoming events with details, host info, and RSVP buttons
2. **Event Detail** → Full event info with date, location, description, and ticket price
3. **Email Entry** → User enters email (checks for existing account)
4. **Payment** → Stripe checkout for ticket purchase
5. **Ticket Success** → QR code ticket displayed with option to view history
6. **Tickets History** → View all purchased tickets

## API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/events` | GET | Fetch all events (supports `?mine=1` for admin filtering) |
| `/api/events` | POST | Create a new event (admin only) |
| `/api/events/[id]` | GET/PUT/DELETE | Single event CRUD |
| `/api/create-payment-intent` | POST | Create Stripe payment intent for ticket purchase |
| `/api/check-existing-user` | POST | Check if a user already exists by email |
| `/api/save-user` | POST | Save/update user profile |
| `/api/get-events-tickets` | GET | Get tickets for a specific event |
| `/api/get-user-tickets` | GET | Get all tickets for a user |
| `/api/join-waitlist` | POST | Add user to the waitlist |
| `/api/events-auth` | POST | Auth flow for events (email-based) |
| `/api/send-ticket-email` | POST | Send ticket confirmation email |
| `/api/generate-wallet-pass` | POST | Generate Apple/Google Wallet pass |

## Project Structure

```
app/
├── page.tsx              # Landing page (scroll-animated hero + header + footer)
├── layout.tsx            # Root layout (fonts, metadata, providers)
├── globals.css           # Global styles + legal page CSS
├── events/page.tsx       # Events flow orchestrator
├── admin/scan/[id]/      # Ticket scanner (per-event)
├── privacy/page.tsx      # Privacy policy
├── terms/page.tsx        # Terms of service
└── api/                  # All API routes (see table above)

components/
├── EventsList.tsx        # Events grid with cards
├── EventDetail.tsx       # Single event detail view
├── EmailEntryForm.tsx    # Email entry modal
├── PaymentScreen.tsx     # Stripe payment form
├── TicketSuccess.tsx     # QR code ticket + success screen
├── TicketsHistory.tsx    # Past tickets modal
├── EventsProfileModal.tsx# User profile modal
├── EventFormModal.tsx    # Admin: create/edit event form
├── LandingFooter.tsx     # Footer with orbit animation + links
├── landing/
│   └── AppstoreBadge.tsx # App Store download badge
├── Hero.tsx              # (Legacy) old landing hero
├── WaitlistSignup.tsx    # (Legacy) waitlist form
├── SignupForm.tsx        # (Legacy) multi-step signup
├── PremiumMessage.tsx    # (Legacy) premium upsell
├── AuthForm.tsx          # Auth form
├── EventsAuthForm.tsx    # Events-specific auth
├── PhoneOTPForm.tsx      # Phone OTP verification
└── Providers.tsx         # React context providers

contexts/
├── AuthContext.tsx        # Auth state management
└── SupabaseAuthContext.tsx# Supabase auth provider

lib/
├── supabase.ts           # Legacy Supabase client
├── auth-storage.ts       # Auth token/session storage helpers
├── supabase/
│   ├── client.ts         # Browser Supabase client
│   ├── server.ts         # Server-side Supabase client
│   └── middleware.ts     # Supabase session middleware
└── sql/                  # SQL migration scripts for Supabase

scripts/
└── seed-events.ts        # Seed script to populate events table

public/
├── anchor-header-logo.png# Anchor logo (used in nav, OG image)
├── anchor-icons/         # App icon illustrations (anchor, notification, height)
├── antony_photos/        # Portrait photos for landing page
├── places-pics/          # Place/venue images for landing page
├── iphone.png            # iPhone mockup for landing hero
├── bar.png               # Bar image for landing
├── favicon-*.png         # Favicon assets
├── apple-touch-icon.png  # iOS home screen icon
└── icon-*.png            # PWA icons
```

## Design

- **Fonts**: Playfair Display (headings), DM Sans (body), DM Serif Display (landing)
- **Colors**: White backgrounds, warm cream accents (`#F3EFE8`), coral accent (`#D4654A`), neutral text (`#1A1A1A` / `#6B6560` / `#9E9891`)
- **Logo**: Rounded square with drop shadow, used consistently across all pages

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Create a `.env` file:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# App
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/anchor/idYOUR_APP_ID
NEXT_PUBLIC_TICKET_PRICE=0
```

### 3. Database setup

Run the SQL migrations in `lib/sql/` against your Supabase project. Key tables:
- `events` — event listings
- `tickets` — purchased tickets
- `users` — user profiles (with `is_admin` flag)
- `waitlist` — waitlist signups

### 4. Seed events (optional)

```bash
npx tsx scripts/seed-events.ts
```

### 5. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npx tsx scripts/seed-events.ts` | Seed events into Supabase |
