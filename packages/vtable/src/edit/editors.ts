import type { IEditor } from '@visactor/vtable-editors';
export const editors: { [key: string]: IEditor } = {};
export function get(editorName: string): IEditor {
  const editor = editors[editorName];
  if (!editor) {
    console.warn('editor should register before init table!');
    return undefined;
  }
  return editors[editorName];
}
