import { useGradientTexture } from '../hooks/useTexture';
import defaultVertexShader from '../shaders/vertex/default.vert.glsl';
import defaultFragmentShader from '../shaders/fragment/default.frag.glsl';

interface GradientTextureProps {
  colors: readonly string[];
  width?: number;
  height?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Record<string, any>;
  opacity?: number;
  transparent?: boolean;
}

export function GradientTexture({ 
  colors, 
  width = 2, 
  height = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  vertexShader,
  fragmentShader,
  uniforms,
  opacity = 1,
  transparent = false
}: GradientTextureProps) {
  const texture = useGradientTexture(colors);
  if (!texture) return null;
  
  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      {vertexShader || fragmentShader ? (
        <shaderMaterial
          uniforms={{...uniforms, uTexture: { value: texture }}}
          vertexShader={vertexShader || defaultVertexShader}
          fragmentShader={fragmentShader || defaultFragmentShader}
          transparent={transparent}
          depthWrite={false}
        />
      ) : (
        <meshBasicMaterial map={texture} transparent={transparent} opacity={opacity} depthWrite={false}/>
      )}
    </mesh>
  );
}