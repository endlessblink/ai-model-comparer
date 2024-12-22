interface GenerateModelContentProps {
  modelName: string;
  modelUrl: string;
  category: string;
}

export async function generateModelContent({ 
  modelName, 
  modelUrl, 
  category 
}: GenerateModelContentProps) {
  try {
    const response = await fetch('http://localhost:3001/api/generate-content', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelName,
        modelUrl,
        category
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Failed to generate content');
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating model content:', error);
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
