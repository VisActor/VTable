import { isFunction, isValid, merge } from '@visactor/vutils';
import type { BaseTableAPI } from '../ts-types/base-table';
import {
  cellStyleKeys,
  type CellRange,
  type ColumnStyleOption,
  type CustomCellStyle,
  type CustomCellStyleArrangement
} from '../ts-types';
import type { Style } from '../body-helper/style';
import { Factory } from '../core/factory';
import type { StylePropertyFunctionArg } from '../ts-types/style-define';
export interface ICustomCellStylePlugin {
  new (
    table: BaseTableAPI,
    customCellStyle: CustomCellStyle[],
    customCellStyleArrangement: CustomCellStyleArrangement[]
  ): CustomCellStylePlugin;
}

export class CustomCellStylePlugin {
  table: BaseTableAPI;
  customCellStyle: CustomCellStyle[];
  customCellStyleArrangement: CustomCellStyleArrangement[];
  private _customCellStyleArrangementIndex: Map<string, number>;
  private _customCellStyleArrangementIndexes: Map<string, number[]>;
  private _customCellStyleRangeArrangementIndexes: number[];
  private _customCellStyleArrangementTombstoneCount: number;

  constructor(
    table: BaseTableAPI,
    customCellStyle: CustomCellStyle[],
    customCellStyleArrangement: CustomCellStyleArrangement[]
  ) {
    this.table = table;
    this.customCellStyle = customCellStyle;
    this.customCellStyleArrangement = customCellStyleArrangement;
    this._customCellStyleArrangementIndex = new Map();
    this._customCellStyleArrangementIndexes = new Map();
    this._customCellStyleRangeArrangementIndexes = [];
    this._customCellStyleArrangementTombstoneCount = 0;
    this._rebuildCustomCellStyleArrangementIndex();
  }

  private _getCustomCellStyleArrangementKey(cellPos: { col?: number; row?: number; range?: CellRange }) {
    if (cellPos.range) {
      const { start, end } = cellPos.range;
      return `range:${start.col},${start.row},${end.col},${end.row}`;
    }
    if (cellPos.col === undefined || cellPos.row === undefined) {
      return undefined;
    }
    return `cell:${cellPos.col},${cellPos.row}`;
  }

  private _rebuildCustomCellStyleArrangementIndex() {
    this._customCellStyleArrangementIndex.clear();
    this._customCellStyleArrangementIndexes.clear();
    this._customCellStyleRangeArrangementIndexes.length = 0;
    this._customCellStyleArrangementTombstoneCount = 0;
    for (let i = 0; i < this.customCellStyleArrangement.length; i++) {
      const arrangement = this.customCellStyleArrangement[i];
      if (!isValid((arrangement as any).customStyleId)) {
        this._customCellStyleArrangementTombstoneCount++;
        continue;
      }
      const key = this._getCustomCellStyleArrangementKey(arrangement.cellPosition);
      if (key) {
        this._customCellStyleArrangementIndex.set(key, i);
        const indexes = this._customCellStyleArrangementIndexes.get(key);
        if (indexes) {
          indexes.push(i);
        } else {
          this._customCellStyleArrangementIndexes.set(key, [i]);
        }
      }
      if (arrangement.cellPosition.range) {
        this._customCellStyleRangeArrangementIndexes.push(i);
      }
    }
  }

  private _compactCustomCellStyleArrangementIfNeeded() {
    const length = this.customCellStyleArrangement.length;
    if (this._customCellStyleArrangementTombstoneCount < 2048) {
      return;
    }
    if (this._customCellStyleArrangementTombstoneCount * 4 < length) {
      return;
    }
    const compacted = this.customCellStyleArrangement.filter(style => isValid((style as any).customStyleId));
    if (compacted.length === this.customCellStyleArrangement.length) {
      this._customCellStyleArrangementTombstoneCount = 0;
      return;
    }
    this.customCellStyleArrangement.length = 0;
    this.customCellStyleArrangement.push(...compacted);
    this._rebuildCustomCellStyleArrangementIndex();
  }

