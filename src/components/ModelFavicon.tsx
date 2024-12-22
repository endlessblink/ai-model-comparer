interface ModelFaviconProps {
  name: string;
  url: string;
  size?: number;
  className?: string;
}

export default function ModelFavicon({ name, url, size = 32, className = '' }: ModelFaviconProps) {
  const getFavicon = (url: string): string => {
    // Remove protocol and trailing slash
    const cleanUrl = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    
    // Use DuckDuckGo's service for better compatibility
    return `https://icons.duckduckgo.com/ip3/${cleanUrl}.ico`;
  };

  return (
    <img 
      src={getFavicon(url)}
      alt={name}
      width={size}
      height={size}
      className={className}
      loading="lazy"
    />
  );
} 