-- Create models table
CREATE TABLE IF NOT EXISTS models (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    features TEXT[] NOT NULL DEFAULT '{}',
    pricing JSONB NOT NULL DEFAULT '{}'::jsonb,
    pros TEXT[] NOT NULL DEFAULT '{}',
    cons TEXT[] NOT NULL DEFAULT '{}',
    use_cases TEXT[] NOT NULL DEFAULT '{}',
    alternatives TEXT[] NOT NULL DEFAULT '{}',
    source_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_models_updated_at
    BEFORE UPDATE ON models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE models ENABLE ROW LEVEL SECURITY;

-- Allow anonymous read access
CREATE POLICY "Allow anonymous read access"
    ON models FOR SELECT
    TO anon
    USING (true);

-- Allow authenticated users to insert
CREATE POLICY "Allow authenticated create"
    ON models FOR INSERT
    TO authenticated
    WITH CHECK (true);

-- Allow authenticated users to update their own records
CREATE POLICY "Allow authenticated update own records"
    ON models FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by)
    WITH CHECK (auth.uid() = created_by);
