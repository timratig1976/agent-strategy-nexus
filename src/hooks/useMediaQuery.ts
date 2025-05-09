
import { useState, useEffect } from 'react';

/**
 * A hook for responsive design that detects if a media query matches.
 * 
 * @param query - The media query to check
 * @returns Whether the media query matches
 */
export const useMediaQuery = (query: string): boolean => {
  // Initialize with null to avoid hydration mismatch
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    // Check if window exists (for SSR)
    if (typeof window === 'undefined') return;
    
    const mediaQuery = window.matchMedia(query);
    
    // Set the initial value
    setMatches(mediaQuery.matches);
    
    // Create an event listener
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    
    // Add the listener to the media query
    mediaQuery.addEventListener('change', handler);
    
    // Remove the listener when the component is unmounted
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};
