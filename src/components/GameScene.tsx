import { Html, OrbitControls, OrthographicCamera } from '@react-three/drei';
import { useCameraFocus } from '../hooks/useCameraFocus';
import { useEffect, useEffectEvent, useMemo, useState } from 'react';
import { useDebugCommands } from '../hooks/useDebugCommands';
import { useLevelSwitcher } from '../hooks/useLevelSwitcher';
import { Level } from './Level';
import { GameProvider } from '../context/GameContext';
import { backgroundEvents } from '../utils/backgroundEvents';

export function GameScene() {
  const { orbitControlsRef, focusOn } = useCameraFocus();
  const { currentLevel, handleSwitchLevel, switchToNextLevel } = useLevelSwitcher();
  const [isVictory, setVictory] = useState(false);

  useEffect(() => {
    handleSwitchLevel('level1');
  }, []);

  useEffect(() => {
    if (isVictory) {
      setTimeout(() => {
        backgroundEvents.emit({
          type: 'switch',
          index: 1,
          duration: 1,
          ease: 'easeInOut'
        });
      }, 100);
      
    } else {
      setTimeout(() => {
        backgroundEvents.emit({
          type: 'switch',
          index: 0,
          duration: 1,
          ease: 'easeInOut'
        });
      }, 1000);
    }
  }, [isVictory]);

  useDebugCommands( useMemo(() => ({
    lvl: (index: string) => {
      setVictory(false);
      handleSwitchLevel(index);
      console.log(`Switch to ${index}`);
    },
    change: (index: boolean) => {
      setVictory(index);
    }
  }), [handleSwitchLevel]));

  const onKeyDown = useEffectEvent((e: KeyboardEvent) => {
    if (isVictory && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      switchToNextLevel();
      setVictory(false);
    }
  });
  
  useEffect(() => {
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <GameProvider 
      orbitControlsRef={orbitControlsRef}
      currentLevel={currentLevel}
      focusOn={focusOn}
      switchLevel={handleSwitchLevel}
      isVictory={isVictory}
      setVictory={setVictory}
    >
      <OrbitControls minZoom={50} maxZoom={150} ref={orbitControlsRef} enabled={true} enablePan={false} minPolarAngle={0.5} maxPolarAngle={2.6}/>
      <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50}/>

      {currentLevel && <Level key={currentLevel.id} level={currentLevel}/>}

      {isVictory && (
        <Html fullscreen calculatePosition={(_el, _camera, size) => [size.width / 2, size.height / 2]}>
          <div 
            style={{ 
              position: 'fixed',
              left: '50%',
              transform: 'translate(-50%, 0%)',
              userSelect: 'none',
              textAlign: 'center',
              animation: 'bounceIn 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
              fontFamily: 'Pixelify Sans, sans-serif',
            }}>

            <div style={{ textAlign: 'center', pointerEvents: 'none', userSelect: 'none' }}>
              <h1 
                style={{ 
                  color: '#22d3ee',
                  fontSize: '4.5rem',
                  textShadow: '0 4px 20px rgba(34, 211, 238, 0.4)',
                  background: 'linear-gradient(45deg, #22d3ee, #a78bfa)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '0 0',
                  animation: 'slideUp 0.8s ease-out forwards',
                  opacity: '0'
                }}
              >
                Congratulation.
              </h1>
              <h2 
                style={{ 
                  color: '#15fa4a',
                  borderTop: '0',
                  fontSize: '2.8rem',
                  textShadow: '0 0px 20px rgba(201, 254, 255, 0.8)',
                  background: 'linear-gradient(45deg, #15fa4a 0%, #59ffc8 80%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  margin: '-5px 0',
                  animation: 'slideUp 0.8s 0.3s ease-out forwards',
                  opacity: 0,
                }}
              >
                You won! ⭐
              </h2>
            </div>

            <h2
              role="button"
              tabIndex={0}
              style={{
                position: 'fixed',
                left: '50%',
                transform: 'translate(-50%, 0%)',
                top: '85vh',
                width: '100%',
                margin: '20px 0',
                fontSize: '2rem',
                fontWeight: '700',
                padding: '15px',
                color: '#15fa4a',
                background: 'transparent',
                borderRadius: '16px',
                cursor: 'pointer',
                textShadow: '0 0 20px rgba(25, 255, 48, 0.4)',
                transition: 'all 0.3s ease',
                userSelect: 'none',
                animation: 'slideDown 0.8s 0.3s ease-out forwards',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'linear-gradient(135deg, #15fa4a, #7bf197)';
                e.currentTarget.style.color = '#0a0a0a';
                e.currentTarget.style.boxShadow = '0 0 40px rgba(25, 255, 48, 0.6)';
                e.currentTarget.style.transform = 'scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#15fa4a';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'scale(1)';
              }}
              onClick={() => {
                switchToNextLevel();
                setVictory(false);
              }}
            >
              Press any button to continue
            </h2>
          </div>
        </Html>
      )}
    </GameProvider>
  );
}