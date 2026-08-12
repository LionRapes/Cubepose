import { useCallback, useRef } from 'react';

export function useThrottle<T extends (...args: any[]) => void>(
  fn: T,
  delay: number
): T {
  const lastCall = useRef(0);
  const pendingArgs = useRef<any[]>(null);
  const timeoutId = useRef<number>(null);

  return useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    
    if (now - lastCall.current >= delay) {
      fn(...args);
      lastCall.current = now;
      pendingArgs.current = null;
    } else {
      pendingArgs.current = args;
      
      if (!timeoutId.current) {
        timeoutId.current = setTimeout(() => {
          if (pendingArgs.current) {
            fn(...pendingArgs.current);
            pendingArgs.current = null;
          }
          timeoutId.current = null;
        }, delay - (now - lastCall.current));
      }
    }
  }, [fn, delay]) as T;
}