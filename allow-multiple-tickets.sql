-- Allow multiple tickets per user by removing UNIQUE constraint on email
-- Run this in Supabase SQL Editor

-- Remove unique constraint on email to allow multiple ticket entries
ALTER TABLE waitlist DROP CONSTRAINT IF EXISTS waitlist_email_key;

-- Optional: Add index on email for faster lookups (non-unique)
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);

-- Optional: Add index on phone for faster ticket lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_phone ON waitlist(phone);

-- Optional: Add index on has_ticket for faster filtering
CREATE INDEX IF NOT EXISTS idx_waitlist_has_ticket ON waitlist(has_ticket);

