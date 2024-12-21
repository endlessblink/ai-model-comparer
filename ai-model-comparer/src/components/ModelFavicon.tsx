import React, { useEffect, useState } from 'react';
import { getFaviconForModel } from '../utils/faviconGenerator';
import { cn } from '@/lib/utils';

interface ModelFaviconProps {
    name: string;
    url?: string;
    size?: number;
    className?: string;
}

export const ModelFavicon: React.FC<ModelFaviconProps> = ({ 
    name, 
    url, 
    size = 32,
    className 
}) => {
    const [faviconUrl, setFaviconUrl] = useState<string>('');
    const [error, setError] = useState(false);

    useEffect(() => {
        const loadFavicon = async () => {
            try {
                const favicon = await getFaviconForModel({ name, url });
                setFaviconUrl(favicon);
                setError(false);
            } catch (err) {
                console.error('Error loading favicon:', err);
                setError(true);
            }
        };

        loadFavicon();
    }, [name, url]);

    if (!faviconUrl || error) {
        return (
            <div 
                className={cn(
                    "flex items-center justify-center text-xs font-medium text-gray-400",
                    className
                )}
                style={{ width: size, height: size }}
            >
                {name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}
            </div>
        );
    }

    return (
        <div 
            className={cn(
                "relative flex items-center justify-center overflow-hidden",
                className
            )}
            style={{ width: size, height: size }}
        >
            <img
                src={faviconUrl}
                alt={`${name} favicon`}
                className="w-full h-full object-contain p-1"
                onError={() => setError(true)}
                loading="lazy"
            />
        </div>
    );
};

export default ModelFavicon;
