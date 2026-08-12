import { useThree } from '@react-three/fiber';
import { RefObject, useCallback, useRef } from 'react';
import { Quaternion, Vector3, Euler, Matrix4 } from 'three';

export type ApplyDelta = (deltaX: number, deltaY: number) => void;
const STEP_ANGLE = Math.PI / 2;

export function useRelativeRotation(
  options?: { sensitivity?: number;  }
): {snap: () => void, defineDirection: () => void, applyDelta: ApplyDelta, direction: RefObject<'UPWARD' | 'SIDEWAYS' | null>, rotation: RefObject<Quaternion>} {
  const sensitivity = options?.sensitivity ?? 1.2;
  const { camera } = useThree()

  const rotationRef = useRef(new Quaternion());
  const direction = useRef<'UPWARD' | 'SIDEWAYS' | null>(null);
  const tmp = useRef({
    quat: new Quaternion(),
    forward: new Vector3(),
    right: new Vector3(),
    up: new Vector3(),
    mat: new Matrix4(),
    euler: new Euler()
  });

  const applyDelta: ApplyDelta = useCallback((deltaX: number, deltaY: number) => {
    const r = rotationRef.current;
    if (!r || Math.abs(deltaX) < 0.001 && Math.abs(deltaY) < 0.001) return;

    if (direction.current === 'SIDEWAYS') {
      const yawDelta = -deltaX * sensitivity * Math.PI;
      tmp.current.quat.setFromAxisAngle(tmp.current.up, yawDelta);
      r.premultiply(tmp.current.quat);
      r.normalize();
    } else if (direction.current === 'UPWARD') {
      let pitchDelta = -deltaY * sensitivity * Math.PI;
      tmp.current.quat.setFromAxisAngle(tmp.current.right, pitchDelta);
      r.premultiply(tmp.current.quat);
      r.normalize();
    }
  }, [rotationRef, camera, sensitivity]);
  
  const defineDirection = useCallback(() => {
    tmp.current.up.set(0, 1, 0);

    const rightX = camera.matrixWorld.elements[0];
    const rightZ = camera.matrixWorld.elements[2];

    const rightAngle = Math.atan2(rightZ, rightX);
    
    const snappedRightAngle = Math.round(rightAngle / STEP_ANGLE) * STEP_ANGLE;

    tmp.current.right.set(
      Math.cos(snappedRightAngle), 
      0, 
      Math.sin(snappedRightAngle)
    ).normalize();

    tmp.current.forward.crossVectors(tmp.current.up, tmp.current.right).normalize();
  }, [camera]);
  
  const snap = useCallback(() => {
    tmp.current.euler.setFromQuaternion(rotationRef.current)
    tmp.current.euler.x = Math.round(tmp.current.euler.x / STEP_ANGLE) * STEP_ANGLE;
    tmp.current.euler.y = Math.round(tmp.current.euler.y / STEP_ANGLE) * STEP_ANGLE;
    tmp.current.euler.z = Math.round(tmp.current.euler.z / STEP_ANGLE) * STEP_ANGLE;
    rotationRef.current.setFromEuler(tmp.current.euler);
  }, []);

  return { rotation: rotationRef, direction, applyDelta, defineDirection, snap }
}
