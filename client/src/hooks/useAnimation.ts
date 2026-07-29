import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

interface UseAnimationOptions {
  onStart?: () => void;
  onComplete?: () => void;
}

export function useAnimation(options?: UseAnimationOptions) {
  const { onStart, onComplete } = options ?? {};
  const [isAnimating, setIsAnimating] = useState(false);
  const durationRef = useRef(1);
  const [progress, setProgress] = useState(0);

  const start = useCallback((duration?: number) => {
    if (isAnimating) return;
    durationRef.current = duration ?? 1;

    setIsAnimating(true);
    setProgress(0);
    onStart?.();
  }, [isAnimating, onStart]);

  useFrame((_, delta) => {
    if (!isAnimating) return;

    setProgress((prev) => {
      const next = prev + delta / durationRef.current;
      if (next >= 1) {
        setIsAnimating(false);
        onComplete?.();
        return 1;
      }
      return next;
    });
  });

  return {
    isAnimating,
    start,
    progress
  };
}