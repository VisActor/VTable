import type { IEditor } from '@visactor/vtable-editors';

export const editors: { [key: string]: IEditor } = {};
export function get(): { [key: string]: IEditor } {
  return editors;
}
