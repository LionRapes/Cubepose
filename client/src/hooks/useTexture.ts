import * as THREE from 'three';
import { useEffect, useState } from 'react';
import { createGradientTexture } from '../utils/texture';

export function useTexture<T>(
  params: T,
  createTexture: (params: T) => THREE.Texture
) {
  const [texture, setTexture] = useState<THREE.Texture | null>(null);

  useEffect(() => {
    const tex = createTexture(params);
    setTexture(tex);

    return () => {
      tex.dispose();
    };
  }, [params, createTexture]);

  return texture;
}

export function useGradientTexture(colors: readonly string[]) {
  return useTexture(colors, createGradientTexture);
}