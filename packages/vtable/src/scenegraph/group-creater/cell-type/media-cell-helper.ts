import type { IImage } from '@src/vrender';
import type { Group } from '../../graphic/group';

export const CELL_MEDIA_KEY = '__vtable_cell_media__';
export const CELL_MEDIA_KIND_KEY = '__vtable_cell_media_kind__';
export type CellMediaKind = 'image' | 'play-icon';

export function markCellMedia<T>(graphic: T, kind: CellMediaKind): T {
  (graphic as any)[CELL_MEDIA_KEY] = true;
  (graphic as any)[CELL_MEDIA_KIND_KEY] = kind;
  return graphic;
}

export function isCellMedia(graphic: any): boolean {
  return graphic?.[CELL_MEDIA_KEY] === true;
}

export function getCellMediaChildren(cellGroup: Group): any[] {
  const mediaChildren: any[] = [];
  cellGroup.forEachChildren((child: any) => {
    if (isCellMedia(child)) {
      mediaChildren.push(child);
    }
  });
  return mediaChildren;
}

function getCellMediaByKind(cellGroup: Group, kind: CellMediaKind): any {
  let graphic: any;
  cellGroup.forEachChildren((child: any) => {
    if (isCellMedia(child) && child[CELL_MEDIA_KIND_KEY] === kind) {
      graphic = child;
      return true;
    }
    return false;
  });
  return graphic;
}

export function getCellMediaImage(cellGroup: Group): IImage | undefined {
  return getCellMediaByKind(cellGroup, 'image');
}

export function getCellMediaPlayIcon(cellGroup: Group): any {
  return getCellMediaByKind(cellGroup, 'play-icon');
}
