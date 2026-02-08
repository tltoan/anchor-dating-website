-- Add created_by to events table (owner = user from main app users table)
-- Run in Supabase SQL Editor after create-events-table.sql and add-is-admin-to-users.sql

-- Add created_by column (nullable for existing rows)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id);

-- Index for filtering events by owner (admin "my events" view)
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
