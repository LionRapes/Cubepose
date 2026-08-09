import { useReducer, createContext, useContext, useMemo, useEffect, useCallback } from 'react';
import { ContainerControl, ContainerState, CubeOffset, Grid3D, ContainerAction, ReadonlyVector3Tuple } from '../types';
import { useLevel } from './LevelContext';

function gameReducer(state: ContainerState, action: ContainerAction): ContainerState {
  switch (action.type) {
    case "PLACE_PIECE": {
      const grid: Grid3D = state.grid.map((plane) => plane.map((row) => [...row]));
      for (const [x, y, z] of action.cubes) {
        if (grid[x]?.[y]?.[z] === 0) grid[x][y][z] = action.pieceId;
        else {
          action.onResult?.(false);
          return state;
        }
      }
      action.onResult?.(true);
      return { ...state, grid };
    }
    case "REMOVE_PIECE": {
      const grid: Grid3D = state.grid.map(
        (plane) => plane.map((row) => row.map(cell => cell === action.pieceId ? 0 : cell)));

      action.onResult?.(true);
      return { ...state, grid };
    }
    default:
      return state;
  }
}

interface ContainerContextValue {
  state: ContainerState;
  containerId: string;
  placePiece: (cubes: CubeOffset[], pieceId: number) => Promise<boolean>;
  removePiece: (pieceId: number) => Promise<boolean>;
  isComplete: () => boolean;
  dimensions: { width: number; height: number; depth: number };
}

export const ContainerContext = createContext<ContainerContextValue | null>(null);

export const useContainerContext = () => {
  const ctx = useContext(ContainerContext);
  if (!ctx) throw new Error("useContainerContext should be used in CubeContainer only");
  return ctx;
};

export interface ContainerProviderProps {
  containerId: string;
  position: ReadonlyVector3Tuple;
  width: number;
  height: number;
  depth: number;
  blockedCells?: CubeOffset[];
  children: React.ReactNode;
}

export function ContainerProvider({ containerId, position, width, height, depth, blockedCells = [], children }: ContainerProviderProps) {
  // CONTEXT CONST
  const { getSaved, register, unregister} = useLevel();

  // STATE INIT (if was saved then load it from storage)
  const initialState = useMemo<ContainerState>(() => {
    const saved = getSaved('containers', containerId) as ContainerState;
    if (saved) return saved;

    const grid: Grid3D = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => Array(depth).fill(0))
    );
    blockedCells.forEach(([x, y, z]) => {
      if (grid[x]?.[y]?.[z] !== undefined) grid[x][y][z] = -1;
    });
    return { grid };
  }, [containerId, width, height, depth, blockedCells]);
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // STATE ACTIONS
  const placePiece = useCallback((cubes: CubeOffset[], pieceId: number): Promise<boolean> => {
    return new Promise((resolve) => {
      dispatch({ 
        type: "PLACE_PIECE", 
        cubes, 
        pieceId,
        onResult: (result: boolean) => resolve(result)
      });
    });
  }, [dispatch]);
  const removePiece = useCallback((pieceId: number): Promise<boolean> => {
    return new Promise((resolve) => {
      dispatch({ 
        type: "REMOVE_PIECE", 
        pieceId,
        onResult: (result: boolean) => resolve(result)
      });
    });
  }, [dispatch]);
  const isComplete = () => state.grid.every((plane) => plane.every((row) => row.every((cell) => cell)));

  // CONTEXT VALUE INIT
  const contextValue = useMemo<ContainerContextValue>(
    () => ({
      state,
      containerId,
      placePiece,
      removePiece,
      isComplete,
      dimensions: { width, height, depth },
    }),
    [state, containerId, placePiece, removePiece, isComplete, width, height, depth, blockedCells]
  );
  
  // REGISTRATION
  const controls = useMemo<ContainerControl>(() => ({
    getState: () => state,
    getPosition: () => [position[0]+width/2, position[1]+height/2, position[2]+depth/2],
    placePiece,
    removePiece,
    isComplete
  }), []);

  useEffect(() => {
    register('containers', containerId, controls);
  }, [register, unregister, containerId]);
  
  // RETURN XML
  return <ContainerContext.Provider value={contextValue}>{children}</ContainerContext.Provider>;
}