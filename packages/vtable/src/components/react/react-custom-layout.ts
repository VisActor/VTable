import { Group } from '@src/vrender';
import type { CustomRenderFunctionArg, ICustomLayoutFuc } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';
import type { PivotHeaderLayoutMap } from '../../layout/pivot-header-layout';
import type { SimpleHeaderLayoutMap } from '../../layout';

export function emptyCustomLayout(args: CustomRenderFunctionArg) {
  const group = new Group({});
  return {
    rootContainer: group,
    renderDefault: true
  };
}

export class ReactCustomLayout {
  removeAllContainer: () => void;
  table: BaseTableAPI;
  customLayoutFuncCache: Map<string, ICustomLayoutFuc>;
  reactRemoveGraphicCache: Map<string, (col: number, row: number) => void>;
  reactRemoveAllGraphicCache: Map<string, () => void>;
  headerCustomLayoutFuncCache: Map<string, ICustomLayoutFuc>;
  headerReactRemoveGraphicCache: Map<string, (col: number, row: number) => void>;
  headerReactRemoveAllGraphicCache: Map<string, () => void>;
  // reactContainerCache: Map<number, Map<string, any>>;
  constructor(table: BaseTableAPI) {
    // this.removeAllContainer = removeAllContainer;
    this.table = table;
    this.customLayoutFuncCache = new Map();
    // this.reactContainerCache = new Map();
    this.reactRemoveGraphicCache = new Map();
    this.reactRemoveAllGraphicCache = new Map();
    this.headerCustomLayoutFuncCache = new Map();
    // this.headerCeactContainerCache = new Map();
    this.headerReactRemoveGraphicCache = new Map();
    this.headerReactRemoveAllGraphicCache = new Map();
  }

  hasReactCreateGraphic(componentId: string, isHeaderCustomLayout?: boolean) {
    if (isHeaderCustomLayout) {
      return this.headerCustomLayoutFuncCache.has(componentId);
    }
    return this.customLayoutFuncCache.has(componentId);
  }

  setReactCreateGraphic(
    componentId: string,
    createGraphic: ICustomLayoutFuc,
    // containerCache: Map<string, any>,
    isHeaderCustomLayout?: boolean
  ) {
    if (isHeaderCustomLayout) {
      this.headerCustomLayoutFuncCache.set(componentId, createGraphic);
    } else {
      this.customLayoutFuncCache.set(componentId, createGraphic);
    }
    // this.reactContainerCache.set(componentId, containerCache);
  }

  setReactRemoveGraphic(
    componentId: string,
    removeGraphic: (col: number, row: number) => void,
    isHeaderCustomLayout?: boolean
  ) {
    if (isHeaderCustomLayout) {
      this.headerReactRemoveGraphicCache.set(componentId, removeGraphic);
    } else {
      this.reactRemoveGraphicCache.set(componentId, removeGraphic);
    }
  }

  setReactRemoveAllGraphic(componentId: string, removeGraphic: () => void, isHeaderCustomLayout?: boolean) {
    if (isHeaderCustomLayout) {
      this.headerReactRemoveAllGraphicCache.set(componentId, removeGraphic);
    } else {
      this.reactRemoveAllGraphicCache.set(componentId, removeGraphic);
    }
  }

  updateCustomCell(componentId: string, isHeaderCustomLayout?: boolean) {
    const table = this.table;
    // const col = componentId;
    // // to do: deal with transpose table
    // if (isHeaderCustomLayout) {
    //   for (let row = 0; row < table.columnHeaderLevelCount; row++) {
    //     table.scenegraph.updateCellContent(col, row);
    //   }
    // } else {
    //   for (let row = table.columnHeaderLevelCount; row < table.rowCount; row++) {
    //     table.scenegraph.updateCellContent(col, row);
    //   }
    // }

    if (table.isPivotTable()) {
      const ranges = getUpdateCustomCellRangeInPivotTable(componentId, table, isHeaderCustomLayout);
      for (let i = 0; i < ranges.length; i++) {
        const range = ranges[i];
        for (let col = range.start.col; col <= range.end.col; col++) {
          for (let row = range.start.row; row <= range.end.row; row++) {
            table.scenegraph.updateCellContent(col, row);
          }
        }
      }
    } else {
      const range = getUpdateCustomCellRangeInListTable(componentId, table, isHeaderCustomLayout);
      for (let col = range.start.col; col <= range.end.col; col++) {
        for (let row = range.start.row; row <= range.end.row; row++) {
          table.scenegraph.updateCellContent(col, row);
        }
      }
    }
    if (table.widthMode === 'autoWidth') {
      table.scenegraph.recalculateColWidths();
    }
    if (table.isAutoRowHeight()) {
      table.scenegraph.recalculateRowHeights();
    }
    // table.scenegraph.updateNextFrame();
    table.scenegraph.renderSceneGraph(); // use sync render for faster update
  }

