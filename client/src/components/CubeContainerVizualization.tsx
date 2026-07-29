import { useGameContext } from "../context/GameContext";

export function CubeContainerVisualization() {
  const { state, dimensions, blockedCells } = useGameContext();
  const { grid } = state;
  const { width, height, depth } = dimensions;

  const blockedSet = new Set(
    blockedCells.map(([x, y, z]) => `${x},${y},${z}`)
  );

  const cells = [];
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      for (let z = 0; z < depth; z++) {
        const isOccupied = grid[x][y][z];
        const isBlocked = blockedSet.has(`${x},${y},${z}`);

        let color: string;
        let opacity: number;

        if (isBlocked) {
          color = "#666666";
          opacity = 0.4;
        } else if (isOccupied) {
          color = "#00ff00";
          opacity = 0.8;
        } else {
          color = "#000000";
          opacity = 0.1;
        }

        cells.push(
          <mesh
            key={`${x},${y},${z}`}
            position={[x + 0.5, y + 0.5, z + 0.5]}
          >
            <boxGeometry args={[0.98, 0.98, 0.98]} />
            <meshBasicMaterial
              color={color}
              transparent
              opacity={opacity}
              wireframe={!isOccupied && !isBlocked}
            />
          </mesh>
        );
      }
    }
  }

  return <group>{cells}</group>;
}