-- =====================================================
-- RAINTREE DASHBOARD - DATABASE SCHEMA UPDATE
-- Run this in your Supabase SQL Editor
-- =====================================================

-- Add new columns to existing plans table
ALTER TABLE plans ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'Personal';
ALTER TABLE plans ADD COLUMN IF NOT EXISTS priority TEXT DEFAULT 'medium';
ALTER TABLE plans ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE plans ADD COLUMN IF NOT EXISTS tasks JSONB DEFAULT '[]'::jsonb;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS files JSONB DEFAULT '[]'::jsonb;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE plans ADD COLUMN IF NOT EXISTS time_spent INTEGER DEFAULT 0;
ALTER TABLE plans ADD COLUMN IF NOT EXISTS recurrence TEXT DEFAULT 'none';

-- Update existing columns if needed (change type to TEXT if it was different)
ALTER TABLE plans ALTER COLUMN type DROP NOT NULL;
ALTER TABLE plans ALTER COLUMN target_value DROP NOT NULL;

-- Create additional indexes for new columns
CREATE INDEX IF NOT EXISTS idx_plans_priority ON plans(priority);
CREATE INDEX IF NOT EXISTS idx_plans_category ON plans(category);
CREATE INDEX IF NOT EXISTS idx_plans_created_at ON plans(created_at DESC);

-- RLS is already enabled from SUPABASE_SETUP.sql
-- Policies already exist for all operations

-- Create function to auto-update last_updated timestamp
CREATE OR REPLACE FUNCTION update_last_updated_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_updated = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update last_updated
DROP TRIGGER IF EXISTS update_plans_last_updated ON plans;
CREATE TRIGGER update_plans_last_updated
    BEFORE UPDATE ON plans
    FOR EACH ROW
    EXECUTE FUNCTION update_last_updated_column();

-- Update existing plans to have default values for new columns
UPDATE plans SET category = 'Personal' WHERE category IS NULL;
UPDATE plans SET priority = 'medium' WHERE priority IS NULL;
UPDATE plans SET tags = '{}' WHERE tags IS NULL;
UPDATE plans SET tasks = '[]'::jsonb WHERE tasks IS NULL;
UPDATE plans SET files = '[]'::jsonb WHERE files IS NULL;
UPDATE plans SET notes = '' WHERE notes IS NULL;
UPDATE plans SET time_spent = 0 WHERE time_spent IS NULL;
UPDATE plans SET recurrence = 'none' WHERE recurrence IS NULL;

-- Add comments for new columns
COMMENT ON COLUMN plans.category IS 'Plan category: Personal, Work, Study, Health, Other';
COMMENT ON COLUMN plans.priority IS 'Priority level: low, medium, high';
COMMENT ON COLUMN plans.tags IS 'Array of tags for categorization';
COMMENT ON COLUMN plans.tasks IS 'JSONB array of task objects with id, title, completed, order fields';
COMMENT ON COLUMN plans.files IS 'JSONB array of file attachment objects';
COMMENT ON COLUMN plans.notes IS 'Additional notes for the plan';
COMMENT ON COLUMN plans.time_spent IS 'Time spent in seconds';
COMMENT ON COLUMN plans.recurrence IS 'Recurrence pattern: none, daily, weekly, monthly, custom';

-- Verification query (run this to check the table structure)
-- SELECT column_name, data_type, column_default 
-- FROM information_schema.columns 
-- WHERE table_name = 'plans' 
-- ORDER BY ordinal_position;