  getCustomLayoutFunc(col: number, row: number) {
    const isHeader = this.table.isHeader(col, row);
    if (isHeader) {
      const { componentId } = this.table.getHeaderDefine(col, row) as any;
      return this.headerCustomLayoutFuncCache.get(componentId) ?? emptyCustomLayout;
    }
    const { componentId } = this.table.getBodyColumnDefine(col, row) as any;
    return this.customLayoutFuncCache.get(componentId) || emptyCustomLayout;
  }

  removeCustomCell(col: number, row: number) {
    // const { startInTotal } = this.table.getBodyColumnDefine(col, row) as any;
    const isHeader = this.table.isHeader(col, row);
    let removeFun;
    if (isHeader) {
      const define = this.table.getHeaderDefine(col, row);
      const { componentId } = define as any;
      removeFun = this.headerReactRemoveGraphicCache.get(componentId);
    } else {
      const define = this.table.getBodyColumnDefine(col, row);
      const { componentId } = define as any;
      removeFun = this.reactRemoveGraphicCache.get(componentId);
    }
    if (removeFun) {
      removeFun(col, row);
    }
  }

  clearCache() {
    this.reactRemoveAllGraphicCache.forEach(removeFun => {
      removeFun();
    });
    this.headerReactRemoveAllGraphicCache.forEach(removeFun => {
      removeFun();
    });
  }

  updateAllCustomCell() {
    this.customLayoutFuncCache.forEach((createFun, componentId) => {
      this.updateCustomCell(componentId);
    });
    this.headerCustomLayoutFuncCache.forEach((createFun, componentId) => {
      this.updateCustomCell(componentId, true);
    });
  }
}

