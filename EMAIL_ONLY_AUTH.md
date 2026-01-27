# Email-Only Authentication for Events

## Overview

The events system now uses **simple email-only authentication** - no passwords, no OTP codes. Users just enter their email and are immediately signed in. Website users are stored in a **separate table** from Supabase Auth users.

## How It Works

### User Flow:

1. **User clicks "Events"** → Sees email entry form
2. **User enters email (and optional name)** → Clicks "Continue"
3. **System checks if email exists**:
   - If **new email** → Creates user in `events_website_users` table
   - If **existing email** → Retrieves user from table
4. **User is signed in** → Sees events page
5. **User can buy tickets** → Proceeds with ticket purchase flow

### Features:

✅ **No Passwords** - Just email entry
✅ **No OTP Codes** - No verification needed
✅ **Separate Table** - Website users stored in `events_website_users` (not Supabase Auth)
✅ **Simple & Fast** - Instant sign-in
✅ **Persistent** - Email saved in localStorage for return visits

## Database Setup

### 1. Create Events Website Users Table

Run this SQL in your Supabase SQL Editor:

```sql
-- File: create-events-website-users-table.sql
```

Or manually create the table:
- Table name: `events_website_users`
- Columns:
  - `id` (UUID, primary key)
  - `email` (TEXT, unique, not null)
  - `name` (TEXT, nullable)
  - `created_at` (TIMESTAMP)
  - `updated_at` (TIMESTAMP)

### 2. Row Level Security (RLS)

The table has RLS enabled with policies:
- **Anyone can read** - For checking if user exists
- **Anyone can insert** - For new signups
- **Anyone can update** - For updating user info

## API Endpoint

### POST `/api/events-auth`

**Request:**
```json
{
  "email": "user@example.com",
  "name": "John Doe" // optional
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "John Doe",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "isNewUser": true // or false if existing user
}
```

## Code Structure

### Components:

1. **`EventsAuthForm`** (`components/EventsAuthForm.tsx`)
   - Simple email + optional name form
   - Calls `/api/events-auth` endpoint
   - Shows success message
   - Calls `onSuccess` callback with email and user ID

2. **Events Page** (`app/events/page.tsx`)
   - Shows `EventsAuthForm` if user not authenticated
   - Shows events page if user authenticated
   - Stores email and user ID in localStorage
   - Restores state on page reload

### API Route:

- **`app/api/events-auth/route.ts`**
  - Checks if email exists in `events_website_users` table
  - Creates new user if email doesn't exist
  - Returns user data

## User Data Storage

### localStorage Keys:

- `anchor_events_userEmail` - User's email
- `anchor_events_websiteUserId` - User's ID from events_website_users table
- `anchor_events_step` - Current step in flow
- `anchor_events_formData` - Form data for ticket purchase
- `anchor_events_paymentIntentId` - Payment intent ID
- `anchor_events_userId` - User ID (for ticket system)

## Separation from Supabase Auth

✅ **Completely Separate**:
- Website users in `events_website_users` table
- Supabase Auth users in `auth.users` table
- No merging or connection between them
- Website users don't need Supabase Auth accounts

## Testing

1. **First Visit**:
   - Navigate to `/events`
   - Enter email and name
   - Click "Continue"
   - Should see events page with email displayed

2. **Return Visit**:
   - Navigate to `/events`
   - Should automatically show events page (email saved in localStorage)

3. **Buy Ticket**:
   - Click "Buy Ticket"
   - Fill out form
   - Complete payment
   - Receive ticket

## Troubleshooting

### User not signed in:
- Check if `events_website_users` table exists
- Verify RLS policies allow insert/select
- Check browser console for errors
- Clear localStorage and try again

### Email not saving:
- Check localStorage is enabled in browser
- Verify API endpoint is working
- Check network tab for API errors

## Security Notes

- Email is the only identifier
- No password protection
- Anyone with email can access
- Suitable for public events website
- For more security, consider adding password or OTP later
