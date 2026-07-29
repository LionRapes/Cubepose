import { Color, DataTexture, LinearFilter, RGBAFormat } from "three";

export function createGradientTexture(colors: readonly string[]) {
  const data = new Uint8Array(
    colors.flatMap(color => {
      const c = new Color(color).convertLinearToSRGB();
      return [c.r, c.g, c.b, 1].map(v => Math.round(v * 255));
    })
  );
  
  const texture = new DataTexture(data, 2, 2, RGBAFormat);
  texture.magFilter = LinearFilter;
  texture.minFilter = LinearFilter;
  texture.needsUpdate = true;
  
  return texture;
}