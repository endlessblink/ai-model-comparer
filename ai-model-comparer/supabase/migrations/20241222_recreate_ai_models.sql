-- Drop the existing table
DROP TABLE IF EXISTS ai_models;

-- Recreate the table with all columns
CREATE TABLE ai_models (
    id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    description text NOT NULL,
    features text NOT NULL,
    pros text NOT NULL,
    cons text NOT NULL,
    tags text[] DEFAULT '{}'::text[],
    pricing_model text CHECK (pricing_model IN ('free', 'freemium', 'paid', 'enterprise')) NOT NULL,
    pricing_type text CHECK (pricing_type IN ('one-time', 'subscription', 'usage-based')) NOT NULL,
    api_available boolean DEFAULT false NOT NULL
);
