-- Fix for ERROR: 23514 check constraint violation
-- Run this in Supabase SQL Editor

-- 1. First, temporarily drop the constraint if it exists
ALTER TABLE tickets DROP CONSTRAINT IF EXISTS check_ticket_status;

-- 2. Ensure the status column exists
ALTER TABLE tickets ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'purchased';

-- 3. Update any existing rows with invalid status values to 'purchased'
-- This fixes the error where existing rows have values like 'pending' or NULL
UPDATE tickets 
SET status = 'purchased' 
WHERE status NOT IN ('purchased', 'checked_in', 'cancelled', 'refunded') 
   OR status IS NULL;

-- 4. Now safely add the constraint
ALTER TABLE tickets 
ADD CONSTRAINT check_ticket_status 
CHECK (status IN ('purchased', 'checked_in', 'cancelled', 'refunded'));

-- 5. Ensure the index exists
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
