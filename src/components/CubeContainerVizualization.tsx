import { useEffect, useMemo, useRef } from "react";
import { useContainerContext } from "../context/ContainerContext";
import { Color, Group, Mesh, MeshBasicMaterial } from "three";
import { useLevel } from "../context/LevelContext";
import { DEFAULT_GEOMETRY } from "../constants";
import { CELL_COLORS } from "../config/colors";

export function CubeContainerVisualization({ colorMap }: { colorMap: Map<number, Color> } ) {
  const { state, dimensions, containerId, isComplete } = useContainerContext();
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
          
          const targetColor = isBlocked ? CELL_COLORS.blocked :
                              isOccupied ? colorMap.get(cellId) ?? CELL_COLORS.error : CELL_COLORS.empty;
          
          const targetOpacity = isComplete() ? 1 :
                                isBlocked ? 0.4 :
                                isOccupied ? 0.9 : 0.05;

          if (isComplete()) targetColor.lerp(CELL_COLORS.finished, .05);

          const key = `${x},${y},${z}`;
          result.push(
            <mesh
              key={key}
              position={[x + 0.5, y + 0.5, z + 0.5]}
              geometry={DEFAULT_GEOMETRY}
              userData={{ cellId, containerId, cellPos: [x, y, z] }}
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

        const targetColor = isHighlighted ? CELL_COLORS.highlighted :
                            isBlocked ? CELL_COLORS.blocked :
                            isOccupied ? colorMap.get(cellId) ?? CELL_COLORS.error : CELL_COLORS.empty;
        
        const targetOpacity = isHighlighted || isComplete() ? 1 :
                              isBlocked ? 0.4 :
                              isOccupied ? 0.9 : 0.05;

        if (isComplete()) targetColor.lerp(CELL_COLORS.finished, .05);
        
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
        }
      }
    });
    return unsubscribe;
  }, [subscribeHighlight, isComplete]);
  
  return <group ref={groupRef}>{cells}</group>;
}