function getUpdateCustomCellRangeInListTable(componentId: string, table: BaseTableAPI, isHeaderCustomLayout?: boolean) {
  const rowSeriesNumber = table.internalProps.rowSeriesNumber ? 1 : 0;
  if (isHeaderCustomLayout) {
    const layoutMap = table.internalProps.layoutMap as SimpleHeaderLayoutMap;
    const { headerObjects } = table.internalProps.layoutMap;
    let headerId: number;
    for (let i = 0; i < headerObjects.length; i++) {
      const headerObject = headerObjects[i];
      if ((headerObject.define as any).componentId === componentId) {
        headerId = headerObject.id as number;
        break;
      }
    }

    const startCell = layoutMap.getHeaderCellAdressById(headerId);
    const range = layoutMap.getCellRange(startCell.col, startCell.row);
    return range;

    // let startCol = -1;
    // let endCol = -1;
    // let startRow = -1;
    // let endRow = -1;
    // for (let i = 0; i < _headerCellIds.length; i++) {
    //   const row = _headerCellIds[i];
    //   let rowHasObject = false;
    //   for (let j = 0; j < row.length; j++) {
    //     if (row[j] === headerId) {
    //       rowHasObject = true;
    //       if (transpose) {
    //         // return { col: i, row: j };
    //         startCol === -1 && (startCol = i);
    //         startRow === -1 && (startRow = j);
    //       } else {
    //         // return { col: j + this.leftRowSeriesNumberColumnCount, row: i };
    //         startCol === -1 && (startCol = j);
    //         startRow === -1 && (startRow = i);
    //       }
    //     } else {
    //       if (transpose) {
    //         // endCol === -1 && startCol !== -1 && (endCol = i);
    //         endRow === -1 && startRow !== -1 && (endRow = j - 1);
    //       } else {
    //         endCol === -1 && startCol !== -1 && (endCol = j - 1);
    //         // endRow === -1 && startRow !== -1 && (endRow = i);
    //       }
    //     }

    //     if (startCol !== -1 && endCol !== -1 && startRow !== -1 && endRow !== -1) {
    //       break;
    //     }
    //   }

    //   if (!rowHasObject) {
    //     if (transpose) {
    //       endCol === -1 && startCol !== -1 && (endCol = i - 1);
    //     } else {
    //       endRow === -1 && startRow !== -1 && (endRow = i - 1);
    //     }
    //   }

    //   if (startCol !== -1 && endCol !== -1 && startRow !== -1 && endRow !== -1) {
    //     break;
    //   }
    // }

    // return {
    //   startCol: startCol + rowSeriesNumber,
    //   endCol: endCol + rowSeriesNumber,
    //   startRow,
    //   endRow
    // };
  }
  const { columnObjects } = table.internalProps.layoutMap;
  for (let i = 0; i < columnObjects.length; i++) {
    const columnObject = columnObjects[i];
    if ((columnObject.define as any).componentId === componentId) {
      return {
        start: {
          col: rowSeriesNumber + i,
          row: table.columnHeaderLevelCount
        },
        end: {
          col: rowSeriesNumber + i,
          row: table.rowCount - 1
        }
      };
    }
  }

  return {
    start: {
      col: 0,
      row: 0
    },
    end: {
      col: table.colCount - 1,
      row: table.rowCount - 1
    }
  };
}

function getUpdateCustomCellRangeInPivotTable(
  componentId: string,
  table: BaseTableAPI,
  isHeaderCustomLayout?: boolean
) {
  const rowSeriesNumber = table.internalProps.rowSeriesNumber ? 1 : 0;
  const ranges = [];
  const layoutMap = table.internalProps.layoutMap as PivotHeaderLayoutMap;
  if (isHeaderCustomLayout) {
    const { headerObjects } = layoutMap;
    const headerIds: number[] = [];
    for (let i = 0; i < headerObjects.length; i++) {
      const headerObject = headerObjects[i];
      if (!headerObject) {
        continue;
      }
      if ((headerObject.define as any).componentId === componentId) {
        headerIds.push(headerObject.id as number);
      }
    }

    for (let i = 0; i < headerIds.length; i++) {
      const headerId = headerIds[i];
      const startCell = layoutMap.getHeaderCellAdressById(headerId);
      const range = layoutMap.getCellRange(startCell.col, startCell.row);
      ranges.push(range);
    }
  } else {
    let columnIndex: number;
    const { columnObjects, indicatorsAsCol } = layoutMap;
    for (let i = 0; i < columnObjects.length; i++) {
      const columnObject = columnObjects[i];
      if ((columnObject.define as any).componentId === componentId) {
        columnIndex = i;
        break;
      }
    }

    if (indicatorsAsCol) {
      for (
        let column = layoutMap.rowHeaderLevelCount + columnIndex;
        column < layoutMap.colCount;
        column += columnObjects.length
      ) {
        const range = {
          start: {
            col: column + rowSeriesNumber,
            row: layoutMap.columnHeaderLevelCount
          },
          end: {
            col: column + rowSeriesNumber,
            row: layoutMap.rowCount - 1
          }
        };
        ranges.push(range);
      }
    } else {
      for (
        let row = layoutMap.columnHeaderLevelCount + columnIndex;
        row < layoutMap.rowCount;
        row += columnObjects.length
      ) {
        const range = {
          start: {
            col: layoutMap.rowHeaderLevelCount + rowSeriesNumber,
            row: row
          },
          end: {
            col: layoutMap.colCount - 1,
            row: row
          }
        };
        ranges.push(range);
      }
    }
  }

  return ranges;

  // return {
  //   startCol: 0,
  //   endCol: table.colCount - 1,
  //   startRow: 0,
  //   endRow: table.rowCount - 1
  // };
}
