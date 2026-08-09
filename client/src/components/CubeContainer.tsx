import { ReactNode } from "react";
import { CubeOffset, ReadonlyVector3Tuple } from "../types";
import { useLevel } from "../context/LevelContext";
import { ContainerProvider } from "../context/ContainerContext";

interface CubeContainerProps {
  containerId: string;
  size: ReadonlyVector3Tuple;
  position?: ReadonlyVector3Tuple;
  blockedCells?: CubeOffset[];
  children: ReactNode;
}

export function CubeContainer({
  containerId,
  size,
  position = [0, 0, 0],
  blockedCells = [],
  children
}: CubeContainerProps) {
  const [width, height, depth] = size;
  const {activeContainerId, setActiveContainerId} = useLevel();

  return (
    <ContainerProvider 
      containerId={containerId}  
      position={position} 
      width={width} height={height} depth={depth} 
      blockedCells={blockedCells}
    >
      <group position={position} userData={{containerId}}>
        {activeContainerId !== containerId && (
          <mesh 
           position={[width/2, height/2, depth/2]} 
           onClick={(() => setActiveContainerId(containerId))} visible={false}
          >
            <boxGeometry args={[width*1.5, height*1.5, depth*1.5]}/>
          </mesh>
        )}
        {children}
      </group>
    </ContainerProvider>
    
  );
}