import { GradientTexture } from './GradientTexture';
import { BACKGROUND_COLORS } from '../config/colors';

import vertexShader from '../shaders/vertex/background.vert.glsl';
import { useCallback, useMemo, useRef, useState } from 'react';
import { EasingName, getEasing } from '../utils/easings';
import { useAnimation } from '../hooks/useAnimation';
import { useDebugCommands } from '../hooks/useDebugCommands';

interface BackgroundProps {
  width?: number;
  height?: number;
  position?: [number, number, number];
  colors?: typeof BACKGROUND_COLORS;
}

export function Background({
  width = 2, 
  height = 2, 
  position = [0, 0, 0],
  colors = BACKGROUND_COLORS
}: BackgroundProps) {
  const stateValues = Object.values(colors);
  const stateKeys = Object.keys(colors);
  

  const [currentStateIndex, setCurrentStateIndex] = useState(0);
  const previousStateIndexRef = useRef(0);
  const easeRef = useRef<EasingName>('linear');
  const flickTimeoutRef = useRef<number | null>(null);

  const { isAnimating, progress, start } = useAnimation();

  const switchTo = useCallback((index: number, duration?: number, ease: EasingName = 'linear') => {
    if (isAnimating) return;
    
    easeRef.current = ease;
    setCurrentStateIndex((prev) => {
      previousStateIndexRef.current = prev;
      return index;
    });
    
    start(duration);
  }, [isAnimating, currentStateIndex, start]);

  const flick = useCallback((
    targetIndex: number,
    appearDuration: number = 1,
    disappearDuration: number = 1,
    appearEase?: EasingName,
    disappearEase?: EasingName,
    holdDelay: number = 1.0
  ) => {
    if (flickTimeoutRef.current) {
      clearTimeout(flickTimeoutRef.current);
      flickTimeoutRef.current = null;
    }

    if (isAnimating) return;

    const originalIndex = currentStateIndex;
    switchTo(targetIndex, appearDuration, appearEase);

    const totalDelay = (appearDuration + holdDelay) * 1000;
    flickTimeoutRef.current = setTimeout(() => {
      switchTo(originalIndex, disappearDuration, disappearEase);
      flickTimeoutRef.current = null;
    }, totalDelay);

  }, [isAnimating, currentStateIndex, switchTo]);
  
  
  const getOpacity = useCallback((index: number) => {
    if (!isAnimating) return index === currentStateIndex ? 1 : 0;
    const easedProgress = getEasing(easeRef.current)(progress);
    return index === currentStateIndex 
      ? easedProgress 
      : index === previousStateIndexRef.current 
        ? 1 - easedProgress 
        : 0;
  }, [isAnimating, progress, currentStateIndex]);
  

  useDebugCommands( useMemo(() => ({
    bg: (index: number, duration?: number, ease?: EasingName) => {
      if (index < 0 || index >= stateKeys.length) { console.error(`Invalid index: ${index}.`); return; }
      if (isAnimating) { console.warn('Animation in progress..'); return; }
      switchTo(index, duration, ease)
      console.log(`Switching to state ${index} (${stateKeys[index]}) in ${duration ?? 1}s by ${ease ?? 'linear'}`);
    }, flick: (index: number, appearDuration?: number, disappearDuration?: number, appearEase?: EasingName, disappearEase?: EasingName, holdDelay?: number) => {
      if (index < 0 || index >= stateKeys.length) { console.error(`Invalid index: ${index}.`); return; }
      if (isAnimating) { console.warn('Animation in progress..'); return; }
      flick(index, appearDuration, disappearDuration, appearEase, disappearEase, holdDelay ?? 1.0);
      console.log(`Flick to ${index} (${stateKeys[index]}) for ${holdDelay ?? 1.0}s`);
    }
  }), [isAnimating, flick, switchTo]));


  return (
    <>
      {stateValues.map((stateColors, index) => {
        
        const opacity = getOpacity(index);
        if (opacity === 0) return null;

        return (
          <GradientTexture
            key={index}
            colors={stateColors}
            width={width}
            height={height}
            position={position}
            rotation={[-Math.PI / 2, 0, 0]}
            vertexShader={vertexShader}
            transparent={true}
            uniforms={{ uOpacity: { value: opacity } }}
          />
        );
      })}
    </>
  );
}