import { Mask, RoundedBox, RoundedBoxGeometry, useMask } from "@react-three/drei";
import { GlowRoundedBox } from "./GlowBox";

export function CubeContainer() {
  const stencil = useMask(1, true);
  console.log(stencil);
  
  return (
    <>
      <Mask id={1}>
        <RoundedBoxGeometry args={[9.7, 9.7, 9.7]} radius={1} smoothness={1} bevelSegments={1}/>
      </Mask>


      <RoundedBox args={[9.7, 9.7, 9.7]} radius={1} smoothness={1} bevelSegments={1}>
        <meshBasicMaterial color={'red'}/>
      </RoundedBox>

      <GlowRoundedBox size={10} color="white" glowIntensity={0.15} radius={1} scaleStep={0.01} glowLayers={10} stencil={stencil}/>
      

    </>
  );
}