  clearCustomCellStyleArrangement() {
    this.customCellStyleArrangement = [];
    this._rebuildCustomCellStyleArrangementIndex();
  }

  addCustomCellStyleArrangement(
    cellPosition: {
      col?: number;
      row?: number;
      range?: CellRange;
    },
    customStyleId: string | undefined | null
  ) {
    const arrangement = {
      cellPosition,
      customStyleId
    };
    this.customCellStyleArrangement.push(arrangement);
    const index = this.customCellStyleArrangement.length - 1;
    const key = this._getCustomCellStyleArrangementKey(cellPosition);
    if (key) {
      this._customCellStyleArrangementIndex.set(key, index);
      const indexes = this._customCellStyleArrangementIndexes.get(key);
      if (indexes) {
        indexes.push(index);
      } else {
        this._customCellStyleArrangementIndexes.set(key, [index]);
      }
    }
    if (cellPosition.range) {
      this._customCellStyleRangeArrangementIndexes.push(index);
    }
  }

  getCustomCellStyle(col: number, row: number) {
    const customStyleIds = this.getCustomCellStyleIds(col, row);
    if (customStyleIds.length) {
      const styles: ColumnStyleOption[] = [];

      customStyleIds.forEach(customStyleId => {
        const styleOption = this.getCustomCellStyleOption(customStyleId);
        if (isFunction(styleOption?.style)) {
          const style = styleOption.style({
            col,
            row,
            table: this.table,
            value: this.table.getCellValue(col, row),
            dataValue: this.table.getCellOriginValue(col, row),
            cellHeaderPaths: this.table.getCellHeaderPaths(col, row)
          });
          styles.push(style);
        } else if (styleOption?.style) {
          styles.push(styleOption.style);
        }
      });

      if (!styles.length) {
        return undefined;
      }
      return merge({}, ...styles);
      // const styleOption = this.getCustomCellStyleOption(customStyleId);
      // return styleOption?.style;
    }
    return undefined;
  }

  getCustomCellStyleIds(col: number, row: number) {
    // let customStyleId;
    const customStyleIds: string[] = [];

    const range = this.table.getCellRange(col, row);
    for (let c = range.start.col; c <= range.end.col; c++) {
      for (let r = range.start.row; r <= range.end.row; r++) {
        const exactIndexes = this._customCellStyleArrangementIndexes.get(`cell:${c},${r}`) ?? [];
        let exactIndex = 0;
        let rangeIndex = 0;
        while (exactIndex < exactIndexes.length || rangeIndex < this._customCellStyleRangeArrangementIndexes.length) {
          const nextExactIndex = exactIndexes[exactIndex] ?? Number.POSITIVE_INFINITY;
          const nextRangeIndex = this._customCellStyleRangeArrangementIndexes[rangeIndex] ?? Number.POSITIVE_INFINITY;
          const arrangementIndex = Math.min(nextExactIndex, nextRangeIndex);
          const isRangeArrangement = nextRangeIndex <= nextExactIndex;
          if (isRangeArrangement) {
            rangeIndex++;
          } else {
            exactIndex++;
          }
          const style = this.customCellStyleArrangement[arrangementIndex];
          if (!style || !isValid(style.customStyleId)) {
            continue;
          }
          if (isRangeArrangement && style.cellPosition.range) {
            if (
              style.cellPosition.range.start.col <= c &&
              style.cellPosition.range.end.col >= c &&
              style.cellPosition.range.start.row <= r &&
              style.cellPosition.range.end.row >= r
            ) {
              // customStyleId = style.customStyleId;
              customStyleIds.push(style.customStyleId as string);
            }
          } else if (!isRangeArrangement && style.cellPosition.col === c && style.cellPosition.row === r) {
            // customStyleId = style.customStyleId;
            customStyleIds.push(style.customStyleId as string);
          }
        }
      }
    }

    return customStyleIds;
  }

