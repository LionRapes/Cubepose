import { useCallback, useEffect, useRef } from 'react';
import { Vector3 } from 'three';
import type { DownInfo, DragHandler, DragPredicate, PointerCallback, PointerHandler, ReadonlyVector3Tuple } from '../types';

interface UseDragArgs {
  callback: PointerCallback
  onMove?: DragHandler;
  onDown?: DragHandler;
  onDownPredicate?: DragPredicate;
  onUp?: DragHandler;
}

export function useDrag({
  callback,
  onMove,
  onDown,
  onDownPredicate,
  onUp,
}: UseDragArgs) {  
  const dragState = useDragState();
  const targetVec = useRef(new Vector3());
  const downInfoRef = useRef<DownInfo>(null!);

  const onMoveRef = useRef<DragHandler>(null);
  const onDownRef = useRef<DragHandler>(null);
  const onDownPredicateRef = useRef<DragPredicate>(null);
  const onUpRef = useRef<DragHandler>(null);
  
  useEffect(() => { if (onMove) onMoveRef.current = onMove }, [onMove]);
  useEffect(() => { if (onDown) onDownRef.current = onDown; }, [onDown]);
  useEffect(() => { if (onDownPredicate) onDownPredicateRef.current = onDownPredicate; }, [onDownPredicate]);
  useEffect(() => { if (onUp) onUpRef.current = onUp; }, [onUp]);
  
  const handleMove = useCallback<PointerHandler>((event, hits, extra) => {
    if (!dragState.isActive()) return;
    
    onMoveRef.current?.(
      dragState,
      targetVec.current,
      {...extra, hits, button: event.buttons, deltaX: event.movementX, deltaY: event.movementY, downInfo: downInfoRef.current});
  }, []);

  const handleDown = useCallback<PointerHandler>(async (event, hits, extra) => {
    const downInfo = await onDownPredicateRef.current?.(dragState, targetVec.current, {...extra, hits, button: event.buttons});
    if (!downInfo) return; 
    downInfoRef.current = downInfo;

    onDownRef.current?.(
      dragState,
      targetVec.current,
      {...extra, hits, button: event.button, deltaX: event.movementX, deltaY: event.movementY, downInfo: downInfoRef.current});
  }, []);

  const handleUp = useCallback<PointerHandler>((event, hits, extra) => {
    if (!dragState.isActive()) return;
    
    dragState.stop();
    onUpRef.current?.(
      dragState,
      targetVec.current,
      {...extra, hits, button: event.button, deltaX: event.movementX, deltaY: event.movementY, downInfo: downInfoRef.current});
  }, []);

  useEffect(() => {
    callback.addOnMove(handleMove);
    callback.addOnDown(handleDown);
    callback.addOnUp(handleUp);
    return () => {
      callback.removeOnMove(handleMove);
      callback.removeOnDown(handleDown);
      callback.removeOnUp(handleUp);
    };
  }, [callback, onMove, onDown, onUp]);
  return { dragState }
}

export function useDragState() {
  const state = useRef({
    offset: null as ReadonlyVector3Tuple | null,
    distance: 0
  });

  const start = useCallback((offset: ReadonlyVector3Tuple, distance: number) => {
    state.current.offset = offset;
    state.current.distance = distance;
  }, []);

  const stop = useCallback(() => {
    state.current.offset = null;
    state.current.distance = 0;
  }, []);

  const isActive = useCallback(() => {
    return state.current.offset !== null;
  }, []);

  return {
    state,
    start,
    stop,
    isActive
  };
}