import { Quaternion, Vector3 } from "three";
import { RoundedBoxGeometry } from "three-stdlib";

// export const DEFAULT_GEOMETRY = new BoxGeometry(0.98, 0.98, 0.98);
export const DEFAULT_GEOMETRY = new RoundedBoxGeometry(1, 1, 1, 1, .1);
export const DEFAULT_QUATERNION = new Quaternion();
export const DEFAULT_SCALE = new Vector3(1, 1, 1);