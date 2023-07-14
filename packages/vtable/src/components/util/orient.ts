import type { IOrientType } from '../../ts-types/component/util';

export function isXAxis(orient: IOrientType) {
  return orient === 'bottom' || orient === 'top';
}

export function isYAxis(orient: IOrientType) {
  return orient === 'left' || orient === 'right';
}
