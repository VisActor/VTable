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
  reactContainerCache: Map<number, Map<string, any>>;
  constructor(table: BaseTableAPI) {
    this.table = table;
    this.customLayoutFuncCache = new Map();
    this.reactContainerCache = new Map();
    this.reactRemoveGraphicCache = new Map();
  }

  hasReactCreateGraphic(componentIndex: number) {
    return this.reactContainerCache.has(componentIndex);
  }

  setReactCreateGraphic(componentIndex: number, createGraphic: ICustomLayoutFuc, containerCache: Map<string, any>) {
    this.customLayoutFuncCache.set(componentIndex, createGraphic);
    this.reactContainerCache.set(componentIndex, containerCache);
  }

  setReactRemoveGraphic(componentIndex: number, removeGraphic: (col: number, row: number) => void) {
    this.reactRemoveGraphicCache.set(componentIndex, removeGraphic);
  }

  updateCustomCell(componentIndex: number) {
    const table = this.table;
    const col = componentIndex;
    for (let row = table.columnHeaderLevelCount; row < table.rowCount; row++) {
      table.scenegraph.updateCellContent(col, row);
    }
    table.scenegraph.updateNextFrame();
  }

  getCustomLayoutFunc(col: number, row: number) {
    const { startInTotal } = this.table.getBodyColumnDefine(col, row) as any;
    return this.customLayoutFuncCache.get(startInTotal) || emptyCustomLayout;
  }

  removeCustomCell(col: number, row: number) {
    const { startInTotal } = this.table.getBodyColumnDefine(col, row) as any;
    const removeFun = this.reactRemoveGraphicCache.get(startInTotal);
    if (removeFun) {
      removeFun(col, row);
    }
  }
}
