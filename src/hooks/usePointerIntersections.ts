import { useCallback, useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import { Group, Intersection } from 'three';
import { PointerCallback, PointerHandler } from '../types';

interface UsePointerIntersectionsOptions {
  onMove?: PointerHandler[];
  onDown?: PointerHandler[];
  onUp?: PointerHandler[];
  recursive?: boolean;
}

export function usePointerIntersections(
  groupRef: React.RefObject<Group>,
  { onMove, onDown, onUp, recursive = false }: UsePointerIntersectionsOptions = {}
): PointerCallback {
  const { camera, raycaster, gl, pointer } = useThree();
  
  const onMoveRef = useRef<PointerHandler[]>([]);
  const onDownRef = useRef<PointerHandler[]>([]);
  const onUpRef = useRef<PointerHandler[]>([]);
  
  useEffect(() => { if (onMove) onMoveRef.current = onMove }, [onMove]);
  useEffect(() => { if (onDown) onDownRef.current = onDown; }, [onDown]);
  useEffect(() => { if (onUp) onUpRef.current = onUp; }, [onUp]);

  const intersectsRef = useRef<Intersection[]>([]);

  const computeIntersects = useCallback((event?: PointerEvent) => {
    if (!groupRef.current) return [] as Intersection[];

    if (event) raycaster.setFromCamera(pointer, camera);
    return raycaster.intersectObjects(groupRef.current.children, recursive);
  }, [raycaster, camera, groupRef, recursive]);

  const handleMove = useCallback((event: PointerEvent) => {
    const hits = computeIntersects(event);
    intersectsRef.current = hits;
    onMoveRef.current.forEach(handler => {
      handler(event, hits, { camera, raycaster, pointer });
    });
  }, [computeIntersects]);

  const handleDown = useCallback((event: PointerEvent) => {
    const hits = computeIntersects(event);
    intersectsRef.current = hits;
    onDownRef.current.forEach(handler => {
      handler(event, hits, { camera, raycaster, pointer });
    });
  }, [computeIntersects]);

  const handleUp = useCallback((event: PointerEvent) => {
    const hits = computeIntersects(event);
    intersectsRef.current = hits;
    onUpRef.current.forEach(handler => {
      handler(event, hits, { camera, raycaster, pointer });
    });
  }, [computeIntersects]);

  const addOnMove = useCallback((callback: PointerHandler) => {
    onMoveRef.current.push(callback);
  }, []);
  const removeOnMove = useCallback((callback: PointerHandler) => {
    onMoveRef.current = onMoveRef.current.filter(cb => cb !== callback);
  }, []);
  const addOnDown = useCallback((callback: PointerHandler) => {
    onDownRef.current.push(callback);
  }, []);
  const removeOnDown = useCallback((callback: PointerHandler) => {
    onDownRef.current = onDownRef.current.filter(cb => cb !== callback);
  }, []);
  const addOnUp = useCallback((callback: PointerHandler) => {
    onUpRef.current.push(callback);
  }, []);
  const removeOnUp = useCallback((callback: PointerHandler) => {
    onUpRef.current = onUpRef.current.filter(cb => cb !== callback);
  }, []);


  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener('pointermove', handleMove);
    canvas.addEventListener('pointerdown', handleDown);
    canvas.addEventListener('pointerup', handleUp);

    return () => {
      canvas.removeEventListener('pointermove', handleMove);
      canvas.removeEventListener('pointerdown', handleDown);
      canvas.removeEventListener('pointerup', handleUp);
    };
  }, [gl, handleMove, handleDown, handleUp]);

  return { 
    hits: intersectsRef,
    computeIntersects,
    addOnMove,
    addOnDown,
    addOnUp,
    removeOnMove,
    removeOnDown,
    removeOnUp
  };
}
