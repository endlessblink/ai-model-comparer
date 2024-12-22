interface GenerateModelContentProps {
  prompt: string;
}

import { supabase } from './supabase';

export async function generateModelContent(prompt: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('generate-content', {
      body: { prompt }
    });

    if (error) throw error;
    return data.text;
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

function isFirefox(): boolean {
  if (typeof window !== 'undefined') {
    return navigator.userAgent.toLowerCase().includes('firefox');
  }
  return false;
}

export async function getFavicon(url: string): Promise<string | null> {
  if (!url) return null;

  try {
    // Remove protocol and trailing slash
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Use different services based on browser
    if (isFirefox()) {
      // DuckDuckGo's service works better with Firefox
      return `https://icons.duckduckgo.com/ip3/${cleanUrl}.ico`;
    } else {
      // Google's service for other browsers (Chrome, Safari, Edge)
      return `https://www.google.com/s2/favicons?domain=${cleanUrl}&sz=32`;
    }
  } catch (error) {
    console.error('Error getting favicon:', error);
    return null;
  }
}
