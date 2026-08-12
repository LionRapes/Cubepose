import { Vector3 } from 'three';

export type CameraCommand =
  | { type: 'focusStart'; center: Vector3 }
  | { type: 'focusEnd'; center: Vector3 };

type Listener = (cmd: CameraCommand) => void;
const listeners = new Set<Listener>();

export const cameraEvents = {
  emit(cmd: CameraCommand) {
    listeners.forEach((l) => l(cmd));
  },
  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};