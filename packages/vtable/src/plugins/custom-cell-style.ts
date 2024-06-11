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
      return styleOption?.style;
    }
    return undefined;
  }

  getCustomCellStyleId(col: number, row: number) {
    let customStyleId;
    this.customCellStyleArrangement.forEach(style => {
      if (style.cellPosition.range) {
        if (
          style.cellPosition.range.start.col <= col &&
          style.cellPosition.range.end.col >= col &&
          style.cellPosition.range.start.row <= row &&
          style.cellPosition.range.end.row >= row
        ) {
          customStyleId = style.customStyleId;
        }
      } else if (style.cellPosition.col === col && style.cellPosition.row === row) {
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

    this.customCellStyleArrangement.forEach(cellStyle => {
      const cellPos = cellStyle.cellPosition;
      if (cellStyle.customStyleId === customStyleId) {
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

    if (index === -1) {
      this.customCellStyleArrangement.push({
        cellPosition: {
          col: cellPos.col,
          row: cellPos.row,
          range: cellPos.range
        },
        customStyleId: customStyleId
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
    const value = customCellStyle[key];
    if (value) {
      cacheStyle[`_${key}`] = value;
    }
  }

  return cacheStyle;
}
