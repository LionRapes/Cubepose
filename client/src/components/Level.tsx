import { CubeContainer } from './CubeContainer';
import { CubeContainerVisualization } from './CubeContainerVizualization';
import { CubeContainerEffects } from './CubeContainerEffects';
import { LevelProvider } from '../context/LevelContext';
import { LevelConfig } from '../types';
import { Piece } from './Piece';
import { Color } from 'three';
import { useMemo } from 'react';

export const Level = ({ level }: { level: LevelConfig }) => {
  if (!level) return null;
  const colorMap = useMemo(() => {
    return new Map(level.pieces.map(piece => [piece.id, new Color(piece.color)]));
  }, [level]);
  
  return (
    <LevelProvider level={level}>
      {level.containers.map(cfg => (
        <CubeContainer
         key={`${level.id}-${cfg.id}`}
         containerId={`${level.id}-${cfg.id}`}
         size={cfg.size}
         position={cfg.position}
         blockedCells={cfg.blockedCells}
        >
          <CubeContainerEffects size={cfg.size} color={cfg.outlineColor}/>
          <CubeContainerVisualization colorMap={colorMap}/>
        </CubeContainer>
      ))}
      {level.pieces.map(cfg => (
        <Piece key={cfg.id} shape={cfg.shape} pieceId={cfg.id} color={colorMap.get(cfg.id)}/>
      ))}
    </LevelProvider>
  );
};
