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

export async function getFavicon(url: string) {
  try {
    // Extract the base URL
    const urlObj = new URL(url);
    const baseUrl = `${urlObj.protocol}//${urlObj.hostname}`;
    
    // Try different favicon paths
    const faviconPaths = [
      '/favicon.ico',
      '/favicon.png',
      '/favicon.svg',
      '/assets/favicon.ico',
      '/assets/favicon.png',
      '/assets/favicon.svg'
    ];

    // Try each path until we find a valid favicon
    for (const path of faviconPaths) {
      try {
        const response = await fetch(baseUrl + path);
        if (response.ok) {
          return baseUrl + path;
        }
      } catch (error) {
        continue;
      }
    }

    // If no favicon found in common paths, try to parse the HTML and find the favicon link
    const response = await fetch(baseUrl);
    const html = await response.text();
    const faviconMatch = html.match(/<link[^>]*rel=["'](?:shortcut )?icon["'][^>]*href=["']([^"']+)["'][^>]*>/i);
    
    if (faviconMatch && faviconMatch[1]) {
      const faviconUrl = faviconMatch[1];
      // Handle relative URLs
      return faviconUrl.startsWith('http') ? faviconUrl : new URL(faviconUrl, baseUrl).href;
    }

    throw new Error('No favicon found');
  } catch (error) {
    console.error('Error getting favicon:', error);
    throw error;
  }
}
