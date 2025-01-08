import { isArray, isValid } from '@visactor/vutils';
import type { ListTable } from '../ListTable';
import { Group } from '../scenegraph/graphic/group';
import { updateCell } from '../scenegraph/group-creater/cell-helper';
import type { Graphic } from '@src/vrender';
import { createRect } from '@src/vrender';
import { Factory } from '../core/factory';
import { getTargetCell } from '../event/util';

export interface IListTreeStickCellPlugin {
  new (table: ListTable): ListTreeStickCellPlugin;
}

export class ListTreeStickCellPlugin {
  table: ListTable;
  titleRows: number[] = [];
  showedTitleRows: number[] = [];
  rowNow: number = -1;
  skipStartRow: number = -1;
  skipEndRow: number = -1;

  constructor(table: ListTable) {
    this.table = table;

    this.table.on('scroll', e => {
      if (e.scrollDirection !== 'vertical') {
        return;
      }
      this.updateGroupTitle();
    });

    this.table.on('tree_hierarchy_state_change', e => {
      this.updateGroupTitle();
    });

    this.table.on('resize_column', e => {
      this.updateGroupTitle();
    });
  }

  updateGroupTitle() {
    // this.updateGroupTitleInfo();
    if (this.table.scrollTop === 0) {
      // do nothing
      this.titleRows = [];
      this.showedTitleRows = [];
    } else if (
      this.skipStartRow !== -1 &&
      this.skipEndRow !== -1 &&
      this.skipStartRow !== this.table.scenegraph.proxy.bodyTopRow - 1
    ) {
      if (
        this.table.scenegraph.proxy.screenTopRow <= this.skipStartRow ||
        this.table.scenegraph.proxy.screenTopRow >= this.skipEndRow
      ) {
        this.skipStartRow = -1;
        this.skipEndRow = -1;
        this.updateGroupTitleInfo();
      } else {
        // const row = this.table.scenegraph.proxy.screenTopRow + titleRows.length;
        // nowRow = row;
        // renderLast = true;
        // do nothing
      }
    } else {
      this.skipStartRow = -1;
      this.skipEndRow = -1;
      this.updateGroupTitleInfo();
    }

    this.updateScenegraph();
  }

  updateGroupTitleInfo() {
    this.rowNow = this.table.scenegraph.proxy.screenTopRow + this.titleRows.length;
    const recordIndex = this.table.getRecordIndexByCell(0, this.rowNow); // [0, 0, 6]/0
    const nextRecordIndex = this.table.getRecordIndexByCell(0, this.rowNow + 1);
    this.getTitleRowsByRecordIndex(recordIndex, nextRecordIndex);
  }

