import React, { useReducer, createContext, useContext, useMemo } from 'react';
import { ContainerState, CubeOffset, Grid3D, ContainerAction } from '../types';

function gameReducer(state: ContainerState, action: ContainerAction): ContainerState {
  switch (action.type) {
    case "PLACE_PIECE": {
      const newGrid = state.grid.map((plane) => plane.map((row) => [...row]));
      action.cubes.forEach(([x, y, z]) => {
        if (newGrid[x]?.[y]?.[z] !== undefined) newGrid[x][y][z] = true;
      });
      return {
        grid: newGrid,
        placedCubes: [...state.placedCubes, ...action.cubes],
      };
    }
    case "RESET": {
      const { width, height, depth, blockedCells } = action;
      const newGrid: Grid3D = Array.from({ length: width }, () =>
        Array.from({ length: height }, () => Array(depth).fill(false))
      );
      blockedCells.forEach(([x, y, z]) => {
        if (newGrid[x]?.[y]?.[z] !== undefined) newGrid[x][y][z] = true;
      });
      return {
        grid: newGrid,
        placedCubes: [...blockedCells],
      };
    }
    default:
      return state;
  }
}

interface GameContextValue {
  state: ContainerState;
  placePiece: (cubes: CubeOffset[]) => void;
  reset: () => void;
  isComplete: () => boolean;
  dimensions: { width: number; height: number; depth: number };
  blockedCells: CubeOffset[];
}

export const GameContext = createContext<GameContextValue | null>(null);

export const useGameContext = () => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGameContext should be used in CubeContainer only");
  return ctx;
};

export interface GameProviderProps {
  width: number;
  height: number;
  depth: number;
  blockedCells?: CubeOffset[];
  children: React.ReactNode;
}

export function GameProvider({ width, height, depth, blockedCells = [], children }: GameProviderProps) {
  
  const initialState = useMemo<ContainerState>(() => {
    const grid: Grid3D = Array.from({ length: width }, () =>
      Array.from({ length: height }, () => Array(depth).fill(false))
    );
    blockedCells.forEach(([x, y, z]) => {
      if (grid[x]?.[y]?.[z] !== undefined) grid[x][y][z] = true;
    });
    return { grid, placedCubes: [...blockedCells] };
  }, [width, height, depth, blockedCells]);

  const [state, dispatch] = useReducer(gameReducer, initialState);

  const placePiece = (cubes: CubeOffset[]) => dispatch({ type: 'PLACE_PIECE', cubes });
  const reset = () => dispatch({ type: 'RESET', width, height, depth, blockedCells });
  const isComplete = () => state.grid.every((plane) => plane.every((row) => row.every((cell) => cell)));

  const contextValue = useMemo<GameContextValue>(
    () => ({
      state,
      placePiece,
      reset,
      isComplete,
      dimensions: { width, height, depth },
      blockedCells,
    }),
    [state, placePiece, reset, isComplete, width, height, depth, blockedCells]
  );
  
  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
}