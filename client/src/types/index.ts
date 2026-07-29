export type Vector3Tuple = [number, number, number];
export type ReadonlyVector3Tuple = readonly [number, number, number];

export type CubeOffset = ReadonlyVector3Tuple;
export type Grid3D = boolean[][][];

export interface PieceData {
  name: string;
  cubes: CubeOffset[];
}

export interface ContainerState {
  grid: Grid3D;
  placedCubes: CubeOffset[];
}
export type ContainerAction =
  | { type: "PLACE_PIECE"; cubes: CubeOffset[] }
  | { type: "RESET"; width: number; height: number; depth: number; blockedCells: CubeOffset[] };