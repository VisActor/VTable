import type { Group as VGroup } from '@src/vrender';
import type { CellRange } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import { CUSTOM_CONTAINER_NAME, CUSTOM_MERGE_CONTAINER_NAME } from '../component/custom';
import { Group } from '../graphic/group';

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
  updateCornerCustomMergeContentOnce(range, table);
}

export function updateCornerCustomMergeContentOnce(
  range: CellRange,
  table: BaseTableAPI,
  refreshedRanges?: Set<string>
): void {
  if (refreshedRanges) {
    const rangeKey = `${range.start.col}-${range.start.row}-${range.end.col}-${range.end.row}`;
    if (refreshedRanges.has(rangeKey)) {
      return;
    }
    refreshedRanges.add(rangeKey);
  }

  refreshCornerCustomMergeContent(range, table);
}

function refreshCornerCustomMergeContent(range: CellRange, table: BaseTableAPI): void {
  const cellGroup = table.scenegraph.getCell(range.end.col, range.end.row);
  const customContainer =
    cellGroup.getChildByName(CUSTOM_CONTAINER_NAME) || cellGroup.getChildByName(CUSTOM_MERGE_CONTAINER_NAME);

  if (customContainer) {
    const removed = table.reactCustomLayout?.removeCustomCell(range.start.col, range.start.row, () => {
      removeCornerCustomContainerAndUpdate(range, table);
    });
    if (removed === false) {
      return;
    }
    removeCornerCustomContainerAndUpdate(range, table);
    return;
  }

  table.scenegraph.updateCellContent(range.end.col, range.end.row);
}

function removeCornerCustomContainerAndUpdate(range: CellRange, table: BaseTableAPI): void {
  const cellGroup = table.scenegraph.getCell(range.end.col, range.end.row);
  const customContainer =
    cellGroup.getChildByName(CUSTOM_CONTAINER_NAME) || cellGroup.getChildByName(CUSTOM_MERGE_CONTAINER_NAME);

  if (customContainer) {
    customContainer.removeAllChild();
    cellGroup.removeChild(customContainer);
  }

  table.scenegraph.updateCellContent(range.end.col, range.end.row);
}
