import type { Style } from '../body-helper/style';
import type {
  CellRange,
  ColumnStyleOption,
  CustomCellStyle,
  CustomCellStyleArrangement,
  FullExtendStyle
} from '../ts-types';
import type { BaseTableAPI } from '../ts-types/base-table';

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
    const customStyleId = this.getCustomCellStyleId(col, row);
    if (customStyleId) {
      const styleOption = this.getCustomCellStyleOption(customStyleId);
      return styleOption.style;
    }
    return undefined;
  }

  getCustomCellStyleId(col: number, row: number) {
    let customStyleId;
    this.customCellStyleArrangement.forEach(style => {
      if (style.range) {
        if (
          style.range.start.col <= col &&
          style.range.end.col >= col &&
          style.range.start.row <= row &&
          style.range.end.row >= row
        ) {
          customStyleId = style.customStyleId;
        }
      } else if (style.col === col && style.row === row) {
        customStyleId = style.customStyleId;
      }
    });
    return customStyleId;
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

    this.customCellStyleArrangement.forEach(cellPos => {
      if (cellPos.customStyleId === customStyleId) {
        if (cellPos.range) {
          for (let col = cellPos.range.start.col; col <= cellPos.range.end.col; col++) {
            for (let row = cellPos.range.start.row; row <= cellPos.range.end.row; row++) {
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
    customStyleId: string | undefined | null
  ) {
    const index = this.customCellStyleArrangement.findIndex(style => {
      if (style.range && cellPos.range) {
        return (
          style.range.start.col === cellPos.range.start.col &&
          style.range.start.row === cellPos.range.start.row &&
          style.range.end.col === cellPos.range.end.col &&
          style.range.end.row === cellPos.range.end.row
        );
      }
      return style.col === cellPos.col && style.row === cellPos.row;
    });

    if (index === -1) {
      this.customCellStyleArrangement.push({
        customStyleId: customStyleId,
        col: cellPos.col,
        row: cellPos.row,
        range: cellPos.range
      });
    } else {
      this.customCellStyleArrangement[index].customStyleId = customStyleId;
    }

    // update cell group
    if (cellPos.range) {
      for (let col = cellPos.range.start.col; col <= cellPos.range.end.col; col++) {
        for (let row = cellPos.range.start.row; row <= cellPos.range.end.row; row++) {
          this.table.scenegraph.updateCellContent(col, row);
        }
      }
    } else {
      this.table.scenegraph.updateCellContent(cellPos.col, cellPos.row);
    }
    this.table.scenegraph.updateNextFrame();
  }
}

export function mergeStyle(cacheStyle: Style, customCellStyle: ColumnStyleOption): Style {
  cacheStyle = cacheStyle.clone();

  for (const key in customCellStyle) {
    const value = customCellStyle[key];
    if (value) {
      cacheStyle[`_${key}`] = value;
    }
  }

  return cacheStyle;
}
