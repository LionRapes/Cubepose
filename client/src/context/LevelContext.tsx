import { createContext, useContext, useMemo, useCallback, useEffect, useState, useRef, ReactNode } from 'react';
import { ContainerControl, ContainerState, HighlightState, LevelConfig, LevelState, PieceControl, PieceState, PointerCallback, PointerHandler } from '../types';
import { useSavedStates } from '../store/savedStatesStore';
import { useRegistry } from '../hooks/useRegistry';
import { usePointerIntersections } from '../hooks/usePointerIntersections';
import { Group } from 'three';
import { useGame } from './GameContext';

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

  placePiece: (pieceId: number, containerId: string) => Promise<boolean>;
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
  const { focusOn } = useGame();
  
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
    const c = get('containers', activeContainerId!)?.getPosition();
    c && focusOn!(c);
  }, [activeContainerId]);

  // PLACE PIECE HANDLER
  const placePiece = useCallback(async (pieceId: number, containerId: string) => {
    const piece = registry.pieces.get(pieceId.toString());
    const container = registry.containers.get(containerId);
    if (!piece || !container) return false;

    const success = await container.placePiece(piece.getShape(), pieceId);
    return success;
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
      placePiece }),
    [register, unregister, registry, setActiveContainerId, activeContainerId, activeScenePieceId, setActiveScenePieceId, pointerCallback, getHighlight, subscribeHighlight, notifySubscribers, getSaved, placePiece]
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
        containers.set(id, control.getState())
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
