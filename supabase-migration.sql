-- Migration script to add missing columns to waitlist table
-- Run this in your Supabase SQL Editor
-- This script is safe to run multiple times

-- Add payment_intent_id column if it doesn't exist (text, nullable)
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS payment_intent_id TEXT;

-- Add has_ticket column (boolean, default false)
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS has_ticket BOOLEAN DEFAULT false;

-- Add ticket_purchased_at column (timestamp, nullable)
ALTER TABLE waitlist 
ADD COLUMN IF NOT EXISTS ticket_purchased_at TIMESTAMP WITH TIME ZONE;

-- Optional: Add index on has_ticket for faster queries
CREATE INDEX IF NOT EXISTS idx_waitlist_has_ticket ON waitlist(has_ticket);

-- Optional: Add index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

