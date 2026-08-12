import { useEffect, useState } from 'react';
import { createGradientTexture } from '../utils/texture';
import { Color, Texture } from 'three';

export function useTexture<T>(
  params: T,
  createTexture: (params: T) => Texture
) {
  const [texture, setTexture] = useState<Texture | null>(null);

  useEffect(() => {
    const tex = createTexture(params);
    setTexture(tex);

    return () => {
      tex.dispose();
    };
  }, [params, createTexture]);

  return texture;
}

export function useGradientTexture(colors: readonly Color[]) {
  return useTexture(colors, createGradientTexture);
}