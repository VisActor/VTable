import { Group } from '@src/vrender';
import type { CustomRenderFunctionArg, ICustomLayoutFuc } from '../../ts-types';
import type { BaseTableAPI } from '../../ts-types/base-table';

export function emptyCustomLayout(args: CustomRenderFunctionArg) {
  const group = new Group({});
  return {
    rootContainer: group,
    renderDefault: true
  };
}

export class ReactCustomLayout {
  table: BaseTableAPI;
  customLayoutFuncCache: Map<string, ICustomLayoutFuc>;
  reactRemoveGraphicCache: Map<string, (col: number, row: number) => void>;
  headerCustomLayoutFuncCache: Map<string, ICustomLayoutFuc>;
  headerReactRemoveGraphicCache: Map<string, (col: number, row: number) => void>;
  // reactContainerCache: Map<number, Map<string, any>>;
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.customLayoutFuncCache = new Map();
    // this.reactContainerCache = new Map();
    this.reactRemoveGraphicCache = new Map();
    this.headerCustomLayoutFuncCache = new Map();
    // this.headerCeactContainerCache = new Map();
    this.headerReactRemoveGraphicCache = new Map();
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

    const range = getUpdateCustomCellRange(componentId, table, isHeaderCustomLayout);
    for (let col = range.startCol; col <= range.endCol; col++) {
      for (let row = range.startRow; row <= range.endRow; row++) {
        table.scenegraph.updateCellContent(col, row);
      }
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
    const { startInTotal } = this.table.getBodyColumnDefine(col, row) as any;
    const isHeader = this.table.isHeader(col, row);
    const removeFun = isHeader
      ? this.headerReactRemoveGraphicCache.get(startInTotal)
      : this.reactRemoveGraphicCache.get(startInTotal);
    if (removeFun) {
      removeFun(col, row);
    }
  }
}

function getUpdateCustomCellRange(componentId: string, table: BaseTableAPI, isHeaderCustomLayout?: boolean) {
  const rowSeriesNumber = table.internalProps.rowSeriesNumber ? 1 : 0;
  if (isHeaderCustomLayout) {
    const { headerObjects, _headerCellIds, transpose } = table.internalProps.layoutMap;
    let headerId;
    for (let i = 0; i < headerObjects.length; i++) {
      const headerObject = headerObjects[i];
      if ((headerObject.define as any).componentId === componentId) {
        headerId = headerObject.id;
        break;
      }
    }

    let startCol = -1;
    let endCol = -1;
    let startRow = -1;
    let endRow = -1;
    for (let i = 0; i < _headerCellIds.length; i++) {
      const row = _headerCellIds[i];
      let rowHasObject = false;
      for (let j = 0; j < row.length; j++) {
        if (row[j] === headerId) {
          rowHasObject = true;
          if (transpose) {
            // return { col: i, row: j };
            startCol === -1 && (startCol = i);
            startRow === -1 && (startRow = j);
          } else {
            // return { col: j + this.leftRowSeriesNumberColumnCount, row: i };
            startCol === -1 && (startCol = j);
            startRow === -1 && (startRow = i);
          }
        } else {
          if (transpose) {
            // endCol === -1 && startCol !== -1 && (endCol = i);
            endRow === -1 && startRow !== -1 && (endRow = j - 1);
          } else {
            endCol === -1 && startCol !== -1 && (endCol = j - 1);
            // endRow === -1 && startRow !== -1 && (endRow = i);
          }
        }

        if (startCol !== -1 && endCol !== -1 && startRow !== -1 && endRow !== -1) {
          break;
        }
      }

      if (!rowHasObject) {
        if (transpose) {
          endCol === -1 && startCol !== -1 && (endCol = i - 1);
        } else {
          endRow === -1 && startRow !== -1 && (endRow = i - 1);
        }
      }

      if (startCol !== -1 && endCol !== -1 && startRow !== -1 && endRow !== -1) {
        break;
      }
    }

    return {
      startCol: startCol + rowSeriesNumber,
      endCol: endCol + rowSeriesNumber,
      startRow,
      endRow
    };
  }
  const { columnObjects } = table.internalProps.layoutMap;
  for (let i = 0; i < columnObjects.length; i++) {
    const columnObject = columnObjects[i];
    if ((columnObject.define as any).componentId === componentId) {
      return {
        startCol: rowSeriesNumber + i,
        endCol: rowSeriesNumber + i,
        startRow: table.columnHeaderLevelCount,
        endRow: table.rowCount - 1
      };
    }
  }

  // to do: pivot table

  // return {
  //   startCol: 0,
  //   endCol: table.colCount - 1,
  //   startRow: 0,
  //   endRow: table.rowCount - 1
  // };
}
