import { useState, useCallback } from 'react';
import { levels } from '../config/levels';
import { backgroundEvents } from '../utils/backgroundEvents';
import { LevelConfig } from '../types';

export function useLevelSwitcher() {
  const [currentLevel, setCurrentLevel] = useState<LevelConfig>(levels[0]);

  const handleSwitchLevel = useCallback((levelId: string) => {
    const level = levels.find(l => l.id === levelId);
    if (!level) {
      console.warn(`Level ${levelId} not found`);
      return;
    }
    setCurrentLevel(level);
    backgroundEvents.emit({
      type: 'flick',
      index: 1,
      appearDuration: 0.2,
      disappearDuration: 0.5,
      appearEase: 'easeInOut',
      disappearEase: 'linear',
      holdDelay: 0.1
    });
  }, []);
  
  const switchToNextLevel = useCallback(() => {
    const currentIndex = levels.findIndex(level => level.id === currentLevel?.id);
    const nextIndex = (currentIndex + 1) % levels.length;
    const nextLevel = levels[nextIndex];
    handleSwitchLevel(nextLevel.id);
  }, [currentLevel, handleSwitchLevel]);

  return {
    currentLevel,
    handleSwitchLevel,
    switchToNextLevel
  };
}