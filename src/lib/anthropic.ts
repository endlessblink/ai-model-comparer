import { supabase } from './supabase'

interface ContentGenerationPayload {
  model: {
    name: string;
    description?: string;
    category?: string;
  };
  options?: {
    maxLength?: number;
    temperature?: number;
  };
}

interface GenerateResponse {
  description: string;
  features: string[];
  useCases: string[];
  specifications: Record<string, any>;
  strengths: string[];
  limitations: string[];
}

export async function generateModelContent(
  model: any,
  options: ContentGenerationPayload['options'] = {}
): Promise<GenerateResponse> {
  // Validate payload before sending
  const payload: ContentGenerationPayload = {
    model: {
      name: model.name,
      description: model.description,
      category: model.category
    },
    options: {
      maxLength: 1000,
      temperature: 0.7,
      ...options
    }
  };

  // Debug logging
  console.log('Sending request with payload:', JSON.stringify(payload, null, 2));

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('API error:', {
        status: response.status,
        statusText: response.statusText,
        data: errorData
      });
      
      // Handle specific error cases
      if (response.status === 400) {
        throw new Error(`Invalid request: ${errorData.error || 'Bad request'}`);
      } else if (response.status === 401) {
        throw new Error('Authentication error - please check API key configuration');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded - please try again later');
      } else {
        throw new Error(errorData.error || 'Failed to generate content');
      }
    }

    const data = await response.json();
    return data;
  } catch (err: any) {
    // Enhanced error logging
    console.error('Content generation failed:', {
      error: err,
      payload: payload,
      modelName: model.name
    });

    // Rethrow with more context
    throw new Error(`Failed to generate content: ${err.message}`);
  }
}

function isFirefox(): boolean {
  if (typeof window !== 'undefined') {
    return navigator.userAgent.toLowerCase().includes('firefox')
  }
  return false
}

export async function getFavicon(url: string): Promise<string | null> {
  if (!url) return null

  try {
    // Remove protocol and trailing slash
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '')
    
    // Use different services based on browser
    if (isFirefox()) {
      // DuckDuckGo's service works better with Firefox
      return `https://icons.duckduckgo.com/ip3/${cleanUrl}.ico`
    } else {
      // Google's service for other browsers (Chrome, Safari, Edge)
      return `https://www.google.com/s2/favicons?domain=${cleanUrl}&sz=32`
    }
  } catch (error) {
    console.error('Error getting favicon:', error)
    return null
  }
}
