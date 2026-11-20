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

type CustomCellStyleOverlay = {
  positions: Map<string, string[]>;
  cells: Map<string, Map<string, string>>;
};

export class CustomCellStylePlugin {
  table: BaseTableAPI;
  customCellStyle: CustomCellStyle[];
  customCellStyleArrangement: CustomCellStyleArrangement[];
  private _customCellStyleArrangementIndex: Map<string, number>;
  private _customCellStyleArrangementTombstoneCount: number;
  private _customCellStyleOverlays: Map<string, CustomCellStyleOverlay>;
  private _customCellStyleIdsCache?: Map<string, string[]>;

  constructor(
    table: BaseTableAPI,
    customCellStyle: CustomCellStyle[],
    customCellStyleArrangement: CustomCellStyleArrangement[]
  ) {
    this.table = table;
    this.customCellStyle = customCellStyle;
    this.customCellStyleArrangement = customCellStyleArrangement;
    this._customCellStyleArrangementIndex = new Map();
    this._customCellStyleArrangementTombstoneCount = 0;
    this._customCellStyleOverlays = new Map();
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
    this.customCellStyleArrangement.push({
      cellPosition,
      customStyleId
    });
  }

  setCustomCellStyleOverlay(
    sourceId: string,
    cellPosition: { col?: number; row?: number; range?: CellRange },
    customStyleId: string | undefined | null
  ) {
    const positionKey = this._getCustomCellStyleArrangementKey(cellPosition);
    if (!positionKey) {
      return;
    }
    let overlay = this._customCellStyleOverlays.get(sourceId);
    if (!overlay) {
      overlay = {
        positions: new Map(),
        cells: new Map()
      };
      this._customCellStyleOverlays.set(sourceId, overlay);
    }
    const previousCellKeys = overlay.positions.get(positionKey) ?? [];
    if (!customStyleId) {
      previousCellKeys.forEach(cellKey => {
        const cellStyles = overlay?.cells.get(cellKey);
        cellStyles?.delete(positionKey);
        if (cellStyles?.size === 0) {
          overlay?.cells.delete(cellKey);
        }
      });
      overlay.positions.delete(positionKey);
      if (overlay.positions.size === 0) {
        this._customCellStyleOverlays.delete(sourceId);
      }
      return;
    }

    const range = cellPosition.range ?? {
      start: { col: cellPosition.col as number, row: cellPosition.row as number },
      end: { col: cellPosition.col as number, row: cellPosition.row as number }
    };
    const cellKeys: string[] = [];
    for (let col = range.start.col; col <= range.end.col; col++) {
      for (let row = range.start.row; row <= range.end.row; row++) {
        const cellKey = `${col}:${row}`;
        cellKeys.push(cellKey);
        let cellStyles = overlay.cells.get(cellKey);
        if (!cellStyles) {
          cellStyles = new Map();
          overlay.cells.set(cellKey, cellStyles);
        }
        cellStyles.set(positionKey, customStyleId);
      }
    }
    overlay.positions.set(positionKey, cellKeys);
  }

  clearCustomCellStyleOverlay(sourceId: string) {
    this._customCellStyleOverlays.delete(sourceId);
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
    const range = this.table.getCellRange(col, row);
    const rangeKey = `${range.start.col}:${range.start.row}:${range.end.col}:${range.end.row}`;
    const cachedStyleIds = this._customCellStyleIdsCache?.get(rangeKey);
    if (cachedStyleIds) {
      return cachedStyleIds;
    }

    const customStyleIds = this._collectCustomCellStyleIds(range);
    this._customCellStyleIdsCache?.set(rangeKey, customStyleIds);
    return customStyleIds;
  }

