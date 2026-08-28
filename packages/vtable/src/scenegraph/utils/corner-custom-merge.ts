import type { Group as VGroup } from '@src/vrender';
import type { CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { CUSTOM_CONTAINER_NAME, CUSTOM_MERGE_CONTAINER_NAME } from '../component/custom';
import { Group } from '../graphic/group';

export type CornerCustomMergeRangeUpdateMap = Map<string, CellRange>;

export function isCornerCustomMergeRange(range: CellRange | undefined, table: BaseTableAPI): boolean {
  return (
    !!range?.isCustom &&
    (range.start.col !== range.end.col || range.start.row !== range.end.row) &&
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
  table: BaseTableAPI
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
  customContainer.col = range.start.col;
  customContainer.row = range.start.row;
  customContainer.appendChild(customElementsGroup);

  return customContainer as unknown as VGroup;
}

export function updateCornerCustomMergeContent(range: CellRange, table: BaseTableAPI): void {
  refreshCornerCustomMergeContent(range, table);
}

export function queueCornerCustomMergeContentUpdate(
  range: CellRange,
  table: BaseTableAPI,
  pendingRanges?: CornerCustomMergeRangeUpdateMap
): void {
  if (!pendingRanges) {
    refreshCornerCustomMergeContent(range, table);
    return;
  }

  pendingRanges.set(getCornerCustomMergeRangeKey(range), range);
}

export function flushCornerCustomMergeContentUpdates(
  pendingRanges: CornerCustomMergeRangeUpdateMap,
  table: BaseTableAPI
): void {
  pendingRanges.forEach(range => {
    refreshCornerCustomMergeContentForResize(range, table);
  });
  pendingRanges.clear();
}

function getCornerCustomMergeRangeKey(range: CellRange): string {
  return `${range.start.col}-${range.start.row}-${range.end.col}-${range.end.row}`;
}

function refreshCornerCustomMergeContent(range: CellRange, table: BaseTableAPI): void {
  const cellGroup = table.scenegraph.getCell(range.end.col, range.end.row);
  const customContainer =
    cellGroup.getChildByName(CUSTOM_CONTAINER_NAME) || cellGroup.getChildByName(CUSTOM_MERGE_CONTAINER_NAME);

  if (customContainer) {
    table.reactCustomLayout?.removeCustomCell(range.start.col, range.start.row);
    customContainer.removeAllChild();
    cellGroup.removeChild(customContainer);
  }

  table.scenegraph.updateCellContent(range.end.col, range.end.row);
}

function refreshCornerCustomMergeContentForResize(range: CellRange, table: BaseTableAPI): void {
  const cellGroup = table.scenegraph.getCell(range.end.col, range.end.row);
  const customContainer =
    cellGroup.getChildByName(CUSTOM_CONTAINER_NAME) || cellGroup.getChildByName(CUSTOM_MERGE_CONTAINER_NAME);

  if (customContainer) {
    cellGroup.removeChild(customContainer);
  }

  table.scenegraph.updateCellContent(range.end.col, range.end.row);
}
