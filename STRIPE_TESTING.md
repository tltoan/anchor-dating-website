# Stripe Testing Guide

## Test Card Numbers

Use these test card numbers to test the payment flow:

### Successful Payments

| Card Number | Description |
|------------|-------------|
| `4242 4242 4242 4242` | Visa - Success |
| `5555 5555 5555 4444` | Mastercard - Success |
| `3782 822463 10005` | American Express - Success |
| `6011 1111 1111 1117` | Discover - Success |

### Test Card Details

For all test cards, use:
- **Expiry Date**: Any future date (e.g., `12/29`, `12/34`)
- **CVC**: Any 3 digits (e.g., `123`, `456`)
- **ZIP/Postal Code**: Any valid code (e.g., `12345`, `90210`)

### Special Test Cards

| Card Number | Behavior |
|------------|----------|
| `4000 0000 0000 0002` | Card declined (generic decline) |
| `4000 0000 0000 9995` | Insufficient funds |
| `4000 0000 0000 0069` | Expired card |
| `4000 0000 0000 0127` | Incorrect CVC |

## Setup Instructions

### 1. Get Stripe Test Keys

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys)
2. Make sure you're in **Test mode** (toggle in top right)
3. Copy your **Publishable key** and **Secret key**

### 2. Add to `.env.local`

Create or update `.env.local` in your project root:

```env
# Stripe Test Keys
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# Other environment variables...
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key
NEXT_PUBLIC_APP_STORE_URL=https://apps.apple.com/app/anchor/idYOUR_APP_ID
NEXT_PUBLIC_TICKET_PRICE=29.99
```

### 3. Restart Dev Server

After adding environment variables:

```bash
# Stop the current server (Ctrl+C)
npm run dev
```

## Testing the Flow

### Step-by-Step Testing

1. **Start the app**: `npm run dev`
2. **Go to**: `http://localhost:3000`
3. **Click**: "Get Started" button
4. **Fill form**: Enter name, email, phone
5. **Payment screen**: You'll see the ticket price
6. **Use test card**: 
   - Card number: `4242 4242 4242 4242`
   - Expiry: `12/29` (or any future date)
   - CVC: `123` (or any 3 digits)
   - ZIP: `12345` (or any code)
7. **Click**: "Pay Now"
8. **Result**: Should proceed to ticket success screen

## What to Expect

### Successful Payment
- Payment processes successfully
- Redirects to ticket success screen
- QR code is displayed
- Email is sent (if configured)

### Failed Payment
- Error message appears
- Stays on payment screen
- Can try again with different card

## Testing Different Scenarios

### Test Successful Payment
```
Card: 4242 4242 4242 4242
Expiry: 12/29
CVC: 123
```

### Test Declined Payment
```
Card: 4000 0000 0000 0002
Expiry: 12/29
CVC: 123
```
Expected: "Your card was declined" error

### Test 3D Secure (if enabled)
```
Card: 4000 0027 6000 3184
Expiry: 12/29
CVC: 123
```
Expected: 3D Secure authentication popup

## Viewing Test Transactions

1. Go to [Stripe Dashboard](https://dashboard.stripe.com/test/payments)
2. Make sure you're in **Test mode**
3. You'll see all test payments listed
4. Click on any payment to see details

## Important Notes

- ✅ Test mode is safe - no real charges
- ✅ Test cards only work in test mode
- ✅ Real cards won't work in test mode
- ⚠️ Make sure you're using test keys (start with `pk_test_` and `sk_test_`)
- ⚠️ Never commit test keys to git (they're in `.env.local` which is gitignored)

## Troubleshooting

### Payment not working?
1. Check you're using test keys (not live keys)
2. Verify keys are in `.env.local`
3. Restart dev server after adding keys
4. Check browser console for errors

### Can't see payment form?
- Make sure Stripe keys are set correctly
- Check browser console for errors
- Verify `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` is set

### Payment succeeds but no redirect?
- Check API routes are working
- Verify Supabase connection
- Check browser console for errors

## More Test Cards

For a complete list of test cards, see:
- [Stripe Test Cards Documentation](https://stripe.com/docs/testing#cards)

