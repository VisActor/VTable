import { isValid, merge } from '@visactor/vutils';
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

  constructor(
    table: BaseTableAPI,
    customCellStyle: CustomCellStyle[],
    customCellStyleArrangement: CustomCellStyleArrangement[]
  ) {
    this.table = table;
    this.customCellStyle = customCellStyle;
    this.customCellStyleArrangement = customCellStyleArrangement;
  }

  getCustomCellStyle(col: number, row: number) {
    const customStyleIds = this.getCustomCellStyleIds(col, row);
    if (customStyleIds.length) {
      const styles: ColumnStyleOption[] = [];

      customStyleIds.forEach(customStyleId => {
        const styleOption = this.getCustomCellStyleOption(customStyleId);
        if (styleOption?.style) {
          styles.push(styleOption.style);
        }
      });

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
        // eslint-disable-next-line no-loop-func
        this.customCellStyleArrangement.forEach(style => {
          if (style.cellPosition.range) {
            if (
              style.cellPosition.range.start.col <= c &&
              style.cellPosition.range.end.col >= c &&
              style.cellPosition.range.start.row <= r &&
              style.cellPosition.range.end.row >= r
            ) {
              // customStyleId = style.customStyleId;
              customStyleIds.push(style.customStyleId);
            }
          } else if (style.cellPosition.col === c && style.cellPosition.row === r) {
            // customStyleId = style.customStyleId;
            customStyleIds.push(style.customStyleId);
          }
        });
      }
    }

    return customStyleIds;
  }

  getCustomCellStyleOption(customStyleId: string) {
    return this.customCellStyle.find(style => style.id === customStyleId);
  }

  registerCustomCellStyle(customStyleId: string, customStyle: ColumnStyleOption | undefined | null) {
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
    const index = this.customCellStyleArrangement.findIndex(style => {
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
    } else if (this.customCellStyleArrangement[index].customStyleId === customStyleId) {
      // same style
      return;
    } else if (customStyleId) {
      // update style
      this.customCellStyleArrangement[index].customStyleId = customStyleId;
    } else {
      // delete useless style
      this.customCellStyleArrangement.splice(index, 1);
    }

    const style = this.getCustomCellStyleOption(customStyleId)?.style;
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
