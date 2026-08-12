import { useReducer, createContext, useContext, useMemo, useEffect, useCallback, useRef } from 'react';
import { ContainerControl, ContainerState, CubeOffset, Grid3D, ContainerAction, ReadonlyVector3Tuple, PieceShape } from '../types';
import { useLevel } from './LevelContext';
import { Vector3Tuple } from 'three';

function gameReducer(state: ContainerState, action: ContainerAction): ContainerState {
  switch (action.type) {
    case "PLACE_PIECE": {
      const grid: Grid3D = state.grid.map((plane) => plane.map((row) => [...row]));
      
      let canPlaceExactly = true;
      for (const [x, y, z] of action.cubes) {
        if (grid[x]?.[y]?.[z] !== 0) { 
          canPlaceExactly = false;
          break;
        }
      }
      
      let finalCubes = action.cubes;
      let isPlaced = canPlaceExactly;

      if (!isPlaced) {
        const xs = action.cubes.map(c => c[0]);
        const ys = action.cubes.map(c => c[1]);
        const zs = action.cubes.map(c => c[2]);

        const targetX = Math.round((Math.min(...xs) + Math.max(...xs)) / 2);
        const targetY = Math.round((Math.min(...ys) + Math.max(...ys)) / 2);
        const targetZ = Math.round((Math.min(...zs) + Math.max(...zs)) / 2);
        
        const normalizedCubes = action.cubes.map(([x, y, z]) => [
          x - targetX,
          y - targetY,
          z - targetZ
        ]);

        const width = grid.length;
        const height = grid[0].length;
        const depth = grid[0][0].length;

        const allPositions: Vector3Tuple[] = [];
        for (let x = 0; x < width; x++) {
          for (let y = 0; y < height; y++) {
            for (let z = 0; z < depth; z++) {
              allPositions.push([x, y, z]);
            }
          }
        }

        allPositions.sort((a, b) => {
          const distA = Math.pow(a[0] - targetX, 2) + Math.pow(a[1] - targetY, 2) + Math.pow(a[2] - targetZ, 2);
          const distB = Math.pow(b[0] - targetX, 2) + Math.pow(b[1] - targetY, 2) + Math.pow(b[2] - targetZ, 2);
          return distA - distB;
        });

        searchLoop:
        for (const [x, y, z] of allPositions) {
          let canFit = true;
          for (const [cx, cy, cz] of normalizedCubes) {
            if (grid[x + cx]?.[y + cy]?.[z + cz] !== 0) {
              canFit = false;
              break; 
            }
          }

          if (canFit) {
            finalCubes = normalizedCubes.map(([cx, cy, cz]) => [x + cx, y + cy, z + cz]);
            isPlaced = true;
            break searchLoop; 
          }
        }
      }

      if (isPlaced) {
        for (const [x, y, z] of finalCubes) {
          grid[x][y][z] = action.pieceId;
        }
        action.onResult?.(true);
        return { ...state, grid };
      } else {
        action.onResult?.(false);
        return state;
      }
    }

    case "REMOVE_PIECE": {
      let shape: PieceShape | null = null;
      const grid: Grid3D = state.grid.map((plane, x) =>
        plane.map((row, y) =>
          row.map((cell, z) => {
            if (cell === action.pieceId) {
              shape = shape ?? [];
              shape.push([x, y, z]);
              return 0;
            }
            return cell;
          })
        )
      );
      action.onResult?.(shape);
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
  removePiece: (pieceId: number) => Promise<PieceShape | null>;
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

  // STATE INIT (if it was saved then load it from storage)
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
  const stateRef = useRef<ContainerState>(initialState);
  useEffect(() => {stateRef.current = state}, [state]);
  
  // STATE ACTIONS
  const isComplete = useCallback(() => {
    return stateRef.current.grid.every((plane) => plane.every((row) => row.every((cell) => cell)));
  }, []);
  const placePiece = useCallback((cubes: CubeOffset[], pieceId: number): Promise<boolean> => {
    if (isComplete()) return Promise.resolve(false); 
    
    return new Promise((resolve) => {
      dispatch({ 
        type: "PLACE_PIECE", 
        cubes, 
        pieceId,
        onResult: (result: boolean) => resolve(result)
      });
      
    });
  }, [dispatch, isComplete]);
  const removePiece = useCallback((pieceId: number): Promise<PieceShape | null> => {
    if (isComplete()) return Promise.resolve(null);
    
    return new Promise((resolve) => {
      dispatch({ 
        type: "REMOVE_PIECE", 
        pieceId,
        onResult: (shape: PieceShape | null) => {

          resolve(shape)
        }
      });
    });
  }, [dispatch, isComplete]);

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
    getState: () => stateRef,
    getPosition: () => [position[0], position[1], position[2]],
    getCenteredPosition: () => [position[0]+width/2, position[1]+height/2, position[2]+depth/2],
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