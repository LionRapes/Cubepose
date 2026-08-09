import { RefObject } from "react";
import { Camera, Intersection, Object3D, Object3DEventMap, Raycaster, Vector2, Vector3 } from "three";

export type Vector3Tuple = [number, number, number];
export type ReadonlyVector3Tuple = readonly [number, number, number];

export type CubeOffset = ReadonlyVector3Tuple;
export type PieceShape = CubeOffset[];
export type Grid3D = number[][][];

// CONFIG
export interface LevelConfig {
  id: string;
  containers: ContainerConfig[];
  pieces: {id: number, shape: PieceShape, color: string}[];
}

export interface ContainerConfig {
  id: string;
  size: ReadonlyVector3Tuple;
  position: ReadonlyVector3Tuple;
  blockedCells: CubeOffset[];
  outlineColor: string;
}

// ACTIONS
export type ContainerAction =
  | { type: 'PLACE_PIECE'; pieceId: number; cubes: CubeOffset[]; onResult?: (success: boolean) => void }
  | { type: 'REMOVE_PIECE'; pieceId: number; onResult?: (success: boolean) => void }


// STATES
export type DragState = {
  state: RefObject<{ offset: ReadonlyVector3Tuple | null, distance: number }>;
  start: (offset: ReadonlyVector3Tuple, distance: number) => void;
  stop: () => void;
  isActive: () => boolean;
};

export type HighlightState = {
  id: number;
  type: 'piece' | 'cell' | null;
};

export interface ContainerState {
  grid: Grid3D;
}

export interface PieceState {
  isPlaced: boolean;
}

export interface LevelState {
  containers: Map<string, ContainerState>;
  pieces: Map<string, PieceState>;
}

// CONTROLS
export type ContainerControl = {
  getState: () => ContainerState;
  getPosition: () => ReadonlyVector3Tuple;
  placePiece: (cubes: CubeOffset[], pieceId: number) => Promise<boolean>;
  removePiece: (pieceId: number) => Promise<boolean>;
  isComplete: () => boolean;
};

export type PieceControl = {
  getPosition: () => Vector3;
  setPlaced: (placed: boolean) => void;
  isPlaced: RefObject<boolean>
  getShape: () => PieceShape;
};

// HANDLERS
export type PointerHandler = (
  event: PointerEvent,
  intersects: Intersection[],
  { camera, raycaster, pointer}: {camera: Camera, raycaster: Raycaster, pointer: Vector2}
) => void;

export type DragHandler = (
  state: DragState,
  targetVec: Vector3,
  { camera, raycaster, pointer, hits, button, deltaX, deltaY}: 
    {camera: Camera, raycaster: Raycaster, pointer: Vector2, hits: Intersection[], button: number, deltaX: number, deltaY: number}
) => void;

// PREDICATES
export type DragPredicate = (
  state: DragState,
  targetVec: Vector3,
  { camera, raycaster, pointer, hits, button}: {camera: Camera, raycaster: Raycaster, pointer: Vector2, hits: Intersection[], button: number}
) => boolean;


// CALLBACKS
export type PointerCallback = {
    hits: RefObject<Intersection<Object3D<Object3DEventMap>>[]>;
    computeIntersects: () => Intersection<Object3D<Object3DEventMap>>[];
    addOnMove: (callback: PointerHandler) => void;
    addOnDown: (callback: PointerHandler) => void;
    addOnUp: (callback: PointerHandler) => void;
    removeOnMove: (callback: PointerHandler) => void
    removeOnDown: (callback: PointerHandler) => void
    removeOnUp: (callback: PointerHandler) => void
}