# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Create `.env.local` file:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://ygklfmwcpbdovqyljxuy.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlna2xmbXdjcGJkb3ZxeWxqeHV5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM5OTQ4ODQsImV4cCI6MjA3OTU3MDg4NH0.QzrD90kp87E193hkW4kdHQbDXwKIPz46kfVF1Ul06Y0
   
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   
   NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/anchor/idYOUR_APP_ID
   NEXT_PUBLIC_PLAY_STORE_URL=https://play.google.com/store/apps/details?id=com.anchor.app
   NEXT_PUBLIC_TICKET_PRICE=29.99
   ```

3. **Add background image:**
   - Copy `anchor-landing-bg.jpg` from your archive folder to `public/anchor-landing-bg.jpg`

4. **Set up Supabase table:**
   - Go to your Supabase dashboard
   - Create a table named `waitlist` with these columns:
     - `id` (uuid, primary key, default: `gen_random_uuid()`)
     - `name` (text)
     - `email` (text, unique)
     - `phone` (text)
     - `payment_intent_id` (text, nullable)
     - `has_ticket` (boolean, default: `false`)
     - `ticket_purchased_at` (timestamp, nullable)
     - `created_at` (timestamp, default: `now()`)

5. **Set up Stripe:**
   - Get your API keys from [Stripe Dashboard](https://dashboard.stripe.com/apikeys)
   - Add them to `.env.local`

6. **Run the app:**
   ```bash
   npm run dev
   ```

## Additional Configuration

### Email Service (Optional)
The email functionality currently logs to console. To enable actual email sending:

1. **Option 1: Supabase Edge Function**
   - Create an edge function in Supabase
   - Use a service like Resend or SendGrid

2. **Option 2: Direct API Integration**
   - Update `app/api/send-ticket-email/route.ts`
   - Add your email service API key

### Wallet Passes (Optional)
Apple Wallet and Google Wallet passes require additional setup:

1. **Apple Wallet:**
   - Apple Developer account
   - Pass Type ID certificate
   - Update `app/api/generate-wallet-pass/route.ts` with your certificates

2. **Google Wallet:**
   - Google Cloud project
   - Wallet API enabled
   - Service account credentials
   - Update the wallet pass generation code

## Testing

- Use Stripe test mode for development
- Test cards: `4242 4242 4242 4242` (any future expiry, any CVC)
- See [Stripe Testing](https://stripe.com/docs/testing) for more test cards

## Production Deployment

1. Update environment variables with production keys
2. Set up email service
3. Configure wallet passes
4. Deploy to Vercel, Netlify, or your preferred platform

