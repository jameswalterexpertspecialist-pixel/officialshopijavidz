import { useEffect, useState, useCallback } from 'react';

export function useHashRoute() {
  const [route, setRoute] = useState(() => window.location.hash.slice(1) || '/');

  useEffect(() => {
    const onChange = () => {
      setRoute(window.location.hash.slice(1) || '/');
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    };
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((to: string) => {
    window.location.hash = to;
  }, []);

  return { route, navigate };
}

export function parseRoute(route: string): { segments: string[] } {
  const [pathPart] = route.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  return { segments };
}
