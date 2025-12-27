-- ============================================
-- CREATE TICKETS TABLE
-- ============================================
-- Run this in Supabase SQL Editor
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

-- Optional: Add foreign key constraint if you want to link to waitlist
-- Uncomment if you want to link tickets to waitlist users
-- ALTER TABLE tickets ADD CONSTRAINT fk_tickets_user_id 
--   FOREIGN KEY (user_id) REFERENCES waitlist(id) ON DELETE SET NULL;

-- Enable Row Level Security (RLS)
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (required for API to work)
-- Adjust this policy based on your security needs
CREATE POLICY "Allow all operations on tickets" ON tickets
  FOR ALL
  USING (true)
  WITH CHECK (true);

