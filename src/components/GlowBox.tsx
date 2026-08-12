import { RoundedBox } from '@react-three/drei';
import { generateGlowLayers } from '../utils/glow';

interface GlowBoxProps {
  size: readonly [number, number, number];
  position?: readonly [number, number, number];
  color?: string;
  glowIntensity?: number;
  glowLayers?: number;
  scaleStep?: number;
  radius?: number;
  smoothness?: number;
  bevelSegments?: number;
  stencil?: any;
}

export function GlowBox({
  size,
  position = [0, 0, 0],
  color = 'white',
  glowIntensity = 0.3,
  glowLayers = 3,
  scaleStep = 0.08,
  stencil
}: GlowBoxProps) {

  const { layers, w, h, d } = generateGlowLayers(size, glowLayers, scaleStep, glowIntensity);

  return (
    <group>
      {layers.map((layer, index) => (
        <mesh key={index} scale={[layer.scale, layer.scale, layer.scale]} position={position}>
          <boxGeometry args={[w, h, d]} />
          <meshBasicMaterial
            color={color}
            transparent={layer.transparent}
            opacity={layer.opacity}
            depthWrite={layer.depthWrite}
            {...stencil}
          />
        </mesh>
      ))}
    </group>
  );
}

export function GlowRoundedBox({
  size,
  position = [0, 0, 0],
  color = 'white',
  glowIntensity = 0.3,
  glowLayers = 3,
  scaleStep = 0.08,
  radius = 1,
  smoothness = 1,
  bevelSegments = 1,
  stencil
}: GlowBoxProps) {

  const { layers, w, h, d } = generateGlowLayers(size, glowLayers, scaleStep, glowIntensity);

  return (
    <group>
      {layers.map((layer, index) => (
        <RoundedBox
          key={index}
          args={[w * layer.scale, h * layer.scale, d * layer.scale]}
          position={position}
          radius={radius * layer.scale}
          smoothness={smoothness}
          bevelSegments={bevelSegments}
        >
          <meshBasicMaterial
            color={color}
            transparent={layer.transparent}
            opacity={layer.opacity}
            depthWrite={layer.depthWrite}
            {...stencil}
          />
        </RoundedBox>
      ))}
    </group>
  );
}