import { PieceControl, PieceShape, PieceState, ReadonlyVector3Tuple } from '../types';
import { getShapeCenter, L_SHAPE } from '../config/shapes';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Vector3, Group, MeshBasicMaterial, Color, BoxGeometry } from 'three';
import { useGame } from '../context/GameContext';
import { useLevel } from '../context/LevelContext';
import { useFrame, useThree } from '@react-three/fiber';
import { useDrag } from '../hooks/useDrag';
import { useThrottle } from '../hooks/useThrottle';
import { useRelativeRotation } from '../hooks/useRelativeRotation';
import { DEFAULT_GEOMETRY, DEFAULT_QUATERNION, DEFAULT_SCALE } from '../constants';
import { HUD_MARGIN_X, HUD_MARGIN_Y, HUD_SCALE, HUD_SPACING_X, HUD_SPACING_Y } from '../config/hud';
import { CELL_COLORS } from '../config/colors';
import { waitFor } from '../utils/waitFor';

interface PieceProps {
  pieceId: number;
  shape?: PieceShape;
  color?: Color;
}

export function Piece({
  pieceId,
  shape: initialShape = L_SHAPE,
  color = new Color('red')
}: PieceProps) {
  // CONTEXTS CONST
  const { orbitControlsRef } = useGame();
  const level = useLevel();

  // BASE CONST
  const [shape, setShape] = useState<PieceShape>(initialShape);
  const shapeRef = useRef<PieceShape>(initialShape);
  useEffect(() => {shapeRef.current = shape}, [shape]);
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
        const cellPos = containerHit?.object.userData.cellPos;
        if (containerId)
          try {
            const placed = await level.placePiece(pieceId, containerId, cellPos);
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
    onDownPredicate: async (dragState, _targetVec, extra) => {
      let isCell = false;
      let hit = null;
      
      for (const hitI of extra.hits) {
        const { pieceId: pId, cellId: cId } = hitI.object.userData;
        if ((pId || cId)) {
          if (pId === pieceId || cId === pieceId) {
            isCell = !!cId;
            hit = hitI;
            break;
          }
          else 
            return null;
        }
      }
      if (!hit) return null;
      
      if (isCell) {
        const callback = await level.removePiece(pieceId, hit.object.userData.containerId);
        if (!callback) return null;

        level.setActiveScenePieceId(pieceId)
        setShape(callback.shape);
        setPlaced(false);

        const created = await waitFor(() => !!pieceGroupRef.current, 1000);
        if (!created) {
          console.error('Failed to create piece');
          return null;
        }       
        pieceGroupRef.current!.position.copy(callback.center);
      }
      
      if (!pieceGroupRef.current) return null;
      const worldPos = pieceGroupRef.current.getWorldPosition(new Vector3());
      const offset = worldPos.sub(hit.point).toArray() as ReadonlyVector3Tuple;
      const distance = camera.position.distanceTo(worldPos);
      
      dragState.start(offset, distance);
      return { isCell };
    }
  });

  // VISUALIZATION (especially HUD) 
  const { camera, viewport } = useThree();
  useFrame(() => {
    if (!pieceGroupRef.current) return;
    if (level.activeScenePieceId !== pieceId && !dragState.isActive()) {
      const index = pieceId - 1; 
      const usableWidth = viewport.width - (HUD_MARGIN_X * 2);
      const itemsPerRow = Math.max(1, Math.floor(usableWidth / HUD_SPACING_X));
      const column = index % itemsPerRow;
      const row = Math.floor(index / itemsPerRow);

      const localX = -viewport.width / 2 + HUD_MARGIN_X + (column * HUD_SPACING_X);
      const localY = -viewport.height / 2 + HUD_MARGIN_Y + (row * HUD_SPACING_Y);
      const localZ = -15;
      
      const targetLocal = new Vector3(localX, localY, localZ);
      const targetWorld = targetLocal.applyMatrix4(camera.matrixWorld);
      
      pieceGroupRef.current.position.lerp(targetWorld, 0.15);
      pieceGroupRef.current.scale.lerp(HUD_SCALE, 0.15);
      pieceGroupRef.current.quaternion.slerp(camera.quaternion, 0.15);
    } else if (level.activeScenePieceId === pieceId) {
      pieceGroupRef.current.quaternion.slerp(rotation.current, 0.15);
      pieceGroupRef.current.scale.lerp(DEFAULT_SCALE, 0.15);
    }
  });

  // HANDLE CHANGE ACTIVE PIECE
  useEffect(() => {
    if (pieceId != level.activeScenePieceId) {
      rotation.current.copy(DEFAULT_QUATERNION);
      if (shape !== initialShape) setShape(initialShape);
    }
  }, [level.activeScenePieceId]);

  // HIGHLIGHT EFFECT APPLY
  useEffect(() => {
    const unsubscribe = level.subscribeHighlight((highlight) => {
      const isHighlighted = (highlight?.type === 'piece' && highlight.id === pieceId) || dragState.isActive();
      materialRef.current.color.set(isHighlighted ? CELL_COLORS.highlighted : color);
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
    getShape: () => shapeRef,
    getRotation: () => rotation.current
  }), []);

  useEffect(() => {
    level.register('pieces', pieceId.toString(), controls);
  }, [level.register, level.unregister, pieceId]);
  
  // RETURN XML
  const center = useMemo(() => getShapeCenter(shape), [shape]);
  return isPlaced ? null : (
    <group ref={pieceGroupRef}>
      {/* <mesh 
        position={[0, 0, 0]}
        geometry={new BoxGeometry(.2, .2, .2)} 
        material={new MeshBasicMaterial({ color: 'black' })} 
      /> */}
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