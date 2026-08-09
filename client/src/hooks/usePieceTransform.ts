import { useState, useCallback } from 'react';
import { CubeOffset, PieceShape, ReadonlyVector3Tuple } from '../types';

export function usePieceTransform(initialShape: PieceShape, initialPosition?: ReadonlyVector3Tuple) {
  const [shape, setShape] = useState(initialShape);
  const [position, setPosition] = useState<CubeOffset>(initialPosition ?? [0, 0, 0]);

  const rotateY = useCallback(() => {
    setShape(prev => prev.map(([x, y, z]) => [z, y, -x]));
  }, []);

  const rotateX = useCallback(() => {
    setShape(prev => prev.map(([x, y, z]) => [x, -z, y]));
  }, []);

  const rotateZ = useCallback(() => {
    setShape(prev => prev.map(([x, y, z]) => [-y, x, z]));
  }, []);

  const move = useCallback((dx: number, dy: number, dz: number) => {
    setPosition(([x, y, z]) => [x + dx, y + dy, z + dz]);
  }, []);

  const getAbsoluteCubes = useCallback(() => {
    return shape.map(([sx, sy, sz]) => [
      sx + position[0],
      sy + position[1],
      sz + position[2],
    ]) as CubeOffset[];
  }, [shape, position]);

  return { shape, position, rotateY, rotateX, rotateZ, move, getAbsoluteCubes, setPosition };
}