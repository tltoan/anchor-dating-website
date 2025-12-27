# Setup Tickets Table - Complete Guide

## Step 1: Create the Tickets Table

Run this SQL in your **Supabase SQL Editor**:

```sql
-- ============================================
-- CREATE TICKETS TABLE
-- ============================================
-- This creates a separate table for ticket purchases
-- Each ticket purchase gets its own UUID

-- Create tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID, -- Reference to waitlist user (optional, can be NULL)
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  payment_intent_id TEXT NOT NULL UNIQUE,
  ticket_purchased_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_phone ON tickets(phone);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
CREATE INDEX IF NOT EXISTS idx_tickets_payment_intent_id ON tickets(payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_tickets_ticket_purchased_at ON tickets(ticket_purchased_at);

-- Enable Row Level Security (RLS)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on tickets" ON tickets
  FOR ALL
  USING (true)
  WITH CHECK (true);
```

## Step 2: Verify the Table

After running the SQL, verify the table was created:

1. Go to Supabase Dashboard → Table Editor
2. You should see a new `tickets` table
3. Check that it has these columns:
   - `id` (UUID, primary key)
   - `user_id` (UUID, nullable)
   - `name` (TEXT)
   - `email` (TEXT)
   - `phone` (TEXT)
   - `payment_intent_id` (TEXT, unique)
   - `ticket_purchased_at` (TIMESTAMP)
   - `created_at` (TIMESTAMP)

## Step 3: Test the Setup

1. Complete a test purchase
2. Check the `tickets` table - you should see a new entry
3. Each purchase creates a new row with a unique UUID

## Troubleshooting

### Error: "Tickets table does not exist"

- Make sure you ran the SQL in Supabase SQL Editor
- Check that the table name is exactly `tickets` (lowercase)

### Error: "Permission denied"

- Check your RLS policies
- Make sure the policy allows operations from your API

### Error: "Unique constraint violation"

- This means a payment_intent_id already exists
- This is normal - prevents duplicate ticket creation for the same payment

## Database Structure

**`waitlist` table:**

- Stores user signups (one entry per user)
- `has_ticket: false` for wishlist entries

**`tickets` table:**

- Stores ticket purchases (multiple entries per user)
- Each purchase = one row with UUID
- Linked by phone number

## How It Works

1. User submits form → Creates entry in `waitlist` table
2. User purchases ticket → Creates entry in `tickets` table
3. User purchases another ticket → Creates another entry in `tickets` table
4. All tickets for a user are fetched by phone number
