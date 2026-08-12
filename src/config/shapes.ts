import { PieceShape, Vector3Tuple } from "../types";

export const L_SHAPE: PieceShape = [
  [1, 0, 0],
  [1, 1, 0],
  [1, 2, 0],
  [2, 2, 0],
];

export const SMALL_L_SHAPE: PieceShape = [
  [1, 0, 0],
  [1, 1, 0],
  [2, 1, 0],
];

export const LINE_SHAPE: PieceShape = [
  [0, 0, 0],
  [0, 1, 0],
  [0, 2, 0],
];

export const SMALL_LINE_SHAPE: PieceShape = [
  [0, 0, 0],
  [0, 1, 0],
];

export const Z_SHAPE: PieceShape = [
  [0, 1, 0],
  [1, 0, 0],
  [1, 1, 0],
  [2, 0, 0],
];

export const SMALL_WALL_SHAPE: PieceShape = [
  [0, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 0],
];

export const O_SHAPE: PieceShape = [
  [0, 0, 0],
  [0, 1, 0],
  [1, 1, 0],
  [1, 0, 0],
  [0, 0, 1],
  [0, 1, 1],
  [1, 1, 1],
  [1, 0, 1],
];

export const I_SHAPE: PieceShape = [
  [0, 0, 0],
  [2, 0, 0],
  [1, 0, 0],
  [1, 1, 0],
  [1, 2, 0],
  [0, 2, 0],
  [2, 2, 0],
];

export const T_SHAPE: PieceShape = [
  [0, 0, 0],
  [1, 0, 0],
  [2, 0, 0],
  [1, 1, 0],
  [1, 2, 0],
];

export const SMALL_T_SHAPE: PieceShape = [
  [0, 0, 0],
  [1, 0, 0],
  [2, 0, 0],
  [1, 1, 0],
];

export const WALL_SHAPE: PieceShape = [
  [0, 0, 0], [0, 1, 0], [0, 2, 0],
  [1, 0, 0], [1, 1, 0], [1, 2, 0],
  [2, 0, 0], [2, 1, 0], [2, 2, 0],
];

export function getShapeCenter(shape: PieceShape): Vector3Tuple {
  if (!shape || shape.length === 0) {
    return [0, 0, 0];
  }

  const xs = shape.map(coord => coord[0]);
  const ys = shape.map(coord => coord[1]);
  const zs = shape.map(coord => coord[2]);

  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  
  const minZ = Math.min(...zs);
  const maxZ = Math.max(...zs);

  const centerX = (minX + maxX) / 2;
  const centerY = (minY + maxY) / 2;
  const centerZ = (minZ + maxZ) / 2;

  return [centerX, centerY, centerZ];
}