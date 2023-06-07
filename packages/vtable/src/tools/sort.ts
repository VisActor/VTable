import type { SortOrder } from '../ts-types';

function createArray(get: (i: number) => any, length: number): any[] {
  const array = new Array(length);
  for (let i = 0; i < length; i++) {
    array[i] = get(i);
  }
  return array;
}

export function sort(
  get: (i: number) => any,
  set: (i: number, r: any) => void,
  length: number,
  compare: (a: any, b: any, order: SortOrder) => number,
  order: SortOrder,
  getField: (r: any) => any
) {
  const old = createArray(get, length);

  old.sort((r1, r2) => (compare as (a: any, b: any, order: SortOrder) => number)(getField(r1), getField(r2), order));
  for (let i = 0; i < length; i++) {
    set(i, old[i]);
  }
}
