import { useGradientMaterial } from '../hooks/useGradientMaterial';

interface GradientTextureShapeProps {
  colors: readonly string[];
  size?: number | [number, number, number] | [number, number];
  position?: [number, number, number];
  rotation?: [number, number, number];
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Record<string, any>;
  opacity?: number;
  transparent?: boolean;
  depthWrite?: boolean;
  renderOrder?: number;
}

export function GradientTexturePlane({ 
  colors,
  size = 8,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  vertexShader,
  fragmentShader,
  uniforms,
  opacity,
  transparent,
  depthWrite,
  renderOrder = 0
}: GradientTextureShapeProps) {
  const texture = useGradientMaterial({colors, vertexShader, fragmentShader, uniforms, opacity, transparent, depthWrite});
  if (!texture) return null;
  const [w, h] = typeof size === 'number' ? [size, size] : size;
  
  return (
    <mesh position={position} rotation={rotation} renderOrder={renderOrder}>
      <planeGeometry args={[w, h]}/>
      <primitive object={texture} attach="material"/>
    </mesh>
  );
}


export function GradientTextureCube({ 
  colors,
  size = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  vertexShader,
  fragmentShader,
  uniforms,
  opacity,
  transparent,
  depthWrite
}: GradientTextureShapeProps) {
  const texture = useGradientMaterial({colors, vertexShader, fragmentShader, uniforms, opacity, transparent, depthWrite});
  if (!texture) return null;
  const [w, h, d] = typeof size === 'number' ? [size, size, size] : size;
  
  return (
    <mesh position={position} rotation={rotation}>
      <boxGeometry args={[w, h, d]} />
      <primitive object={texture} attach="material" />
    </mesh>
  );
}