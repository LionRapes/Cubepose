import * as THREE from 'three';

export function createGradientTexture(colors: string[]) {
  const data = new Uint8Array(
    colors.flatMap(color => {
      const c = new THREE.Color(color).convertLinearToSRGB();
      return [c.r, c.g, c.b, 1].map(v => Math.round(v * 255));
    })
  );
  
  const texture = new THREE.DataTexture(data, 2, 2, THREE.RGBAFormat);
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  
  return texture;
}