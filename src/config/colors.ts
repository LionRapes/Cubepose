import { Color } from "three";

export const BACKGROUND_COLORS = {
  DEFAULT: [
    new Color('#FF9A75'),
    new Color('#FFBA88'),
    new Color('#FF9F64'),
    new Color('#FFBC7C')
  ],
  CHANGE_LEVEL: [
    new Color('#85D4A7'),
    new Color('#9FE4BE'),
    new Color('#7FCF96'),
    new Color('#95DEB0')
  ],
  ERROR: [
    new Color('#ff0000'),
    new Color('#eb5244'),
    new Color('#e91b1b'),
    new Color('#d63d68')
  ],
  PLACE_PIECE: [
    new Color('#C5E1A5'),
    new Color('#AED581'),
    new Color('#9CCC65'),
    new Color('#8BC34A'),
  ],
} as const;

export const CELL_COLORS = {
  highlighted: new Color('#dee423'),
  blocked: new Color('#666666'),
  empty: new Color('#000000'),
  finished: new Color('orange'),
  error: new Color('red')
} as const;