  getTitleRowsByRecordIndex(recordIndex: number | number[], nextRecordIndex: number | number[]) {
    const titleRecords = [];
    if (!isArray(recordIndex)) {
      recordIndex = [recordIndex];
    }
    if (!isArray(nextRecordIndex)) {
      nextRecordIndex = [nextRecordIndex];
    }

    for (let i = 0; i < recordIndex.length; i++) {
      const index = recordIndex.slice(0, i + 1);
      const record = this.table.dataSource.getRaw(index as unknown as number);
      titleRecords.push(record);
    }

    const titleRows = [];
    // const isTitle = !(recordIndex.length === (this.table.options.groupBy as any).length + 1);
    const isTitle = nextRecordIndex.length === recordIndex.length + 1;
    let titleIndex = recordIndex.slice(0, !isTitle ? recordIndex.length - 1 : recordIndex.length);
    const currentIndexedData = this.table.dataSource.currentIndexedData;
    const startIndex = this.rowNow - this.table.columnHeaderLevelCount;

    for (let i = startIndex; i >= 0; i--) {
      const currentIndex = currentIndexedData[i];
      if (isArray(currentIndex) && titleIndex.length === currentIndex.length) {
        let isMatch = true;
        for (let j = 0; j < currentIndex.length; j++) {
          if (currentIndex[j] !== titleIndex[j]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          titleRows.push(i + this.table.columnHeaderLevelCount);
          titleIndex = titleIndex.slice(0, titleIndex.length - 1);
        }
      } else if (currentIndex === recordIndex[0]) {
        titleRows.push(i + this.table.columnHeaderLevelCount);
        break;
      }
    }

    this.titleRows = titleRows.reverse();
  }

  updateScenegraph() {
    const { table } = this;
    const { shadowGroup, shadowGroupFrozen } = prepareShadowRoot(table);

    this.showedTitleRows.length = 0;
    let skip = 0;
    for (let col = 0; col < table.colCount; col++) {
      let colGroup;
      if (col < table.frozenColCount) {
        colGroup = new Group({
          x: table.getColsWidth(0, col - 1),
          y: table.getFrozenRowsHeight()
        });
        shadowGroupFrozen.add(colGroup);
      } else {
        colGroup = new Group({
          x: table.getColsWidth(table.frozenColCount, col - 1),
          y: table.getFrozenRowsHeight()
        });
        shadowGroup.add(colGroup);
      }
      colGroup.col = col;
      for (let i = 0; i < this.titleRows.length; i++) {
        const row = this.titleRows[i];
        if (isSkipRow(row, this.rowNow, table.scenegraph.proxy.screenTopRow, this.titleRows)) {
          // skipOne = true;
          col === 0 && skip++;
          continue;
        }
        if (col === 0) {
          this.showedTitleRows.push(row);
        }
        const cell = table.scenegraph.getCell(col, row);
        if (cell.role === 'cell') {
          const newCell = cloneGraphic(cell);
          newCell.setAttributes({
            y: i * 40
          });
          colGroup.add(newCell);
        } else {
          // create a fake cellGroup for title
          const newCell = updateCell(col, row, table, true, true);
          newCell.setAttributes({
            y: i * 40
          });
          colGroup.add(newCell);
        }
      }
    }

    if (skip > 0 && this.skipStartRow === -1 && this.skipEndRow === -1) {
      this.skipStartRow = table.scenegraph.proxy.screenTopRow - 1;
      this.skipEndRow = table.scenegraph.proxy.screenTopRow + 1;
    }
  }
}

function isSkipRow(row: number, topRow: number, screenTopRow: number, titleRows: number[]) {
  if (row === topRow && row !== screenTopRow + titleRows.length - 1) {
    return true;
  }

  const rowIndex = titleRows.indexOf(row);
  const rowLimit = screenTopRow + rowIndex + 1;
  if (row === rowLimit && row < topRow) {
    return true;
  }

  return false;
}

function cloneGraphic(graphic: Graphic) {
  const newGraphic = graphic.clone();
  (newGraphic as any).role = (graphic as any).role;
  (newGraphic as any).col = (graphic as any).col;
  (newGraphic as any).row = (graphic as any).row;
  (newGraphic as any).mergeStartCol = (graphic as any).mergeStartCol;
  (newGraphic as any).mergeStartRow = (graphic as any).mergeStartRow;
  (newGraphic as any).mergeEndCol = (graphic as any).mergeEndCol;
  (newGraphic as any).mergeEndRow = (graphic as any).mergeEndRow;
  (newGraphic as any).contentWidth = (graphic as any).contentWidth;
  (newGraphic as any).contentHeight = (graphic as any).contentHeight;

  if ((newGraphic as any).role === 'cell') {
    // hack for vrender not support shadow group pick
    const hackRect = createRect({
      x: 0,
      y: 0,
      width: newGraphic.attribute.width,
      height: newGraphic.attribute.height
    });
    newGraphic.add(hackRect);
  }

  if (graphic.type === 'group') {
    const newGroup = newGraphic as Group;
    graphic.forEachChildren(child => {
      const newChild = cloneGraphic(child as any);
      newGroup.add(newChild);
    });
  }
  return newGraphic;
}

function prepareShadowRoot(table: ListTable) {
  const colHeaderGroup = table.scenegraph.colHeaderGroup;
  const cornerHeaderGroup = table.scenegraph.cornerHeaderGroup;
  if (!colHeaderGroup.border) {
    const hackBorder = createRect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      cursor: 'pointer'
    });
    colHeaderGroup.add(hackBorder);
    colHeaderGroup.border = hackBorder;
    (hackBorder as any).attachShadow(hackBorder.shadowRoot);
    hackBorder.name = 'border-rect';

    hackBorder.addEventListener('click', (e: any) => {
      const titleRows = table.listTreeStickCellPlugin.titleRows;
      const { shadowTarget } = e.pickParams;
      const cellGroup = getTargetCell(shadowTarget);
      const { col, row } = cellGroup;
      const rowIndex = titleRows.indexOf(row);
      // table.scrollToCell({ col, row: row - rowIndex });
      scrollToRow(row - rowIndex, table);
    });
  }

  if (!cornerHeaderGroup.border) {
    const hackBorder = createRect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      cursor: 'pointer'
    });
    cornerHeaderGroup.add(hackBorder);
    cornerHeaderGroup.border = hackBorder;
    (hackBorder as any).attachShadow(hackBorder.shadowRoot);
    hackBorder.name = 'border-rect';

    hackBorder.addEventListener('click', (e: any) => {
      const titleRows = table.listTreeStickCellPlugin.titleRows;
      const { shadowTarget } = e.pickParams;
      const cellGroup = getTargetCell(shadowTarget);
      const { col, row } = cellGroup;
      const rowIndex = titleRows.indexOf(row);
      // table.scrollToCell({ col, row: row - rowIndex });
      scrollToRow(row - rowIndex, table);
    });
  }

  const shadowGroup = colHeaderGroup.border.shadowRoot;
  const shadowGroupFrozen = cornerHeaderGroup.border.shadowRoot;
  shadowGroup.removeAllChild();
  shadowGroupFrozen.removeAllChild();

  return { shadowGroup, shadowGroupFrozen };
}

function scrollToRow(row: number, table: ListTable) {
  const drawRange = table.getDrawRange();

  if (isValid(row) && row >= table.frozenRowCount) {
    const frozenHeight = table.getFrozenRowsHeight();
    const top = table.getRowsHeight(0, row - 1);
    table.scrollTop = Math.min(top - frozenHeight, table.getAllRowsHeight() - drawRange.height) - 1;
  }
  table.scenegraph.updateNextFrame();
}

export const registerListTreeStickCellPlugin = () => {
  Factory.registerComponent('listTreeStickCellPlugin', ListTreeStickCellPlugin);
};

// export type IListTreeStickCellPlugin = typeof ListTreeStickCellPlugin;
