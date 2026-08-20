import { useEffect, useState } from 'react';

type RouteListener = (path: string) => void;
const listeners = new Set<RouteListener>();

function currentPath() {
  const hash = window.location.hash.replace(/^#/, '');
  return hash || '/';
}

export function navigate(path: string) {
  window.location.hash = path;
}

if (typeof window !== 'undefined') {
  window.addEventListener('hashchange', () => {
    const path = currentPath();
    listeners.forEach((l) => l(path));
  });
}

export function useRouter() {
  const [path, setPath] = useState<string>(() => (typeof window !== 'undefined' ? currentPath() : '/'));

  useEffect(() => {
    const l: RouteListener = (p) => setPath(p);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);

  return path;
}
