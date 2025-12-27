-- Quick fix: Add missing columns to waitlist table
-- Copy and paste this into Supabase SQL Editor and run it

ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS has_ticket BOOLEAN DEFAULT false;
ALTER TABLE waitlist ADD COLUMN IF NOT EXISTS ticket_purchased_at TIMESTAMP WITH TIME ZONE;

