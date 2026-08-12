import { createContext, useContext, useMemo, useCallback, useEffect, useState, useRef, ReactNode } from 'react';
import { ContainerControl, ContainerState, HighlightState, LevelConfig, LevelState, PieceControl, PieceShape, PieceState, PointerCallback, PointerHandler, ReadonlyVector3Tuple, RemovePieceCallback } from '../types';
import { useSavedStates } from '../store/savedStatesStore';
import { useRegistry } from '../hooks/useRegistry';
import { usePointerIntersections } from '../hooks/usePointerIntersections';
import { Group, Vector3 } from 'three';
import { useGame } from './GameContext';
import { getShapeCenter } from '../config/shapes';
import { backgroundEvents } from '../utils/backgroundEvents';

type LevelRegistry = {
  containers: ContainerControl;
  pieces: PieceControl;
};

type LevelContextValue = {
  register: (type: keyof LevelRegistry, id: string, control: {}) => void;
  unregister: (type: keyof LevelRegistry, id: string) => void;
  registry: {containers: Map<string, ContainerControl>, pieces: Map<string, PieceControl>};

  activeContainerId: string | null;
  setActiveContainerId: (id: string) => void;

  activeScenePieceId: number | null;
  setActiveScenePieceId: (id: number | null) => void;

  pointerCallback: PointerCallback;
  getHighlight: () => HighlightState | null;
  subscribeHighlight: (cb: (h: HighlightState | null) => void) => () => void;
  notifySubscribers: () => void;

  getSaved: (type: keyof LevelState, id: string) => ContainerState | PieceState | null;

  placePiece: (pieceId: number, containerId: string, cellPos?: ReadonlyVector3Tuple) => Promise<boolean>;
  removePiece: (pieceId: number, containerId: string) => Promise<RemovePieceCallback | null>;
};

const LevelContext = createContext<LevelContextValue | undefined>(undefined);

export const useLevel = () => {
  const ctx = useContext(LevelContext);
  if (!ctx) throw new Error('useLevel must be used inside LevelProvider');
  return ctx;
};

export const LevelProvider = ({ level, children }:
 { level: LevelConfig, children: ReactNode }) => {
  const levelGroupRef = useRef<Group>(null!);
  const { focusOn, setVictory } = useGame();
  
  // REGISTRY HANDLER
  const { register: initialRegister, unregister, get, list, registry } = useRegistry<LevelRegistry>();
  const register = useCallback((type: keyof LevelRegistry, id: string, control: {}) => {
    if (type !== 'containers') initialRegister(type, id, control as PieceControl);
    initialRegister(type, id, control as ContainerControl)
    setActiveContainerId((prev) => prev ?? id);
  }, []);

  // CONTAINER FOCUS HANDLER
  const [activeContainerId, setActiveContainerId] = useState<string | null>(null);
  useEffect(() => {
    const c = get('containers', activeContainerId!)?.getCenteredPosition();
    c && focusOn!(c);
  }, [activeContainerId]);

  // PLACE/REMOVE PIECE HANDLERS
  const placePiece = useCallback(async (pieceId: number, containerId: string, cellPos?: ReadonlyVector3Tuple) => {
    const piece = registry.pieces.get(pieceId.toString());
    const container = registry.containers.get(containerId);
    if (!piece || !container) return false;

    const baseShape = piece.getShape().current;
    const rotation = piece.getRotation();
    const center = getShapeCenter(baseShape);
    const vec = new Vector3();
    
    let finalShape: PieceShape = baseShape.map(([x, y, z]) => {
      vec.set(x - center[0], y - center[1], z - center[2]);
      vec.applyQuaternion(rotation);
      
      const cleanX = Math.round(vec.x * 2) / 2;
      const cleanY = Math.round(vec.y * 2) / 2;
      const cleanZ = Math.round(vec.z * 2) / 2;
      
      return [
        Math.round(cleanX + center[0]),
        Math.round(cleanY + center[1]),
        Math.round(cleanZ + center[2])
      ];
    });

    if (cellPos) {
      const xs = finalShape.map(c => c[0]);
      const ys = finalShape.map(c => c[1]);
      const zs = finalShape.map(c => c[2]);

      const centerX = Math.round((Math.min(...xs) + Math.max(...xs)) / 2);
      const centerY = Math.round((Math.min(...ys) + Math.max(...ys)) / 2);
      const centerZ = Math.round((Math.min(...zs) + Math.max(...zs)) / 2);
      
      finalShape = finalShape.map(([x, y, z]) => [
        (x - centerX) + cellPos[0],
        (y - centerY) + cellPos[1],
        (z - centerZ) + cellPos[2]
      ]);
    }
    
    const success = await container.placePiece(finalShape, pieceId);
    if (success) {
      setTimeout(() => {
        const containersArray = Array.from(registry.containers.values());
        const levelComplete = containersArray.every(c => c.isComplete());
        
        if (levelComplete && containersArray.length > 0)
          setVictory(true);
      }, 0);
    } else {
      backgroundEvents.emit({
        type: 'flick',
        index: 2,
        appearDuration: 0.2,
        disappearDuration: 0.5,
        appearEase: 'easeInOut',
        disappearEase: 'easeOut',
        holdDelay: 0.1
      });
    }
    return success;
  }, [registry]);

  const removePiece = useCallback(async (pieceId: number, containerId: string): Promise<RemovePieceCallback | null> => {
    const piece = registry.pieces.get(pieceId.toString());
    const container = registry.containers.get(containerId);
    if (!piece || !container) return null;

    const shape = await container.removePiece(pieceId);
    if (!shape) return null;

    const shapeCenter = getShapeCenter(shape);
    const containerPos = container.getPosition();
    
    const center = new Vector3(
      containerPos[0] + shapeCenter[0] + .5,
      containerPos[1] + shapeCenter[1] + .5,
      containerPos[2] + shapeCenter[2] + .5
    );
    return {center, shape}
  }, [registry]);

  // ACTIVE PIECE HANDLER (needed for set current active piece. =all of others is in HUD=)
  const [activeScenePieceId, setActiveScenePieceId] = useState<number | null>(null);

  // POINTER HANDLER (subscriptions to pointer events and highlights)
  const pointerCallback = usePointerIntersections(levelGroupRef, {recursive: true});
  const { getHighlight, subscribeHighlight, notifySubscribers } = useHighlightStore(pointerCallback);

  // LEVEL STATE SAVER (save and load from local storage, @see store/savedStatesStore.ts)
  const { getSaved } = useLevelStateSnapshot(level.id, list, unregister);

  // CONTEXT VALUE INIT
  const value = useMemo(() => ({ 
      register, unregister, registry,
      activeContainerId, setActiveContainerId,
      activeScenePieceId, setActiveScenePieceId,
      pointerCallback,
      getHighlight, subscribeHighlight, notifySubscribers,
      getSaved,
      placePiece, removePiece }),
    [register, unregister, registry, setActiveContainerId, activeContainerId, activeScenePieceId, setActiveScenePieceId, pointerCallback, getHighlight, subscribeHighlight, notifySubscribers, getSaved, placePiece, removePiece]
  );
  
  // RETURN XML
  return (
    <group ref={levelGroupRef}>
      <LevelContext.Provider value={value}>{children}</LevelContext.Provider>
    </group>
  );
};

