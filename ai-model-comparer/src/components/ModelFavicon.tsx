import { useState } from 'react';

interface ModelFaviconProps {
  name: string;
  url?: string;
  size?: number;
  className?: string;
}

export const ModelFavicon = ({ name, url, size = 32, className = '' }: ModelFaviconProps) => {
  const [fallbackToGoogle, setFallbackToGoogle] = useState(false);
  const [error, setError] = useState(false);
  
  const getFavicon = (url: string | undefined, useFallback = false): string => {
    if (!url) {
      return `data:image/svg+xml,${encodeURIComponent(
        `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="${size}" height="${size}" rx="8" fill="#374151"/>
          <text x="50%" y="50%" font-family="system-ui" font-size="${size/2}px" fill="#9CA3AF" dominant-baseline="middle" text-anchor="middle">
            ${name.charAt(0).toUpperCase()}
          </text>
        </svg>`
      )}`;
    }
    
    // Remove protocol and trailing slash
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    if (useFallback) {
      // Use Google's service as fallback
      return `https://www.google.com/s2/favicons?domain=${cleanUrl}&sz=${size}`;
    }
    
    // Use DuckDuckGo's service as primary
    return `https://icons.duckduckgo.com/ip3/${cleanUrl}.ico`;
  };

  const handleError = () => {
    if (!fallbackToGoogle) {
      setFallbackToGoogle(true);
    } else {
      setError(true);
    }
  };

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-700 rounded-lg ${className}`}
        style={{ width: size, height: size }}
      >
        <span className="text-gray-300 text-xs font-medium">
          {name.charAt(0).toUpperCase()}
        </span>
      </div>
    );
  }

  return (
    <img 
      src={getFavicon(url, fallbackToGoogle)}
      alt={name}
      width={size}
      height={size}
      className={`rounded-lg transition-all duration-300 ${className}`}
      loading="lazy"
      onError={handleError}
    />
  );
};