  private _collectCustomCellStyleIds(range: CellRange) {
    const customStyleIds: string[] = [];
    const seenArrangements = new Set<number>();
    const seenOverlayPositions = new Set<string>();

    for (let c = range.start.col; c <= range.end.col; c++) {
      for (let r = range.start.row; r <= range.end.row; r++) {
        // eslint-disable-next-line no-loop-func
        this.customCellStyleArrangement.forEach((style, index) => {
          if (seenArrangements.has(index) || !isValid(style.customStyleId)) {
            return;
          }
          if (style.cellPosition.range) {
            if (
              style.cellPosition.range.start.col <= c &&
              style.cellPosition.range.end.col >= c &&
              style.cellPosition.range.start.row <= r &&
              style.cellPosition.range.end.row >= r
            ) {
              seenArrangements.add(index);
              customStyleIds.push(style.customStyleId as string);
            }
          } else if (style.cellPosition.col === c && style.cellPosition.row === r) {
            seenArrangements.add(index);
            customStyleIds.push(style.customStyleId as string);
          }
        });
        for (const [sourceId, overlay] of this._customCellStyleOverlays) {
          const overlayStyles = overlay.cells.get(`${c}:${r}`);
          if (overlayStyles) {
            for (const [positionKey, customStyleId] of overlayStyles) {
              const overlayPositionKey = `${sourceId}:${positionKey}`;
              if (!seenOverlayPositions.has(overlayPositionKey)) {
                seenOverlayPositions.add(overlayPositionKey);
                customStyleIds.push(customStyleId);
              }
            }
          }
        }
      }
    }

    return customStyleIds;
  }

  refreshCustomCellStyleRange(
    cellPosition: { col?: number; row?: number; range?: CellRange },
    forceFastUpdate: boolean = false
  ) {
    const range = cellPosition.range ?? {
      start: { col: cellPosition.col as number, row: cellPosition.row as number },
      end: { col: cellPosition.col as number, row: cellPosition.row as number }
    };
    const previousCache = this._customCellStyleIdsCache;
    this._customCellStyleIdsCache = new Map();
    try {
      for (let col = Math.max(0, range.start.col); col <= Math.min(this.table.colCount - 1, range.end.col); col++) {
        for (let row = Math.max(0, range.start.row); row <= Math.min(this.table.rowCount - 1, range.end.row); row++) {
          this.table.scenegraph.updateCellContent(col, row, forceFastUpdate);
        }
      }
    } finally {
      this._customCellStyleIdsCache = previousCache;
    }
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
    this._rebuildCustomCellStyleArrangementIndex();
    const index = inputKey ? this._customCellStyleArrangementIndex.get(inputKey) ?? -1 : -1;

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
      }
    } else if (this.customCellStyleArrangement[index].customStyleId === customStyleId) {
      // same style
      return;
    } else if (customStyleId) {
      // update style
      this.customCellStyleArrangement[index].customStyleId = customStyleId;
    } else {
      // delete useless style
      (this.customCellStyleArrangement[index] as any).customStyleId = null;
      this._rebuildCustomCellStyleArrangementIndex();
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
    const positionsToRefresh = new Map<string, CustomCellStyleArrangement['cellPosition']>();
    this.customCellStyleArrangement.forEach(arrangement => {
      const key = this._getCustomCellStyleArrangementKey(arrangement.cellPosition);
      if (key) {
        positionsToRefresh.set(key, arrangement.cellPosition);
      }
    });

    this.customCellStyle.length = 0;
    const styleIndexes = new Map<string, number>();
    customCellStyle.forEach(cellStyle => {
      const index = styleIndexes.get(cellStyle.id);
      const nextCellStyle = {
        id: cellStyle.id,
        style: cellStyle.style
      };
      if (index === undefined) {
        styleIndexes.set(cellStyle.id, this.customCellStyle.length);
        this.customCellStyle.push(nextCellStyle);
      } else {
        this.customCellStyle[index] = nextCellStyle;
      }
    });

    this.customCellStyleArrangement.length = 0;
    const arrangementIndexes = new Map<string, number>();
    customCellStyleArrangement.forEach(arrangement => {
      const nextArrangement = {
        cellPosition: {
          col: arrangement.cellPosition.col,
          row: arrangement.cellPosition.row,
          range: arrangement.cellPosition.range
        },
        customStyleId: arrangement.customStyleId
      };
      const key = this._getCustomCellStyleArrangementKey(arrangement.cellPosition);
      if (key) {
        const index = arrangementIndexes.get(key);
        if (index === undefined) {
          arrangementIndexes.set(key, this.customCellStyleArrangement.length);
          this.customCellStyleArrangement.push(nextArrangement);
        } else {
          this.customCellStyleArrangement[index] = nextArrangement;
        }
        positionsToRefresh.set(key, arrangement.cellPosition);
      } else {
        this.customCellStyleArrangement.push(nextArrangement);
      }
    });
    this._rebuildCustomCellStyleArrangementIndex();

    positionsToRefresh.forEach(position => this.refreshCustomCellStyleRange(position));
    this.table.scenegraph.updateNextFrame();
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
