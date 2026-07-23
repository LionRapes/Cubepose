import { GradientTexture } from './GradientTexture';
import { BACKGROUND_COLOR } from '../config/colors';

import vertexShader from '../shaders/vertex/background.vert.glsl';

interface BackgroundProps {
  width?: number;
  height?: number;
  position?: [number, number, number];
  colors?: string[];
}

export function Background({ 
  width = 2, 
  height = 2, 
  position = [0, 0, 0],
  colors = BACKGROUND_COLOR
}: BackgroundProps) {
  return (
    <GradientTexture 
      colors={colors}
      width={width}
      height={height}
      position={position}
      rotation={[-Math.PI / 2, 0, 0]}
      vertexShader={vertexShader}
    />
  );
}