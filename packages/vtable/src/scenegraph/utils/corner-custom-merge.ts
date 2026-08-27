import type { Group as VGroup } from '@src/vrender';
import type { CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { CUSTOM_CONTAINER_NAME } from '../component/custom';
import { Group } from '../graphic/group';

export function isCornerCustomMergeRange(range: CellRange | undefined, table: BaseTableAPI): boolean {
  return (
    !!range?.isCustom &&
    table.isCornerHeader(range.start.col, range.start.row) &&
    table.isCornerHeader(range.end.col, range.end.row)
  );
}

export function shouldRenderCornerCustomMergeContent(
  col: number,
  row: number,
  range: CellRange | undefined,
  table: BaseTableAPI
): boolean {
  return !isCornerCustomMergeRange(range, table) || (col === range.end.col && row === range.end.row);
}

export function createCornerCustomMergeContainer(
  customElementsGroup: VGroup | undefined,
  width: number,
  height: number,
  range: CellRange | undefined,
  table: BaseTableAPI,
  col: number,
  row: number
): VGroup | undefined {
  if (!customElementsGroup || !isCornerCustomMergeRange(range, table)) {
    return customElementsGroup;
  }

  const customContainer = new Group({
    x: 0,
    y: 0,
    width,
    height,
    fill: false,
    stroke: false,
    pickable: false,
    clip: true
  });
  customContainer.name = CUSTOM_CONTAINER_NAME;
  customContainer.col = col;
  customContainer.row = row;
  customContainer.appendChild(customElementsGroup);

  return customContainer as unknown as VGroup;
}
