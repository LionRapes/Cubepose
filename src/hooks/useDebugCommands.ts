import { useEffect } from 'react';

export function useDebugCommands(
  commands: Record<string, (...args: any[]) => void>,
  enabled: boolean = import.meta.env.MODE === 'development'
) {
  useEffect(() => {
    if (!enabled) return;
    
    Object.entries(commands).forEach(([name, fn]) => {
      (window as any)[name] = fn;
    });
    
    console.log('Debug commands:', Object.keys(commands).join(', '));
    
    return () => {
      Object.keys(commands).forEach((name) => {
        delete (window as any)[name];
      });
    };
  }, [enabled, commands]);
}