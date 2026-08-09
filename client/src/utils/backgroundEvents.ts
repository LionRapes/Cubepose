import { EasingName } from './easings';

type BgCommand = 
  | { type: 'switch'; index: number; duration?: number; ease?: EasingName }
  | { type: 'flick'; index: number; appearDuration?: number; disappearDuration?: number; appearEase?: EasingName; disappearEase?: EasingName; holdDelay?: number };

type Listener = (cmd: BgCommand) => void;
const listeners = new Set<Listener>();

export const backgroundEvents = {
  emit(cmd: BgCommand) {
    listeners.forEach((l) => l(cmd));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};