  getCustomCellStyleOption(customStyleId: string) {
    return this.customCellStyle.find(style => style.id === customStyleId);
  }

  registerCustomCellStyle(
    customStyleId: string,
    customStyle: ColumnStyleOption | ((styleArg: StylePropertyFunctionArg) => ColumnStyleOption) | undefined | null
  ) {
    const index = this.customCellStyle.findIndex(style => style.id === customStyleId);
    if (index === -1) {
      this.customCellStyle.push({
        id: customStyleId,
        style: customStyle
      });
    } else {
      this.customCellStyle[index] = {
        id: customStyleId,
        style: customStyle
      };
    }

    this.customCellStyleArrangement.forEach(cellStyle => {
      const cellPos = cellStyle.cellPosition;
      if (cellStyle.customStyleId === customStyleId) {
        if (cellPos.range) {
          for (
            let col = Math.max(0, cellPos.range.start.col);
            col <= Math.min(this.table.colCount - 1, cellPos.range.end.col);
            col++
          ) {
            for (
              let row = Math.max(0, cellPos.range.start.row);
              row <= Math.min(this.table.rowCount - 1, cellPos.range.end.row);
              row++
            ) {
              this.table.scenegraph.updateCellContent(col, row);
            }
          }
        } else {
          this.table.scenegraph.updateCellContent(cellPos.col, cellPos.row);
        }
      }
    });
    this.table.scenegraph.updateNextFrame();
  }

