-- Create updated_at function if not exists
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing models table
DROP TABLE IF EXISTS models;

-- Create profiles table if not exists
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL,
    is_admin BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create ai_models table with new schema
CREATE TABLE IF NOT EXISTS ai_models (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    features TEXT NOT NULL,
    pros TEXT NOT NULL,
    cons TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    pricing_model TEXT NOT NULL,
    pricing_type TEXT NOT NULL,
    api_available BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS update_ai_models_updated_at ON ai_models;

-- Create updated_at trigger for ai_models
CREATE TRIGGER update_ai_models_updated_at
    BEFORE UPDATE ON ai_models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, is_admin)
  VALUES (new.id, new.email, false);
  RETURN new;
END;
$$ language plpgsql security definer;

-- Drop existing trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created on auth.users;

-- Create trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable RLS on both tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow users to read own profile" ON profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON profiles;
DROP POLICY IF EXISTS "Allow public read access to ai_models" ON ai_models;
DROP POLICY IF EXISTS "Allow admins to insert ai_models" ON ai_models;
DROP POLICY IF EXISTS "Allow admins to update ai_models" ON ai_models;
DROP POLICY IF EXISTS "Allow admins to delete ai_models" ON ai_models;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

-- Create policies for ai_models table
CREATE POLICY "Anyone can view models"
  ON ai_models FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Only admins can insert models"
  ON ai_models FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  ));

CREATE POLICY "Only admins can update models"
  ON ai_models FOR UPDATE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  ));

CREATE POLICY "Only admins can delete models"
  ON ai_models FOR DELETE
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE profiles.id = auth.uid()
    AND profiles.is_admin = true
  ));
