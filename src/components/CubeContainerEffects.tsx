import { Mask, RoundedBoxGeometry, useMask } from "@react-three/drei";
import { GlowRoundedBox } from "./GlowBox";
import { ReadonlyVector3Tuple, Vector3Tuple } from "../types";

interface CubeContainerEffectsProps {
  size: ReadonlyVector3Tuple;
  color: string;
}

export function CubeContainerEffects({
  size,
  color
}: CubeContainerEffectsProps) {
  const offset = [size[0]/2, size[1]/2, size[2]/2] as const;
  size = [size[0]*1.05, size[1]*1.05, size[2]*1.05];
  const stencil = useMask(1, true);
  return (
    <>
      <Mask id={1} position={offset}>
        <RoundedBoxGeometry args={size as Vector3Tuple} radius={0.2} smoothness={4} bevelSegments={4}/>
      </Mask>

      <GlowRoundedBox position={offset} size={size} color={color} glowIntensity={0.35} radius={0.2} scaleStep={0.01} glowLayers={15} stencil={stencil} smoothness={4} bevelSegments={4}/>
      

    </>
  );
}