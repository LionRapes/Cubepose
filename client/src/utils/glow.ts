export function generateGlowLayers(
  size: readonly [number, number, number],
  glowLayers: number,
  scaleStep: number,
  glowIntensity: number
) {
  const [w, h, d] = typeof size === 'number' ? [size, size, size] : size;
  const layers = [];
  for (let i = 0; i <= glowLayers; i++) {
    const scale = 1 + i * scaleStep;
    const opacity = i === 0 ? 1 : Math.max(0, glowIntensity / (i * 0.6 + 0.4));
    layers.push({
      scale,
      opacity,
      transparent: i !== 0,
      depthWrite: i === 0,
    });
  }
  return { layers, w, h, d };
}