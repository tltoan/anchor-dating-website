# OTP Authentication Setup for Events

## Overview

The events authentication system now uses **OTP (One-Time Password)** authentication - no passwords required! Users enter their email, receive a verification code, and enter it to sign in.

## How It Works

### User Flow:

1. **User enters email** → Clicks "Send Verification Code"
2. **Supabase sends OTP code** → User receives email with 8-digit code
3. **User enters code** → Clicks "Verify & Sign In"
4. **User is signed in** → Redirected to events page

   ### Features:

✅ **No Passwords** - Simple email + code authentication
✅ **Secure** - OTP codes expire after use
✅ **Resend Code** - Users can request a new code if needed
✅ **Change Email** - Users can go back and change email address
✅ **Auto-formatting** - OTP input only accepts numbers and limits to 8 digits

## Supabase Configuration

### 1. Enable OTP Authentication

1. Go to **Supabase Dashboard**
2. Navigate to **Authentication** → **Providers** → **Email**
3. Ensure **"Enable email provider"** is enabled
4. Under **"Email OTP"** settings:
   - Enable **"Enable email OTP"**
   - Set **OTP expiry** (default: 3600 seconds = 1 hour)
   - Configure email template if needed

### 2. Email Template

The default Supabase email template will send:
```
Your verification code is: 12345678
Enter this code in the app to verify your email.
```

You can customize this in:
- **Authentication** → **Email Templates** → **Magic Link / OTP**

### 3. Redirect URL

Make sure your redirect URL is set correctly:
- In the code, it's set to: `${window.location.origin}/events`
- In Supabase: **Authentication** → **URL Configuration** → **Redirect URLs**
- Add your domain: `https://yourdomain.com/events`

## Optional: Events Users Table

If you want to store additional events-specific user data, you can create the `events_users` table:

1. Go to **Supabase SQL Editor**
2. Run the SQL from `create-events-users-table.sql`
3. This creates a table linked to Supabase Auth users
4. Optionally enable the trigger to auto-create entries on signup

**Note**: This table is optional. Supabase Auth already handles user authentication. Only create this if you need to store additional user data specific to events.

## Code Structure          

### AuthContext (`contexts/AuthContext.tsx`)
- `sendOTP(email)` - Sends OTP code to email
- `verifyOTP(email, token)` - Verifies OTP code and signs user in

### AuthForm (`components/AuthForm.tsx`)
- Two-step form: Email → OTP Code
- Resend code functionality
- Change email option         
- Auto-formatting for OTP input

## Testing

1. **Send OTP**:
   - Enter email address
   - Click "Send Verification Code"
   - Check email for 8-digit code

2. **Verify OTP**:
   - Enter the 8-digit code
   - Click "Verify & Sign In"
   - Should successfully sign in and see events

3. **Resend Code**:
   - Click "Resend Code" if code wasn't received
   - New code will be sent

4. **Change Email**:
   - Click "Change Email" to go back
   - Enter different email address

## Troubleshooting

### Code not received:
- Check spam folder
- Verify email address is correct
- Check Supabase email logs (Dashboard → Logs → Auth)
- Ensure email provider is enabled in Supabase

### Invalid code error:
- Codes expire after 1 hour (configurable)
- Each code can only be used once
- Request a new code if expired

### Email provider not working:
- Verify Supabase email settings
- Check if email service is configured
- For development, Supabase provides test emails
- For production, configure SMTP or use Supabase email service

## Security Notes

- OTP codes are single-use
- Codes expire after configured time (default: 1 hour)
- Rate limiting is handled by Supabase
- Email verification ensures valid email addresses

## Migration from Password Auth

If you were using password authentication before:
- Old password-based signup/signin methods are still available in AuthContext
- Events page now uses OTP authentication
- Users will need to use OTP flow for events access
- Existing users can still use OTP - just enter their email
