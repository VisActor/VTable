import type { ListTable } from '../ListTable';
import { Factory } from '../core/factory';
import { Group } from '../scenegraph/graphic/group';
import type { Graphic } from '../vrender';

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
  }

  updateGroupTitle() {
    // this.updateGroupTitleInfo();
    if (
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
    this.getTitleRowsByRecordIndex(recordIndex);
  }

  getTitleRowsByRecordIndex(recordIndex: number | number[]) {
    const titleRecords = [];
    if (!Array.isArray(recordIndex)) {
      recordIndex = [recordIndex];
    }

    for (let i = 0; i < recordIndex.length; i++) {
      const index = recordIndex.slice(0, i + 1);
      const record = this.table.dataSource.getRaw(index as unknown as number);
      titleRecords.push(record);
    }

    const titleRows = [];
    const isTitle = !(recordIndex.length === (this.table.options.groupBy as any).length + 1);
    let titleIndex = recordIndex.slice(0, !isTitle ? recordIndex.length - 1 : recordIndex.length);
    const currentIndexedData = this.table.dataSource.currentIndexedData;
    const startIndex = this.rowNow - this.table.columnHeaderLevelCount;

    for (let i = startIndex; i >= 0; i--) {
      const currentIndex = currentIndexedData[i];
      if (Array.isArray(currentIndex) && titleIndex.length === currentIndex.length) {
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
    const colHeaderGroup = this.table.scenegraph.colHeaderGroup;
    const shadowGroup = colHeaderGroup.shadowRoot;
    shadowGroup.setAttributes({
      // shadowRootIdx: 1,
      // width: 500,
      // height: 500,
      // fill: 'red'
    });
    shadowGroup.removeAllChild();

    this.showedTitleRows.length = 0;
    let skip = 0;
    for (let col = 0; col < this.table.colCount; col++) {
      const colGroup = new Group({
        x: this.table.getColsWidth(0, col - 1),
        y: this.table.getFrozenRowsHeight()
      });
      shadowGroup.add(colGroup);
      for (let i = 0; i < this.titleRows.length; i++) {
        const row = this.titleRows[i];
        if (isSkipRow(row, this.rowNow, this.table.scenegraph.proxy.screenTopRow, this.titleRows)) {
          // skipOne = true;
          col === 0 && skip++;
          continue;
        }
        if (col === 0) {
          this.showedTitleRows.push(row);
        }
        const cell = this.table.scenegraph.getCell(col, row);
        if (cell.role === 'cell') {
          const newCell = cloneGraphic(cell);
          newCell.setAttributes({
            y: i * 40
          });
          colGroup.add(newCell);
        }
      }
    }

    if (skip > 0 && this.skipStartRow === -1 && this.skipEndRow === -1) {
      this.skipStartRow = this.table.scenegraph.proxy.screenTopRow - 1;
      this.skipEndRow = this.table.scenegraph.proxy.screenTopRow + 1;
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
  if (graphic.type === 'group') {
    const newGroup = newGraphic as Group;
    graphic.forEachChildren(child => {
      const newChild = cloneGraphic(child as any);
      newGroup.add(newChild);
    });
  }
  return newGraphic;
}

export const registerListTreeStickCellPlugin = () => {
  Factory.registerComponent('listTreeStickCellPlugin', ListTreeStickCellPlugin);
};

export type IListTreeStickCellPlugin = typeof ListTreeStickCellPlugin;
