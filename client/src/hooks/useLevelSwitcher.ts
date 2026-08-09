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

  return {
    currentLevel,
    handleSwitchLevel
  };
}