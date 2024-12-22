-- Add missing columns to ai_models table
ALTER TABLE ai_models
ADD COLUMN IF NOT EXISTS pricing_model text CHECK (pricing_model IN ('free', 'freemium', 'paid', 'enterprise')),
ADD COLUMN IF NOT EXISTS pricing_type text CHECK (pricing_type IN ('one-time', 'subscription', 'usage-based')),
ADD COLUMN IF NOT EXISTS api_available boolean DEFAULT false;
