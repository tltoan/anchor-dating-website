-- Create events table in Supabase
-- Run this in your Supabase SQL Editor

CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on date for faster queries
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date);

-- Enable Row Level Security (RLS)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read events (authenticated users)
CREATE POLICY "Anyone can read events" ON events
  FOR SELECT
  USING (true);

-- Optional: Create policy to allow authenticated users to insert events (for admin use)
-- CREATE POLICY "Authenticated users can insert events" ON events
--   FOR INSERT
--   WITH CHECK (auth.role() = 'authenticated');

-- Optional: Create policy to allow authenticated users to update events (for admin use)
-- CREATE POLICY "Authenticated users can update events" ON events
--   FOR UPDATE
--   USING (auth.role() = 'authenticated');

-- Example: Insert a sample event
-- INSERT INTO events (title, description, date, location, price, image_url)
-- VALUES (
--   'NYC Launch Concert',
--   'Join us for an unforgettable night of music and connection. Experience the magic of Anchor Dating with live performances, networking opportunities, and exclusive access to our community.',
--   '2024-12-31 20:00:00+00',
--   'New York City, NY',
--   29.99,
--   '/anchor-landing-bg.jpg'
-- );
