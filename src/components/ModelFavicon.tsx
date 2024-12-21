interface ModelFaviconProps {
  name: string;
  url: string;
  size?: number;
  className?: string;
}

export default function ModelFavicon({ name, url, size = 32, className = '' }: ModelFaviconProps) {
  return (
    <img 
      src={`/model-favicons/${name.toLowerCase().replace(/\s+/g, '-')}.png`}
      alt={name}
      width={size}
      height={size}
      className={className}
    />
  );
} 