import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function updateSchema() {
  try {
    // Drop existing table if it exists
    const dropTableQuery = `DROP TABLE IF EXISTS ai_models;`;
    
    // Create new table
    const createTableQuery = `
      CREATE TABLE ai_models (
        id bigint primary key generated always as identity,
        name text not null,
        description text not null,
        features text[] default '{}',
        pricing jsonb,
        pros text[] default '{}',
        cons text[] default '{}',
        use_cases text[] default '{}',
        alternatives text[] default '{}',
        last_updated date,
        created_at timestamp with time zone default timezone('utc'::text, now()),
        updated_at timestamp with time zone default timezone('utc'::text, now()),
        category text,
        api_available boolean default false
      );
    `;

    // Execute queries
    const { error: dropError } = await supabase.from('_sql').select('*').eq('query', dropTableQuery);
    if (dropError) throw dropError;

    const { error: createError } = await supabase.from('_sql').select('*').eq('query', createTableQuery);
    if (createError) throw createError;

    console.log('Schema updated successfully!');
  } catch (error) {
    console.error('Error updating schema:', error);
  }
}

updateSchema();
