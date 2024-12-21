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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadFavicon = async () => {
            try {
                setIsLoading(true);
                setError(false);
                const favicon = await getFaviconForModel({ name, url });
                if (mounted) {
                    setFaviconUrl(favicon);
                    setError(false);
                }
            } catch (err) {
                console.error('Error loading favicon:', err);
                if (mounted) {
                    setError(true);
                }
            } finally {
                if (mounted) {
                    setIsLoading(false);
                }
            }
        };

        loadFavicon();

        return () => {
            mounted = false;
        };
    }, [name, url]);

    if (isLoading) {
        return (
            <div 
                className={cn(
                    "animate-pulse bg-gray-700 rounded-lg",
                    className
                )} 
                style={{ width: size, height: size }}
            />
        );
    }

    if (!faviconUrl || error) {
        // Return fallback icon
        return (
            <div 
                className={cn(
                    "flex items-center justify-center bg-gray-800 rounded-lg text-white font-bold",
                    className
                )}
                style={{ width: size, height: size }}
            >
                {name.substring(0, 1).toUpperCase()}
            </div>
        );
    }

    return (
        <img
            src={faviconUrl}
            alt={`${name} icon`}
            className={cn("rounded-lg object-contain", className)}
            style={{ width: size, height: size }}
            onError={() => setError(true)}
        />
    );
};

export default ModelFavicon;
