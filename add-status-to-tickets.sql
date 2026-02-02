-- Add status column to tickets table for check-in functionality
-- Run this in Supabase SQL Editor

-- Add status column if it doesn't exist
ALTER TABLE tickets 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'purchased';

-- Add check constraint for status values
ALTER TABLE tickets 
ADD CONSTRAINT check_ticket_status 
CHECK (status IN ('purchased', 'checked_in', 'cancelled', 'refunded'));

-- Create index on status for filtering
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
