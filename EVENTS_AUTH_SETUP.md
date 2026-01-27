# Events & Authentication Setup Guide

## Overview

This guide explains how to set up the authentication system and events feature for the Anchor Dating website.

## Authentication System

### How It Works

The authentication system uses **Supabase Auth** with secure token storage in **localStorage**. Here's how it's implemented:

1. **Token Storage** (`lib/auth-storage.ts`):
   - Stores authentication tokens securely in localStorage
   - Handles access tokens, refresh tokens, and user data
   - Provides utilities for checking authentication status

2. **Auth Context** (`contexts/AuthContext.tsx`):
   - Manages global authentication state
   - Provides `signUp`, `signIn`, and `signOut` functions
   - Automatically syncs with Supabase session
   - Persists authentication across page refreshes

3. **Supabase Client** (`lib/supabase.ts`):
   - Configured with session persistence
   - Automatically refreshes tokens
   - Handles authentication state changes

### Security Best Practices

✅ **Token Storage**: Tokens are stored in localStorage with proper error handling
✅ **Session Persistence**: Supabase handles automatic token refresh
✅ **Error Handling**: All auth operations include proper error handling
✅ **Type Safety**: Full TypeScript support for auth state

## Events System

### Setup Steps

1. **Create Events Table in Supabase**:
   - Open your Supabase SQL Editor
   - Run the SQL from `create-events-table.sql`
   - This creates the `events` table with proper structure and RLS policies

2. **Add Sample Events** (Optional):
   ```sql
   INSERT INTO events (title, description, date, location, price, image_url)
   VALUES (
     'NYC Launch Concert',
     'Join us for an unforgettable night of music and connection.',
     '2024-12-31 20:00:00+00',
     'New York City, NY',
     29.99,
     '/anchor-landing-bg.jpg'
   );
   ```

3. **Enable Supabase Authentication**:
   - Go to Supabase Dashboard → Authentication → Settings
   - Enable "Email" provider
   - Configure email templates if needed

## User Flow

### 1. Home Screen
- User sees "Join Waitlist" and **"Events"** buttons
- Clicking "Events" navigates to `/events`

### 2. Events Page - Not Authenticated
- Shows login/signup form
- User can:
  - Sign up with email, password, and name
  - Sign in with email and password
- After successful authentication, automatically fetches events

### 3. Events Page - Authenticated
- Shows list of events from Supabase
- Displays user email and **Logout** button
- User can click on any event to see details

### 4. Event Detail
- Shows full event information:
  - Title, description
  - Date and time
  - Location
  - Price
- "Buy Ticket" button starts the ticket purchase flow

### 5. Ticket Purchase Flow
- Form submission (name, email, phone)
- Payment processing
- Ticket success screen

## API Endpoints

### GET `/api/events`
- Fetches all events from Supabase
- Returns events sorted by date
- No authentication required (events are public)

## Environment Variables

Make sure these are set in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Files Created/Modified

### New Files:
- `lib/supabase.ts` - Supabase client configuration
- `lib/auth-storage.ts` - Token storage utilities
- `contexts/AuthContext.tsx` - Authentication context provider
- `components/Providers.tsx` - App providers wrapper
- `components/AuthForm.tsx` - Login/signup form
- `components/EventDetail.tsx` - Event detail view
- `app/api/events/route.ts` - Events API endpoint
- `create-events-table.sql` - Database setup SQL

### Modified Files:
- `app/layout.tsx` - Added AuthProvider
- `app/events/page.tsx` - Complete rewrite with auth flow
- `components/Hero.tsx` - Added Events button

## Testing

1. **Test Authentication**:
   - Navigate to `/events`
   - Try signing up with a new email
   - Sign out and sign back in
   - Verify token persistence on page refresh

2. **Test Events**:
   - After signing in, verify events are fetched
   - Click on an event to see details
   - Test the "Buy Ticket" flow

## Troubleshooting

### Events not showing:
- Check if `events` table exists in Supabase
- Verify RLS policies allow SELECT operations
- Check browser console for API errors

### Authentication not working:
- Verify Supabase Auth is enabled in dashboard
- Check environment variables are set correctly
- Ensure email provider is enabled in Supabase

### Token not persisting:
- Check browser localStorage is enabled
- Verify Supabase client configuration
- Check for console errors

## Next Steps

1. Add event images to Supabase storage
2. Implement event filtering/search
3. Add event categories
4. Implement admin panel for event management
5. Add email notifications for event signups
