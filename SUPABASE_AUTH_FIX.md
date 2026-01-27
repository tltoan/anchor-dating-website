# Email Confirmation Flow (Production Ready)

## Overview
The authentication system is configured to work with **email confirmation enabled** (production-ready). Users must confirm their email before they can sign in.

## How It Works

1. **User Signs Up**:
   - Account is created in Supabase
   - Confirmation email is automatically sent
   - User sees a message: "Account created! Please check your email to confirm your account."

2. **User Confirms Email**:
   - User checks their email inbox
   - Clicks the confirmation link in the email
   - Account is confirmed

3. **User Signs In**:
   - After confirmation, user can sign in with their email and password
   - If they try to sign in before confirming, they'll see a helpful error message

## Features

✅ **Resend Confirmation Email**: Users can request a new confirmation email if needed
✅ **Clear Error Messages**: Helpful messages guide users through the confirmation process
✅ **Automatic Form Switching**: After signup, form switches to sign-in mode
✅ **Email Display**: Shows which email the confirmation was sent to

## User Experience

### Sign Up Flow:
1. User enters name, email, and password
2. Clicks "Sign Up"
3. Sees success message: "Account created! Please check your email to confirm your account."
4. Form automatically switches to sign-in mode
5. A blue info box appears with:
   - Message showing which email the confirmation was sent to
   - "Resend Confirmation Email" button

### Sign In Flow:
1. If user tries to sign in before confirming:
   - Sees error: "Invalid email or password. If you just signed up, please check your email to confirm your account."
   - Info box appears with resend option
2. After confirming email:
   - User can sign in successfully
   - Redirected to events page

## Resend Confirmation Email

Users can click the "Resend Confirmation Email" button if:
- They didn't receive the email
- The email expired
- They need a new confirmation link

## Supabase Configuration

Make sure email confirmation is **enabled** in Supabase:

1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **Settings** (or **Providers** → **Email**)
3. Ensure **"Enable email confirmations"** is **enabled**
4. Configure email templates if needed
5. Set redirect URL to: `https://yourdomain.com/events` (or your events page URL)

## Testing

1. **Sign Up**:
   - Enter email, password, and name
   - Click "Sign Up"
   - Check email inbox for confirmation link

2. **Confirm Email**:
   - Click the confirmation link in the email
   - Should redirect to events page (if already signed in) or show success

3. **Sign In**:
   - Enter email and password
   - Should successfully sign in and see events

4. **Resend Email**:
   - If confirmation email wasn't received
   - Click "Resend Confirmation Email" button
   - Check email for new confirmation link
