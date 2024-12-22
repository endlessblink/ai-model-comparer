-- Add featured column to ai_models table
ALTER TABLE ai_models
ADD COLUMN featured BOOLEAN DEFAULT false;
