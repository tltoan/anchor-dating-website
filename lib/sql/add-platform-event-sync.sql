-- Add platform event sync columns to events table
-- Syncs live events from platform_sponsored_events (Anchor org) to website events
-- Run in Supabase SQL Editor

-- Link to source platform event (nullable for manually-created website events)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS platform_sponsored_event_id UUID UNIQUE;

-- Hide synced events from listing when platform status leaves "live" (preserves ticket refs)
ALTER TABLE events
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN DEFAULT false;

CREATE INDEX IF NOT EXISTS idx_events_platform_sponsored_event_id
  ON events(platform_sponsored_event_id) WHERE platform_sponsored_event_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_events_is_hidden
  ON events(is_hidden) WHERE is_hidden = true;

COMMENT ON COLUMN events.platform_sponsored_event_id IS 'Source event from platform_sponsored_events when synced from Anchor org';
COMMENT ON COLUMN events.is_hidden IS 'Hide from listing when platform event leaves live status';
