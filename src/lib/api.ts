import { supabase } from './supabase';

// Types
export interface ModelData {
  name: string;
  description?: string;
  category?: string;
  url?: string;
}

export interface GenerateResponse {
  description: string;
  features: string[];
  useCases: string[];
  specifications: Record<string, any>;
  strengths: string[];
  limitations: string[];
}

export interface APIError {
  message: string;
  code: string;
  status: number;
}

// Content Generation
export async function generateModelContent(model: ModelData): Promise<GenerateResponse> {
  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      modelName: model.name,
      description: model.description,
      category: model.category,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to generate content');
  }

  return response.json();
}

// Database Operations
export async function saveModel(model: ModelData) {
  const { data, error } = await supabase
    .from('models')
    .insert([model])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateModel(id: string, updates: Partial<ModelData>) {
  const { data, error } = await supabase
    .from('models')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getModels() {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getModelById(id: string) {
  const { data, error } = await supabase
    .from('models')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

export async function deleteModel(id: string) {
  const { error } = await supabase
    .from('models')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
