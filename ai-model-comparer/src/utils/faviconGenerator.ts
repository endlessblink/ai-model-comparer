interface AIModel {
    name: string;
    url?: string;
}

export const generateVectorFavicon = (name: string): string => {
    // Get initials
    const initials = name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();

    // Generate SVG with gradient background
    const svg = `
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#2a2a2a;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#1f1f1f;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#grad)"/>
            <text 
                x="16" 
                y="16" 
                font-family="Arial, sans-serif" 
                font-size="14" 
                font-weight="bold" 
                fill="#ffffff"
                text-anchor="middle" 
                dominant-baseline="central"
                style="letter-spacing: -0.5px"
            >
                ${initials}
            </text>
        </svg>
    `.trim();

    // Convert to data URL
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

export const getFaviconUrl = (url: string): string => {
    try {
        const domain = new URL(url).hostname;
        return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
        return '';
    }
};

export const getFaviconForModel = async (model: AIModel): Promise<string> => {
    if (model.url) {
        const faviconUrl = getFaviconUrl(model.url);
        if (faviconUrl) return faviconUrl;
    }
    
    return generateVectorFavicon(model.name);
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
