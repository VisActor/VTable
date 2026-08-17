import type { IImage } from '@src/vrender';
import type { Group } from '../../graphic/group';

export const VIDEO_CELL_MEDIA_KEY = '__vtable_video_cell_media__';
export const VIDEO_CELL_MEDIA_KIND_KEY = '__vtable_video_cell_media_kind__';
export type VideoCellMediaKind = 'image' | 'play-icon';

export function markVideoCellMedia<T>(graphic: T, kind: VideoCellMediaKind): T {
  (graphic as any)[VIDEO_CELL_MEDIA_KEY] = true;
  (graphic as any)[VIDEO_CELL_MEDIA_KIND_KEY] = kind;
  return graphic;
}

export function isVideoCellMedia(graphic: any): boolean {
  return graphic?.[VIDEO_CELL_MEDIA_KEY] === true;
}

export function getVideoCellMediaChildren(cellGroup: Group): any[] {
  const mediaChildren: any[] = [];
  cellGroup.forEachChildren((child: any) => {
    if (isVideoCellMedia(child)) {
      mediaChildren.push(child);
    }
  });
  return mediaChildren;
}

function getVideoCellMediaByKind(cellGroup: Group, kind: VideoCellMediaKind): any {
  let graphic: any;
  cellGroup.forEachChildren((child: any) => {
    if (isVideoCellMedia(child) && child[VIDEO_CELL_MEDIA_KIND_KEY] === kind) {
      graphic = child;
      return true;
    }
    return false;
  });
  return graphic;
}

export function getVideoCellMediaImage(cellGroup: Group): IImage | undefined {
  return getVideoCellMediaByKind(cellGroup, 'image');
}

export function getVideoCellMediaPlayIcon(cellGroup: Group): any {
  return getVideoCellMediaByKind(cellGroup, 'play-icon');
}
