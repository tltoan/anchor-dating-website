-- COMPLETE FIX: Drop and recreate waitlist table
-- Run this in Supabase SQL Editor if table structure is wrong

-- First, drop the table if it exists (WARNING: This deletes all data!)
DROP TABLE IF EXISTS waitlist CASCADE;

-- Create the table with correct structure
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  payment_intent_id TEXT,
  has_ticket BOOLEAN DEFAULT false,
  ticket_purchased_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes
CREATE INDEX idx_waitlist_email ON waitlist(email);
CREATE INDEX idx_waitlist_has_ticket ON waitlist(has_ticket);

-- Grant permissions (adjust if needed)
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Optional: Create a policy to allow all operations (adjust based on your security needs)
CREATE POLICY "Allow all operations on waitlist" ON waitlist
  FOR ALL
  USING (true)
  WITH CHECK (true);

