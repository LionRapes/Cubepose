export const EASINGS = {
  linear: (t: number) => t,
  
  easeIn: (t: number) => t * t,
  
  easeOut: (t: number) => 1 - (1 - t) * (1 - t),
  
  easeInOut: (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2,
  
  easeInBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return c3 * t * t * t - c1 * t * t;
  },
  
  easeOutBack: (t: number) => {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  },
  
  easeInOutBack: (t: number) => {
    const c1 = 1.70158;
    const c2 = c1 * 1.525;
    return t < 0.5
      ? (Math.pow(2 * t, 2) * ((c2 + 1) * 2 * t - c2)) / 2
      : (Math.pow(2 * t - 2, 2) * ((c2 + 1) * (t * 2 - 2) + c2) + 2) / 2;
  },
  
  elasticOut: (t: number) => {
    const c4 = (2 * Math.PI) / 3;
    return t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * c4) + 1;
  },
  
  bounceOut: (t: number) => {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) return n1 * t * t;
    if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
    if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
    return n1 * (t -= 2.625 / d1) * t + 0.984375;
  },
  
  quadIn: (t: number) => t * t,
  
  quadOut: (t: number) => t * (2 - t),
  
  quadInOut: (t: number) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
  
  cubicIn: (t: number) => t * t * t,
  
  cubicOut: (t: number) => 1 - Math.pow(1 - t, 3),
  
  cubicInOut: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
  
  sineIn: (t: number) => 1 - Math.cos((t * Math.PI) / 2),
  
  sineOut: (t: number) => Math.sin((t * Math.PI) / 2),
  
  sineInOut: (t: number) => -(Math.cos(Math.PI * t) - 1) / 2,
  
  exponentialIn: (t: number) => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
  
  exponentialOut: (t: number) => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
  
  exponentialInOut: (t: number) => {
    return t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2;
  },
} as const;

export type EasingName = keyof typeof EASINGS;

export const getEasing = (name: EasingName): ((t: number) => number) => {
  return EASINGS[name] || EASINGS.linear;
};

export const applyEasing = (progress: number, easingName: EasingName): number => {
  const easing = getEasing(easingName);
  return easing(progress);
};

export const easingList = Object.keys(EASINGS) as EasingName[];