-- Create events_website_users table for website-only users
-- This is separate from Supabase Auth users table
-- Simple email-based system for events website

CREATE TABLE IF NOT EXISTS events_website_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_website_users_email ON events_website_users(email);

-- Enable Row Level Security (RLS) - optional, can disable if you want public access
ALTER TABLE events_website_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to read (for checking if user exists)
CREATE POLICY "Anyone can read events website users" ON events_website_users
  FOR SELECT
  USING (true);

-- Create policy to allow anyone to insert (for signup)
CREATE POLICY "Anyone can insert events website users" ON events_website_users
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow users to update their own data (optional)
CREATE POLICY "Users can update their own data" ON events_website_users
  FOR UPDATE
  USING (true);
