-- SAFE FIX: Only add missing columns (use this if table exists but missing columns)
-- Run this in Supabase SQL Editor

-- Check and add columns one by one
DO $$ 
BEGIN
  -- Add name column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist' AND column_name = 'name') THEN
    ALTER TABLE waitlist ADD COLUMN name TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add email column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist' AND column_name = 'email') THEN
    ALTER TABLE waitlist ADD COLUMN email TEXT UNIQUE NOT NULL DEFAULT '';
  END IF;
  
  -- Add phone column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist' AND column_name = 'phone') THEN
    ALTER TABLE waitlist ADD COLUMN phone TEXT NOT NULL DEFAULT '';
  END IF;
  
  -- Add payment_intent_id column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist' AND column_name = 'payment_intent_id') THEN
    ALTER TABLE waitlist ADD COLUMN payment_intent_id TEXT;
  END IF;
  
  -- Add has_ticket column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist' AND column_name = 'has_ticket') THEN
    ALTER TABLE waitlist ADD COLUMN has_ticket BOOLEAN DEFAULT false;
  END IF;
  
  -- Add ticket_purchased_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist' AND column_name = 'ticket_purchased_at') THEN
    ALTER TABLE waitlist ADD COLUMN ticket_purchased_at TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Add created_at column if missing
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'waitlist' AND column_name = 'created_at') THEN
    ALTER TABLE waitlist ADD COLUMN created_at TIMESTAMP WITH TIME ZONE DEFAULT now();
  END IF;
END $$;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_has_ticket ON waitlist(has_ticket);

