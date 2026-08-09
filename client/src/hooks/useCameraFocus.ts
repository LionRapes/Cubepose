import { useCallback, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import { Vector3 } from 'three';
import { cameraEvents } from '../utils/cameraEvents';
import { ReadonlyVector3Tuple } from '../types';

export function useCameraFocus() {
  const orbitControlsRef = useRef<OrbitControlsImpl>(null!);
  const { camera } = useThree();
  const desiredCenter = useRef<Vector3 | null>(null);


  const focusOn = useCallback(
    (target: ReadonlyVector3Tuple) => {
      if (!orbitControlsRef.current) return;
      const newCenter = new Vector3(target[0], target[1], target[2]);
      desiredCenter.current = newCenter;
      cameraEvents.emit({ type: 'focusStart', center: newCenter });
    },
    [camera, orbitControlsRef]
  );

  useFrame((_, delta) => {
    const controls = orbitControlsRef.current;
    if (!desiredCenter.current || !controls)
      return;

    const lerpFactor = Math.min(delta * 3, 1);
    controls.target.lerp(desiredCenter.current!, lerpFactor);
    camera.position.add(desiredCenter.current.clone().sub(controls.target).clampLength(0, 1).multiplyScalar(0.1));
    controls.update();
    
    if (controls.target.distanceTo(desiredCenter.current) < 0.1) {
      cameraEvents.emit({ type: 'focusEnd', center: desiredCenter.current });
      desiredCenter.current = null;
    }
  });

  return { orbitControlsRef, focusOn };
}