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
  customLayoutFuncCache: Map<number, ICustomLayoutFuc>;
  reactRemoveGraphicCache: Map<number, (col: number, row: number) => void>;
  headerCustomLayoutFuncCache: Map<number, ICustomLayoutFuc>;
  headerReactRemoveGraphicCache: Map<number, (col: number, row: number) => void>;
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

  hasReactCreateGraphic(componentIndex: number, isHeaderCustomLayout?: boolean) {
    if (isHeaderCustomLayout) {
      return this.headerCustomLayoutFuncCache.has(componentIndex);
    }
    return this.customLayoutFuncCache.has(componentIndex);
  }

  setReactCreateGraphic(
    componentIndex: number,
    createGraphic: ICustomLayoutFuc,
    // containerCache: Map<string, any>,
    isHeaderCustomLayout?: boolean
  ) {
    if (isHeaderCustomLayout) {
      this.headerCustomLayoutFuncCache.set(componentIndex, createGraphic);
    } else {
      this.customLayoutFuncCache.set(componentIndex, createGraphic);
    }
    // this.reactContainerCache.set(componentIndex, containerCache);
  }

  setReactRemoveGraphic(
    componentIndex: number,
    removeGraphic: (col: number, row: number) => void,
    isHeaderCustomLayout?: boolean
  ) {
    if (isHeaderCustomLayout) {
      this.headerReactRemoveGraphicCache.set(componentIndex, removeGraphic);
    } else {
      this.reactRemoveGraphicCache.set(componentIndex, removeGraphic);
    }
  }

  updateCustomCell(componentIndex: number, isHeaderCustomLayout?: boolean) {
    const table = this.table;
    const col = componentIndex;
    // to do: deal with transpose table
    if (isHeaderCustomLayout) {
      for (let row = 0; row < table.columnHeaderLevelCount; row++) {
        table.scenegraph.updateCellContent(col, row);
      }
    } else {
      for (let row = table.columnHeaderLevelCount; row < table.rowCount; row++) {
        table.scenegraph.updateCellContent(col, row);
      }
    }
    // table.scenegraph.updateNextFrame();
    table.scenegraph.renderSceneGraph(); // use sync render for faster update
  }

  getCustomLayoutFunc(col: number, row: number) {
    const { startInTotal } = this.table.getBodyColumnDefine(col, row) as any;
    const isHeader = this.table.isHeader(col, row);
    return (
      (isHeader ? this.headerCustomLayoutFuncCache.get(startInTotal) : this.customLayoutFuncCache.get(startInTotal)) ||
      emptyCustomLayout
    );
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
