interface AIModel {
    name: string;
    url?: string;
}

// Map of domains to their icon paths
const FAVICON_MAP: Record<string, string> = {
  'github.com': '/icons/github.svg',
  'aws.amazon.com': '/icons/aws.svg',
  'www.midjourney.com': '/icons/midjourney.svg',
  'www.craiyon.com': '/icons/craiyon.svg',
  'www.openai.com': '/icons/openai.svg',
  'www.anthropic.com': '/icons/anthropic.svg',
  'elevenlabs.io': '/icons/elevenlabs.svg',
  'mubert.com': '/icons/mubert.svg',
  'runwayml.com': '/icons/runway.svg',
  'www.synthesia.io': '/icons/synthesia.svg',
  'www.blender.org': '/icons/blender.svg'
}

// Default icon to use if no match is found
const DEFAULT_ICON = '/icons/default.svg'

export const generateVectorFavicon = (name: string): string => {
    // Get initials
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    // Generate SVG with gradient background and better cross-browser support
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <defs>
                <linearGradient id="grad${initials}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#2a2a2a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1f1f1f;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#grad${initials})"/>
            <text 
                x="50%" 
                y="50%" 
                font-family="system-ui, -apple-system, Arial, sans-serif" 
                font-size="14" 
                font-weight="bold" 
                fill="#ffffff"
                text-anchor="middle" 
                alignment-baseline="central"
                style="letter-spacing: -0.5px"
            >
                ${initials}
            </text>
        </svg>
    `.trim();

    try {
        // Convert to data URL with proper encoding
        const encoded = btoa(unescape(encodeURIComponent(svg)));
        return `data:image/svg+xml;base64,${encoded}`;
    } catch (error) {
        console.error('Error generating vector favicon:', error);
        return '';
    }
};

export function getFaviconUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.toLowerCase()
    return FAVICON_MAP[domain] || DEFAULT_ICON
  } catch {
    return DEFAULT_ICON
  }
}

export function extractDomainFromUrl(url: string): string {
  try {
    const domain = new URL(url).hostname.toLowerCase()
    // Remove 'www.' if present
    return domain.startsWith('www.') ? domain.slice(4) : domain
  } catch {
    return url
  }
}

export const getFaviconForModel = async ({ name, url }: AIModel): Promise<string> => {
    if (url) {
        try {
            const faviconUrl = getFaviconUrl(url);
            if (faviconUrl) return faviconUrl;
        } catch (error) {
            console.error('Error fetching favicon:', error);
        }
    }
    
    // Fallback to vector favicon
    return generateVectorFavicon(name);
};

export const aiModels = {
    threeD: [
        { name: 'Point-E', url: 'https://github.com/openai/point-e' },
        { name: 'Blender AI', url: 'https://www.blender.org' }
    ],
    video: [
        { name: 'Synthesia', url: 'https://www.synthesia.io' },
        { name: 'Runway', url: 'https://runwayml.com' }
    ],
    audio: [
        { name: 'Mubert', url: 'https://mubert.com' },
        { name: 'ElevenLabs', url: 'https://elevenlabs.io' }
    ]
};
