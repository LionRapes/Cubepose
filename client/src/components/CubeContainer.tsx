import React from "react";
import { CubeOffset } from "../types";
import { GameProvider } from "../context/GameContext";

interface CubeContainerProps {
  size: [number, number, number];
  position?: [number, number, number];
  blockedCells?: CubeOffset[];
  children: React.ReactNode;
  onActivate?: (center: [number, number, number]) => void;
}

export function CubeContainer({
  size,
  blockedCells = [],
  children,
  position = [0, 0, 0],
  onActivate
}: CubeContainerProps) {
  const [width, height, depth] = size;
  const center: [number, number, number] = [width / 2, height / 2, depth / 2];

  const handleClick = () => {
    if (onActivate) {
      onActivate([
        position[0] + center[0],
        position[1] + center[1],
        position[2] + center[2],
      ]);
    }
  };

  return (
    <GameProvider width={width} height={height} depth={depth} blockedCells={blockedCells}>
      <group position={position}>
        <mesh position={center} onClick={handleClick} visible={false}>
          <boxGeometry args={[width*1.5, height*1.5, depth*1.5]}/>
        </mesh>
        {children}
      </group>
    </GameProvider>
    
  );
}