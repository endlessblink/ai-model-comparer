-- Add tags column to ai_models table
ALTER TABLE ai_models
ADD COLUMN IF NOT EXISTS tags text[] DEFAULT '{}'::text[];
