import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { useCameraFocus } from '../hooks/useCameraFocus';
import { useEffect, useMemo } from 'react';
import { useDebugCommands } from '../hooks/useDebugCommands';
import { useLevelSwitcher } from '../hooks/useLevelSwitcher';
import { Level } from './Level';
import { GameProvider } from '../context/GameContext';

export function GameScene() {
  const { orbitControlsRef, focusOn } = useCameraFocus();
  const { currentLevel, handleSwitchLevel } = useLevelSwitcher();

  useEffect(() => {
    handleSwitchLevel('level1');
  }, []);

  useDebugCommands( useMemo(() => ({
    lvl: (index: string) => {
      handleSwitchLevel(index);
      console.log(`Switch to ${index}`);
    }
  }), [handleSwitchLevel]));

  return (
    <GameProvider 
      orbitControlsRef={orbitControlsRef}
      currentLevel={currentLevel}
      focusOn={focusOn}
      switchLevel={handleSwitchLevel}
    >
      <OrbitControls minZoom={50} maxZoom={150} ref={orbitControlsRef} enabled={true} enablePan={false}/>
      <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50}/>

      {currentLevel && <Level key={currentLevel.id} level={currentLevel}/>}
    </GameProvider>
  );
}