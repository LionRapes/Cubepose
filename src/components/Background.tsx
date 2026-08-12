import { BACKGROUND_COLORS } from '../config/colors';

import vertexShader from '../shaders/vertex/background.vert.glsl';
import { useEffect, useMemo } from 'react';
import { EasingName } from '../utils/easings';
import { useDebugCommands } from '../hooks/useDebugCommands';
import { ReadonlyVector3Tuple } from '../types';
import { useBackgroundTransition } from '../hooks/useBackgroundTransition';
import { useGradientMaterial } from '../hooks/useGradientMaterial';
import { backgroundEvents } from '../utils/backgroundEvents';
import { Color } from 'three';

interface BackgroundProps {
  width?: number;
  height?: number;
  position?: ReadonlyVector3Tuple;
  colors?: typeof BACKGROUND_COLORS;
}

export function Background({
  width = 2, 
  height = 2, 
  position = [0, 0, 0],
  colors = BACKGROUND_COLORS
}: BackgroundProps) {
  const { stateValues, stateKeys } = useMemo(() => ({
    stateValues: Object.values(colors),
    stateKeys: Object.keys(colors)
  }), [colors]);
  
  const { getOpacity, isAnimating, switchTo, flick } = useBackgroundTransition();

  useEffect(() => {
    return backgroundEvents.subscribe((cmd) => {
      switch(cmd.type) {
        case 'switch':
          switchTo(cmd.index, cmd.duration, cmd.ease);
          break;
        case 'flick':
          flick(cmd.index, cmd.appearDuration, cmd.disappearDuration, cmd.appearEase, cmd.disappearEase, cmd.holdDelay);
          break;
      }
    });
  }, [switchTo, flick]);

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
          <BackgroundLayer
            key={index}
            colors={stateColors}
            opacity={opacity}
            vertexShader={vertexShader}
            width={width}
            height={height}
            position={position}
            rotation={[-Math.PI / 2, 0, 0]}
          />
        );
      })}
    </>
  );
}


function BackgroundLayer({
  colors,
  opacity,
  vertexShader,
  width,
  height,
  position,
  rotation,
}: {
  colors: readonly Color[];
  opacity: number;
  vertexShader: string;
  width: number;
  height: number;
  position: ReadonlyVector3Tuple;
  rotation: ReadonlyVector3Tuple;
}) {
  const material = useGradientMaterial({
    colors,
    vertexShader,
    uniforms: { uOpacity: { value: opacity } },
    opacity,
    transparent: true,
    depthWrite: true,
  });
  if (!material) return null;

  return (
    <mesh position={position} rotation={rotation} renderOrder={-1} frustumCulled={false}>
      <planeGeometry args={[width, height]} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}