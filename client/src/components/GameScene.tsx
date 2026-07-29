import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { CubeContainer } from './CubeContainer';
import { CubeContainerVisualization } from './CubeContainerVizualization';
import { useCameraFocus } from '../hooks/useCameraFocus';
import { Vector3 } from 'three';
import { CONTAINERS } from '../config/containers';
import { CubeContainerEffects } from './CubeContainerEffects';

export function GameScene() {
  const { controlsRef, focusOn } = useCameraFocus();

  return (
    <>
      <OrbitControls minZoom={50} maxZoom={150} ref={controlsRef} target={[1.5, 1.5, 1.5]}/>
      <OrthographicCamera makeDefault position={[10, 10, 10]} zoom={50}/>


      {CONTAINERS.map((cfg, index) => (
        <CubeContainer
          key={index}
          size={cfg.size}
          position={cfg.position}
          blockedCells={cfg.blockedCells}
          onActivate={(center) => focusOn(new Vector3(...center))}
        >
          <CubeContainerEffects size={cfg.size} color={cfg.outlineColor}/>
          <CubeContainerVisualization />
        </CubeContainer>
      ))}
   </>
  );
}