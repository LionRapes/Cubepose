import { Material, MeshBasicMaterial, ShaderMaterial } from "three";
import { useGradientTexture } from "./useTexture";

import defaultVertexShader from '../shaders/vertex/default.vert.glsl';
import defaultFragmentShader from '../shaders/fragment/default.frag.glsl';

interface GradientMaterialProps {
  colors: readonly string[];
  vertexShader?: string;
  fragmentShader?: string;
  uniforms?: Record<string, any>;
  opacity?: number;
  transparent?: boolean;
  depthWrite?: boolean;
}

export function useGradientMaterial({ 
  colors,
  vertexShader,
  fragmentShader,
  uniforms,
  opacity = 1,
  transparent = false,
  depthWrite = true
}: GradientMaterialProps): Material | null {
  const texture = useGradientTexture(colors);
  if (!texture) return null;
  
  const material = vertexShader || fragmentShader
    ? new ShaderMaterial({
        uniforms: { ...uniforms, uTexture: { value: texture } },
        vertexShader: vertexShader || defaultVertexShader,
        fragmentShader: fragmentShader || defaultFragmentShader,
        transparent,
        depthWrite: depthWrite
      })
    : new MeshBasicMaterial({
        map: texture,
        transparent,
        opacity,
        depthWrite: depthWrite
      });


  return material;
}