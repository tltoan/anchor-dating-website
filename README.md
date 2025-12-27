# Anchor Dating Website

A premium Next.js application with Framer Motion animations for the Anchor dating platform.

## Features

- 🎨 Premium UI/UX with scroll animations
- 📱 Multi-step form flow (Name, Email, Phone)
- 💳 Stripe payment integration
- 🎫 QR code ticket generation
- 📧 Email ticket delivery
- 🍎 Apple Wallet / Google Wallet integration
- 🚀 App Store redirect after wallet setup

## Tech Stack

- **Next.js 14+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** (animations)
- **Stripe** (payments)
- **Supabase** (database)
- **QR Code** (ticket generation)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

   # Stripe
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key

   # App Store
   NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/anchor/idYOUR_APP_ID

   # Ticket Price
   NEXT_PUBLIC_TICKET_PRICE=29.99
   ```

3. **Set up Supabase:**
   - Create a `waitlist` table with columns:
     - `id` (uuid, primary key)
     - `name` (text)
     - `email` (text, unique)
     - `phone` (text)
     - `payment_intent_id` (text)
     - `created_at` (timestamp)

4. **Set up Stripe:**
   - Get your API keys from Stripe Dashboard
   - Add them to `.env.local`

5. **Add background image:**
   - Place `anchor-landing-bg.jpg` in the `public/` folder

6. **Run the development server:**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Flow

1. **Landing Page** → User clicks "Get Started"
2. **Form** → User enters Name, Email, Phone
3. **Payment** → User pays ticket price via Stripe
4. **Ticket Success** → QR code displayed, email sent, wallet options shown
5. **Premium Message** → After wallet added, shows premium message
6. **App Store Redirect** → Redirects to App Store

## Additional Setup Required

### Email Service
The email functionality requires setup. Options:
- Supabase Edge Function
- Resend API
- SendGrid
- Other email service

### Wallet Passes
Apple Wallet and Google Wallet passes require:
- **Apple Wallet**: Apple Developer account, certificates, and `.pkpass` generation
- **Google Wallet**: Google Wallet API credentials and JWT token generation

See `app/api/generate-wallet-pass/route.ts` for implementation details.

## Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── privacy/          # Privacy page
│   ├── terms/            # Terms page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main page (flow controller)
│   └── globals.css       # Global styles
├── components/
│   ├── Hero.tsx          # Landing page
│   ├── SignupForm.tsx    # Form step
│   ├── PaymentScreen.tsx # Payment step
│   ├── TicketSuccess.tsx # Ticket success screen
│   └── PremiumMessage.tsx # Premium message screen
└── public/               # Static assets
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Notes

- The app uses Supabase for user data storage
- Stripe handles all payment processing
- QR codes are generated client-side
- Wallet passes require additional setup (see above)
- Email sending needs to be configured with your preferred service
