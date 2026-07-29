import { CubeOffset } from "../types";

export interface ContainerConfig {
  size: [number, number, number];
  position: [number, number, number];
  blockedCells: CubeOffset[];
  outlineColor: string;
}

export const CONTAINERS: ContainerConfig[] = [
  {
    size: [3, 3, 3],
    position: [0, 0, 0],
    blockedCells: [[0, 0, 0], [0, 0, 1]],
    outlineColor: 'white'
  },
  {
    size: [3, 8, 3],
    position: [8, 0, 0],
    blockedCells: [[0, 0, 0], [0, 1, 0]],
    outlineColor: 'cyan'
  },
];