import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log('Initializing Supabase with URL:', supabaseUrl);

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

// Test the connection
supabase.from('ai_models').select('count').single()
  .then(({ error }) => {
    if (error) {
      console.error('Supabase connection error:', error);
    } else {
      console.log('Supabase connection successful');
    }
  });

export interface AIModel {
  id: number
  name: string
  description: string
  category: string
  features: string[]
  disadvantages: string[]
  usage_notes: string
  pricing: string
  api_available: boolean
  last_updated: string
  website_url?: string
  demo_url?: string
  sample_output?: string
  tags: string[]
  pricing_model: 'free' | 'freemium' | 'paid' | 'enterprise'
  pricing_type: 'one-time' | 'subscription' | 'usage-based'
  created_at?: string
  is_deleted?: boolean
}

export async function getModels() {
  try {
    const { data, error } = await supabase
      .from('ai_models')
      .select('*')
      .order('name')
      .eq('is_deleted', false) // Only get non-deleted models
    
    if (error) {
      console.error('Error fetching models:', error)
      throw error
    }
    
    // Ensure arrays are properly initialized
    return (data || []).map(model => ({

      ...model,
      features: model.features || [],
      disadvantages: model.disadvantages || [],
      tags: model.tags || []
    }))
  } catch (err) {
    console.error('Error in getModels:', err)
    return []
  }
}

export async function addModel(model: Omit<AIModel, 'id' | 'created_at'>) {
  try {
    const { data, error } = await supabase
      .from('ai_models')
      .insert([model])
      .select()
    
    if (error) {
      console.error('Error adding model:', error)
      throw error
    }
    
    return data?.[0]
  } catch (err) {
    console.error('Error in addModel:', err)
    throw err
  }
}

export async function updateModel(id: number, updates: Partial<AIModel>) {
  try {
    const { data, error } = await supabase
      .from('ai_models')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) {
      console.error('Error updating model:', error)
      throw error
    }
    
    return data?.[0]
  } catch (err) {
    console.error('Error in updateModel:', err)
    throw err
  }
}

export async function deleteModel(id: number) {
  try {
    const { error } = await supabase
      .from('ai_models')
      .update({ is_deleted: true })
      .eq('id', id)
    
    if (error) {
      console.error('Error deleting model:', error)
      throw error
    }
    
    return true
  } catch (err) {
    console.error('Error in deleteModel:', err)
    throw err
  }
}
