// import type { IEditor } from '@visactor/vtable-editors';
type IEditor = any;
export const editors: { [key: string]: IEditor } = {};
export function get(): { [key: string]: IEditor } {
  return editors;
}
