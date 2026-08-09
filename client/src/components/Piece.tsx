import { PieceControl, PieceShape, PieceState } from '../types';
import { getShapeCenter, L_SHAPE } from '../config/shapes';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Vector3, Group, MeshBasicMaterial, Color } from 'three';
import { useGame } from '../context/GameContext';
import { useLevel } from '../context/LevelContext';
import { useFrame, useThree } from '@react-three/fiber';
import { useDrag } from '../hooks/useDrag';
import { useThrottle } from '../hooks/useThrottle';
import { useRelativeRotation } from '../hooks/useRelativeRotation';
import { COLORS, DEFAULT_GEOMETRY, DEFAULT_QUATERNION, DEFAULT_SCALE, HUD_MARGIN_X, HUD_MARGIN_Y, HUD_SCALE, HUD_SPACING_X } from '../constants';

interface PieceProps {
  pieceId: number;
  shape?: PieceShape;
  color?: Color;
}

export function Piece({
  pieceId,
  shape = L_SHAPE,
  color = new Color('red')
}: PieceProps) {
  // CONTEXTS CONST
  const { orbitControlsRef } = useGame();
  const level = useLevel();

  // BASE CONST
  const pieceGroupRef = useRef<Group>(null!);
  const materialRef = useRef<MeshBasicMaterial>(
    new MeshBasicMaterial({ color, transparent: true, opacity: 0.8 })
  );

  // PLACE CONST
  const [isPlaced, setPlaced] = useState(() => (level.getSaved('pieces', pieceId.toString()) as PieceState)?.isPlaced ?? false);
  const isPlacedRef = useRef((level.getSaved('pieces', pieceId.toString()) as PieceState)?.isPlaced ?? false);
  useEffect(() => {isPlacedRef.current = isPlaced}, [isPlaced]);

  // DRAG LOGIC
  const { defineDirection, applyDelta, snap, rotation, direction } = useRelativeRotation({ sensitivity: .75 });
  const throttledApplyDelta = useThrottle(applyDelta, 1000 / 50);
  const { dragState } = useDrag({
    callback: level.pointerCallback,
    onMove: (dragState, targetVec, extra) => {
      if (extra.button === 1) {
        const { raycaster, pointer, camera } = extra;
        const { distance, offset } = dragState.state.current;
        raycaster.setFromCamera(pointer, camera);
        raycaster.ray.at(distance, targetVec);

        pieceGroupRef.current!.position.set(
          targetVec.x + offset![0],
          targetVec.y + offset![1],
          targetVec.z + offset![2]
        );
      }
      else if (extra.button === 2) {
        if (!direction.current) {
          if (extra.deltaX !== extra.deltaY) 
            direction.current = Math.abs(extra.deltaX) > Math.abs(extra.deltaY) ? 'SIDEWAYS' : 'UPWARD';
          defineDirection();
        }
        throttledApplyDelta(extra.deltaX/100, extra.deltaY/100);
      }
    },
    onDown: (_dragState, _targetVec, _extra) => {
      level.setActiveScenePieceId?.(pieceId);
      orbitControlsRef.current.enabled = false;
    },
    onUp: async (_dragState, _targetVec, extra) => {
      if (extra.button === 0) {
        const containerHit = extra.hits.find(e => e.object.userData.containerId);
        const containerId = containerHit?.object.userData.containerId;
        if (containerId)
          try {
            const placed = await level.placePiece(pieceId, containerId);
            level.setActiveScenePieceId(null)
            setPlaced(placed);
          } catch(e) {}
      }
      if (direction.current) {
        snap();
        direction.current = null;
      }
      setTimeout(() => level.notifySubscribers(), 50);
      orbitControlsRef.current.enabled = true;
    },
    onDownPredicate: (dragState, _targetVec, extra) => {
      const hit = extra.hits.find(e => e.object.userData.pieceId);
      if (!hit || !pieceGroupRef.current || hit.object.userData.pieceId !== pieceId) return false;

      const worldPos = pieceGroupRef.current.getWorldPosition(new Vector3());
      const offset = worldPos.sub(hit.point).toArray() as [number, number, number];
      const distance = camera.position.distanceTo(worldPos);
      dragState.start(offset, distance);
      return true;
    }
  });

  // VISUALIZATION (especially HUD) 
  const { camera, viewport } = useThree();
  useFrame(() => {
    if (!pieceGroupRef.current) return;
    if (level.activeScenePieceId !== pieceId && !dragState.isActive()) {
      const localX = -viewport.width / 2 + HUD_MARGIN_X + (pieceId * HUD_SPACING_X);
      const localY = -viewport.height / 2 + HUD_MARGIN_Y;
      const localZ = -15;
      
      const targetLocal = new Vector3(localX, localY, localZ);
      const targetWorld = targetLocal.applyMatrix4(camera.matrixWorld);
      
      if (rotation.current !== DEFAULT_QUATERNION) rotation.current.copy(DEFAULT_QUATERNION);
      pieceGroupRef.current.position.lerp(targetWorld, 0.15);
      pieceGroupRef.current.scale.lerp(HUD_SCALE, 0.15);
      pieceGroupRef.current.quaternion.slerp(camera.quaternion, 0.15);
    } else if (level.activeScenePieceId === pieceId) {
      pieceGroupRef.current.quaternion.slerp(rotation.current, 0.15);
      pieceGroupRef.current.scale.lerp(DEFAULT_SCALE, 0.15);
    }
  });

  // HIGHLIGHT EFFECT APPLY
  useEffect(() => {
    const unsubscribe = level.subscribeHighlight((highlight) => {
      const isHighlighted = (highlight?.type === 'piece' && highlight.id === pieceId) || dragState.isActive();
      materialRef.current.color.set(isHighlighted ? COLORS.highlighted : color);
    });
    return () => {
      unsubscribe();
    }
  }, [level.subscribeHighlight]);

  // REGISTRATION
  const controls = useMemo<PieceControl>(() => ({
    getPosition: () => pieceGroupRef.current.position,
    isPlaced: isPlacedRef,
    setPlaced,
    getShape: () => shape
  }), []);

  useEffect(() => {
    level.register('pieces', pieceId.toString(), controls);
  }, [level.register, level.unregister, pieceId]);
  
  // RETURN XML
  const center = getShapeCenter(shape);
  return isPlaced ? null : (
    <group ref={pieceGroupRef}>
      {shape.map(([x, y, z], index) => (
        <mesh 
          key={index} 
          position={[x - center[0], y - center[1], z - center[2]]} 
          geometry={DEFAULT_GEOMETRY} 
          material={materialRef.current} 
          userData={{ pieceId }}
        />
      ))}
    </group>
  );
}