import { OrbitControls } from '@react-three/drei';
import { createContext, useContext, RefObject, ComponentRef } from 'react';
import { LevelConfig, ReadonlyVector3Tuple } from '../types';

interface GameContextValue {
  orbitControlsRef: RefObject<ComponentRef<typeof OrbitControls>>;
  currentLevel: LevelConfig;
  focusOn?: (pos: ReadonlyVector3Tuple) => void;
  switchLevel: (levelId: string) => void;
  isVictory: boolean;
  setVictory: (val: boolean) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};

export const GameProvider = ({ 
  children, 
  orbitControlsRef, 
  currentLevel, 
  focusOn,
  switchLevel,
  isVictory,
  setVictory
}: { 
  children: React.ReactNode;
  orbitControlsRef: RefObject<ComponentRef<typeof OrbitControls>>;
  currentLevel: LevelConfig;
  focusOn?: (pos: ReadonlyVector3Tuple) => void;
  switchLevel: (levelId: string) => void;
  isVictory: boolean;
  setVictory: (val: boolean) => void;
}) => {
  return (
    <GameContext.Provider value={{ 
      orbitControlsRef, 
      currentLevel, 
      focusOn,
      switchLevel,
      isVictory,
      setVictory
    }}>
      {children}
    </GameContext.Provider>
  );
};