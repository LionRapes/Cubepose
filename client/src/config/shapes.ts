import { PieceShape } from "../types";

export const L_SHAPE: PieceShape = [
  [1, 0, 0],
  [1, 1, 0],
  [1, 2, 0],
  [2, 2, 0],
];

export const T_SHAPE: PieceShape = [
  [0, 0, 0],
  [1, 0, 0],
  [2, 0, 0],
  [1, 1, 0],
  [1, 2, 0],
];

export function getShapeCenter(shape: PieceShape): [number, number, number] {
  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;
  
  for (const [x, y, z] of shape) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }
  
  return [(minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2];
}