  arrangeCustomCellStyle(
    cellPos: {
      col?: number;
      row?: number;
      range?: CellRange;
    },
    customStyleId: string | undefined | null,
    forceFastUpdate?: boolean
  ) {
    const inputKey = this._getCustomCellStyleArrangementKey(cellPos);
    let index = inputKey ? this._customCellStyleArrangementIndex.get(inputKey) ?? -1 : -1;
    if (inputKey && index !== -1) {
      const item = this.customCellStyleArrangement[index];
      const itemKey = item ? this._getCustomCellStyleArrangementKey(item.cellPosition) : undefined;
      if (!item || !isValid((item as any).customStyleId) || itemKey !== inputKey) {
        this._rebuildCustomCellStyleArrangementIndex();
        index = this._customCellStyleArrangementIndex.get(inputKey) ?? -1;
      }
    }
    if (index === -1 && !inputKey) {
      index = this.customCellStyleArrangement.findIndex(style => {
        if (!isValid((style as any).customStyleId)) {
          return false;
        }
        if (style.cellPosition.range && cellPos.range) {
          return (
            style.cellPosition.range.start.col === cellPos.range.start.col &&
            style.cellPosition.range.start.row === cellPos.range.start.row &&
            style.cellPosition.range.end.col === cellPos.range.end.col &&
            style.cellPosition.range.end.row === cellPos.range.end.row
          );
        }
        return style.cellPosition.col === cellPos.col && style.cellPosition.row === cellPos.row;
      });
    }

    if (index === -1 && !customStyleId) {
      // do nothing
      return;
    } else if (index === -1 && customStyleId) {
      // add new style
      this.customCellStyleArrangement.push({
        cellPosition: {
          col: cellPos.col,
          row: cellPos.row,
          range: cellPos.range
        },
        customStyleId: customStyleId
      });
      const pushedIndex = this.customCellStyleArrangement.length - 1;
      const pushedKey = this._getCustomCellStyleArrangementKey(
        this.customCellStyleArrangement[pushedIndex].cellPosition
      );
      if (pushedKey) {
        this._customCellStyleArrangementIndex.set(pushedKey, pushedIndex);
        const indexes = this._customCellStyleArrangementIndexes.get(pushedKey);
        if (indexes) {
          indexes.push(pushedIndex);
        } else {
          this._customCellStyleArrangementIndexes.set(pushedKey, [pushedIndex]);
        }
      }
      if (this.customCellStyleArrangement[pushedIndex].cellPosition.range) {
        this._customCellStyleRangeArrangementIndexes.push(pushedIndex);
      }
    } else if (this.customCellStyleArrangement[index].customStyleId === customStyleId) {
      // same style
      return;
    } else if (customStyleId) {
      // update style
      this.customCellStyleArrangement[index].customStyleId = customStyleId;
    } else {
      // delete useless style
      const existedKey = this._getCustomCellStyleArrangementKey(this.customCellStyleArrangement[index].cellPosition);
      if (isValid((this.customCellStyleArrangement[index] as any).customStyleId)) {
        this._customCellStyleArrangementTombstoneCount++;
      }
      (this.customCellStyleArrangement[index] as any).customStyleId = null;
      if (existedKey) {
        this._customCellStyleArrangementIndex.delete(existedKey);
      }
      this._compactCustomCellStyleArrangementIfNeeded();
    }

    const style = customStyleId ? this.getCustomCellStyleOption(customStyleId)?.style : undefined;
    // let forceFastUpdate;
    if (style) {
      forceFastUpdate = true;
      for (const key in style) {
        if (cellStyleKeys.indexOf(key) === -1) {
          forceFastUpdate = false;
          break;
        }
      }
    }

    // update cell group
    if (cellPos.range) {
      for (
        let col = Math.max(0, cellPos.range.start.col);
        col <= Math.min(this.table.colCount - 1, cellPos.range.end.col);
        col++
      ) {
        for (
          let row = Math.max(0, cellPos.range.start.row);
          row <= Math.min(this.table.rowCount - 1, cellPos.range.end.row);
          row++
        ) {
          const range = this.table.getCellRange(col, row);
          for (let c = range.start.col; c <= range.end.col; c++) {
            for (let r = range.start.row; r <= range.end.row; r++) {
              this.table.scenegraph.updateCellContent(c, r, forceFastUpdate);
            }
          }
          // this.table.scenegraph.updateCellContent(col, row);
        }
      }
    } else {
      this.table.scenegraph.updateCellContent(cellPos.col, cellPos.row, forceFastUpdate);
    }

    this.table.scenegraph.updateNextFrame();
  }

  updateCustomCell(customCellStyle: CustomCellStyle[], customCellStyleArrangement: CustomCellStyleArrangement[]) {
    this.customCellStyle.length = 0;
    this.customCellStyleArrangement.length = 0;
    this._customCellStyleArrangementIndex.clear();
    this._customCellStyleArrangementIndexes.clear();
    this._customCellStyleRangeArrangementIndexes.length = 0;
    this._customCellStyleArrangementTombstoneCount = 0;
    customCellStyle.forEach((cellStyle: CustomCellStyle) => {
      this.registerCustomCellStyle(cellStyle.id, cellStyle.style);
    });
    customCellStyleArrangement.forEach((cellStyle: CustomCellStyleArrangement) => {
      this.arrangeCustomCellStyle(cellStyle.cellPosition, cellStyle.customStyleId);
    });
  }

  hasCustomCellStyle(customStyleId: string) {
    return this.customCellStyle.some(style => style.id === customStyleId);
  }
}

export function mergeStyle(cacheStyle: Style, customCellStyle: ColumnStyleOption): Style {
  cacheStyle = cacheStyle.clone();

  for (const key in customCellStyle) {
    const value = (customCellStyle as any)[key];
    if (isValid(value)) {
      (cacheStyle as any)[`_${key}`] = value;
    }
  }

  return cacheStyle;
}

export const registerCustomCellStylePlugin = () => {
  Factory.registerComponent('customCellStylePlugin', CustomCellStylePlugin);
};

// export type ICustomCellStylePlugin = typeof CustomCellStylePlugin;
