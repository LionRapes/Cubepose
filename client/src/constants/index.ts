import { BoxGeometry, Color, Quaternion, Vector3 } from "three";

export const DEFAULT_GEOMETRY = new BoxGeometry(0.98, 0.98, 0.98);
export const DEFAULT_QUATERNION = new Quaternion();
export const DEFAULT_SCALE = new Vector3(1, 1, 1);

export const COLORS = {
  highlighted: new Color('#dee423'),
  blocked: new Color('#666666'),
  empty: new Color('#000000'),
  error: new Color('red')
};

// HUD
export const HUD_SCALE = new Vector3(.5, .5, .5);
export const HUD_MARGIN_X = -1.;
export const HUD_MARGIN_Y = 1;
export const HUD_SPACING_X = 2;