function useHighlightStore(pointerCallback: PointerCallback) {
  const highlightRef = useRef<HighlightState | null>(null);
  const listenersRef = useRef<Set<(h: HighlightState | null) => void>>(new Set());

  const getHighlight = useCallback(() => highlightRef.current, []);

  const subscribeHighlight = useCallback((cb: (h: HighlightState | null) => void) => {
    listenersRef.current.add(cb);
    return () => {
      listenersRef.current.delete(cb);
    };
  }, []);

  const notifySubscribers = useCallback(() => {
    onMove(null!, pointerCallback.computeIntersects(), null!);
    listenersRef.current.forEach((listener) => listener(highlightRef.current));
  }, []);

  const onMove = useCallback<PointerHandler>((_, hits) => {
    let result: HighlightState | null = null;
    for (const hit of hits) {
      const data = hit.object.userData;
      if (data.pieceId) {
        result = { id: data.pieceId, type: 'piece' };
        break;
      } else if (data.cellId && !result) {
        result = { id: data.cellId, type: 'cell' };
      }
    }

    if (highlightRef.current?.id !== result?.id || highlightRef.current?.type !== result?.type) {
      highlightRef.current = result; 
      listenersRef.current.forEach((listener) => listener(result));
    }
  }, []);

  useEffect(() => {
    pointerCallback.addOnMove(onMove);
    return () => pointerCallback.removeOnMove(onMove);
  }, [pointerCallback, onMove]);

  return { getHighlight, subscribeHighlight, notifySubscribers };
}

function useLevelStateSnapshot(
    levelId: string,
    list: (type: keyof LevelState) => Map<string, any>,
    unregister: (type: keyof LevelState, id: string) => void)
{
  const { getState, saveState } = useSavedStates();
  const state = getState(levelId);
  const getSaved = (type: keyof LevelState, id: string) =>
    state ? state[type].get(id)! : null;

  useEffect(() => {
    return () => {
      const containers = new Map<string, ContainerState>();
      list('containers')?.forEach((control: ContainerControl, id) => {
        containers.set(id, control.getState().current)
        unregister('containers', id);
      });
      const pieces = new Map<string, PieceState>();
      list('pieces')?.forEach((control: PieceControl, id) => {
        pieces.set(id, { isPlaced: control.isPlaced.current })
        unregister('pieces', id);
      });
      saveState(levelId, { containers, pieces });
    }
  }, []);

  return { getSaved };
}
