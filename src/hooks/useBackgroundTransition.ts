import { useState, useRef, useCallback } from 'react';
import { useAnimation } from './useAnimation';
import { EasingName, getEasing } from '../utils/easings';

export function useBackgroundTransition() {
  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const previousStateIndexRef = useRef(0);
  const easeRef = useRef<EasingName>('linear');
  const flickTimeoutRef = useRef<number | null>(null);

  const { isAnimating, progress, start } = useAnimation();

  const switchTo = useCallback(
    (index: number, duration?: number, ease: EasingName = 'linear') => {
      if (isAnimating) return;
      easeRef.current = ease;
      setCurrentStateIndex((prev) => {
        previousStateIndexRef.current = prev;
        return index;
      });
      start(duration);
    },
    [isAnimating, start]
  );

  const flick = useCallback(
    (
      targetIndex: number,
      appearDuration = 1,
      disappearDuration = 1,
      appearEase?: EasingName,
      disappearEase?: EasingName,
      holdDelay = 1.0
    ) => {
      if (flickTimeoutRef.current) {
        clearTimeout(flickTimeoutRef.current);
        flickTimeoutRef.current = null;
      }
      if (isAnimating) return;

      const originalIndex = currentStateIndex;
      switchTo(targetIndex, appearDuration, appearEase);

      const totalDelay = (appearDuration + holdDelay) * 1000;
      flickTimeoutRef.current = window.setTimeout(() => {
        switchTo(originalIndex, disappearDuration, disappearEase);
        flickTimeoutRef.current = null;
      }, totalDelay);
    },
    [isAnimating, currentStateIndex, switchTo]
  );

  const getOpacity = useCallback(
    (index: number) => {
      if (!isAnimating) return index === currentStateIndex ? 1 : 0;
      const easedProgress = getEasing(easeRef.current)(progress);
      return index === currentStateIndex
        ? easedProgress
        : index === previousStateIndexRef.current
          ? 1 - easedProgress
          : 0;
    },
    [isAnimating, progress, currentStateIndex]
  );

  return {
    currentStateIndex,
    isAnimating,
    getOpacity,
    switchTo,
    flick,
  };
}