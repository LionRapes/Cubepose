import { useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';

export function useCameraFocus() {
  const controlsRef = useRef<OrbitControlsImpl>(null!);
  const { camera } = useThree();
  const desiredCenter = useRef<Vector3 | null>(null);


  const focusOn = useCallback(
    (newCenter: Vector3) => {
      if (!controlsRef.current) return;
      desiredCenter.current = newCenter;
    },
    [camera, controlsRef]
  );

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!desiredCenter.current || !controls)
      return;

    const lerpFactor = Math.min(delta * 3, 1);
    controls.target.lerp(desiredCenter.current!, lerpFactor);
    camera.position.add(desiredCenter.current.clone().sub(controls.target).clampLength(0, 1).multiplyScalar(0.1));
    controls.update();
    
    if (controls.target.distanceTo(desiredCenter.current) < 0.1) {
      desiredCenter.current = null;
    }
  });

  return { controlsRef, focusOn };
}