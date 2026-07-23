import { useGradientTexture } from '../hooks/useTexture';
import defaultVertexShader from '../shaders/vertex/default.vert.glsl';
import defaultFragmentShader from '../shaders/fragment/default.frag.glsl';

interface GradientTextureProps {
  colors: string[];
  width?: number;
  height?: number;
  position?: [number, number, number];
  rotation?: [number, number, number];
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Record<string, any>;
}

export function GradientTexture({ 
  colors, 
  width = 2, 
  height = 2,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  vertexShader,
  fragmentShader,
  uniforms
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
        />
      ) : (
        <meshBasicMaterial map={texture} />
      )}
    </mesh>
  );
}