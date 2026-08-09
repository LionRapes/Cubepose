import { useEffect, useMemo, useRef } from "react";
import { useContainerContext } from "../context/ContainerContext";
import { Color, Group, Mesh, MeshBasicMaterial } from "three";
import { useLevel } from "../context/LevelContext";
import { COLORS, DEFAULT_GEOMETRY } from "../constants";

export function CubeContainerVisualization({ colorMap }: { colorMap: Map<number, Color> } ) {
  const { state, dimensions, containerId } = useContainerContext();
  const { grid } = state;
  const { width, height, depth } = dimensions;
  const groupRef = useRef<Group>(null!);
  const meshesRef = useRef<Map<string, Mesh>>(new Map());

  const cells = useMemo(() => {
    const result = [];
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        for (let z = 0; z < depth; z++) {
          const cellId = grid[x][y][z];
          const isOccupied = cellId > 0;
          const isBlocked = cellId === -1;

          const targetColor = isBlocked ? COLORS.blocked :
                              isOccupied ? colorMap.get(cellId) ?? COLORS.error : COLORS.empty;
          
          const targetOpacity = isBlocked ? 0.4 :
                                isOccupied ? 0.8 : 0.1;

          const key = `${x},${y},${z}`;
          result.push(
            <mesh
              key={key}
              position={[x + 0.5, y + 0.5, z + 0.5]}
              geometry={DEFAULT_GEOMETRY}
              userData={{ cellId, containerId }}
              ref={(el) => {
                if (el) {
                  meshesRef.current.set(key, el);
                } else {
                  meshesRef.current.delete(key);
                }
              }}
            >
              <meshBasicMaterial
                color={targetColor}
                transparent
                opacity={targetOpacity}
                wireframe={!isOccupied && !isBlocked}
              />
            </mesh>
          );
        }
      }
    }
    return result;
  }, [grid, width, height, depth]);

  
  const { subscribeHighlight } = useLevel();
  useEffect(() => {
    const unsubscribe = subscribeHighlight((highlight) => {
      const highlightedId = highlight?.type === 'cell' ? highlight.id : null;

      for (const [, mesh] of meshesRef.current) {
        const cellId = mesh.userData.cellId;
        
        const isOccupied = cellId > 0;
        const isBlocked = cellId === -1;
        const isHighlighted = cellId === highlightedId;

        const targetColor = isHighlighted ? COLORS.highlighted :
                            isBlocked ? COLORS.blocked :
                            isOccupied ? colorMap.get(cellId) ?? COLORS.error : COLORS.empty;
        
        const targetOpacity = isHighlighted ? 1 :
                              isBlocked ? 0.4 :
                              isOccupied ? 0.8 : 0.1;
        
        const targetWireframe = !isOccupied && !isBlocked && !isHighlighted;

        const material = mesh.material;
        if (material instanceof MeshBasicMaterial) {
          if (!material.color.equals(targetColor)) {
            material.color.copy(targetColor);
            material.needsUpdate = true;
          }
          if (material.opacity !== targetOpacity) {
            material.opacity = targetOpacity;
            material.needsUpdate = true;
          }
          if (material.wireframe !== targetWireframe) {
            material.wireframe = targetWireframe;
            material.needsUpdate = true;
          }
        }
      }
    });
    return unsubscribe;
  }, [subscribeHighlight]);
  
  return <group ref={groupRef}>{cells}</group>;
}