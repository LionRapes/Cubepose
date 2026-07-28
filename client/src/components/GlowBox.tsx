import { RoundedBox } from '@react-three/drei';

interface GlowBoxProps {
  size?: number | [number, number, number];
  color?: string;
  glowIntensity?: number;
  glowLayers?: number;
  scaleStep?: number;
  radius?: number;
  smoothness?: number;
  bevelSegments?: number;
  renderOrder?: number;
  stencil?: any;
}

function generateLayers(
  size: number | [number, number, number],
  glowLayers: number,
  scaleStep: number,
  glowIntensity: number
) {
  const [w, h, d] = typeof size === 'number' ? [size, size, size] : size;
  const layers = [];
  for (let i = 0; i <= glowLayers; i++) {
    const scale = 1 + i * scaleStep;
    const opacity = i === 0 ? 1 : Math.max(0, glowIntensity / (i * 0.6 + 0.4));
    layers.push({
      scale,
      opacity,
      transparent: i !== 0,
      depthWrite: i === 0,
    });
  }
  return { layers, w, h, d };
}

export function GlowBox(props: GlowBoxProps) {
  const {
    size = 10,
    color = 'white',
    glowIntensity = 0.3,
    glowLayers = 3,
    scaleStep = 0.08,
    stencil,
    renderOrder
  } = props;

  const { layers, w, h, d } = generateLayers(size, glowLayers, scaleStep, glowIntensity);

  return (
    <group>
      {layers.map((layer, index) => (
        <mesh key={index} scale={[layer.scale, layer.scale, layer.scale]} renderOrder={renderOrder}>
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

export function GlowRoundedBox(props: GlowBoxProps) {
  const {
    size = 10,
    color = 'white',
    glowIntensity = 0.3,
    glowLayers = 3,
    scaleStep = 0.08,
    radius = 1,
    smoothness = 1,
    bevelSegments = 1,
    stencil,
    renderOrder
  } = props;

  const { layers, w, h, d } = generateLayers(size, glowLayers, scaleStep, glowIntensity);

  return (
    <group>
      {layers.map((layer, index) => (
        <RoundedBox
          key={index}
          args={[w * layer.scale, h * layer.scale, d * layer.scale]}
          radius={radius * layer.scale}
          smoothness={smoothness}
          bevelSegments={bevelSegments}
          renderOrder={renderOrder}
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