import { useRef, useState, useCallback } from 'react';
import { useFrame } from '@react-three/fiber';

interface UseAnimationOptions {
  onStart?: () => void;
  onComplete?: () => void;
}

export function useAnimation({
  onStart,
  onComplete,
}: UseAnimationOptions = {}) {
  const [isAnimating, setIsAnimating] = useState(false);
  const durationRef = useRef(1);
  const progressRef = useRef(0);
  const [, forceUpdate] = useState(0);

  const start = useCallback((duration?: number) => {
    if (isAnimating) return;
    durationRef.current = duration ?? 1;

    setIsAnimating(true);
    progressRef.current = 0;
    onStart?.();
  }, [isAnimating, onStart]);

  const complete = useCallback(() => {
    setIsAnimating(false);
    onComplete?.();
  }, [isAnimating, onComplete]);


  useFrame((_, delta) => {
    if (!isAnimating) return;

    progressRef.current = Math.min(progressRef.current + delta / durationRef.current, 1);
    forceUpdate((prev) => prev + 1);

    if (progressRef.current >= 1) complete();
  });

  return {
    isAnimating,
    start,
    progress: progressRef.current,
  };
}