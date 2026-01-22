-- Optional: Create events_users table to track events-specific user data
-- This is optional since Supabase Auth already handles user authentication
-- Use this if you need to store additional events-specific user information

CREATE TABLE IF NOT EXISTS events_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_users_user_id ON events_users(user_id);

-- Create index on email for faster lookups
CREATE INDEX IF NOT EXISTS idx_events_users_email ON events_users(email);

-- Enable Row Level Security (RLS)
ALTER TABLE events_users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own data
CREATE POLICY "Users can read their own data" ON events_users
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own data
CREATE POLICY "Users can insert their own data" ON events_users
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own data
CREATE POLICY "Users can update their own data" ON events_users
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Optional: Create a function to automatically create events_users entry when user signs up
-- This can be triggered by a database trigger or called from your application
CREATE OR REPLACE FUNCTION create_events_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO events_users (user_id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', '')
  )
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Optional: Create trigger to automatically create events_users entry
-- Uncomment if you want automatic creation on user signup
-- CREATE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW
--   EXECUTE FUNCTION create_events_user();
