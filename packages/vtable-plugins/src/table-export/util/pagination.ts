import { cloneDeep } from '@visactor/vutils';
import type { IVTable } from './type';
import type { PivotHeaderLayoutMap } from '@visactor/vtable/src/layout/pivot-header-layout';
export function handlePaginationExport(table: IVTable, exportAllData: boolean) {
  const pagination = cloneDeep(table.pagination);
  const isPivot = table.isPivotTable();
  const layoutMap = table.internalProps.layoutMap;
  let maxRow = table.rowCount - 1;
  const handleRowCount = () => {
    if (exportAllData) {
      if (pagination) {
        if (isPivot) {
          (table.internalProps.layoutMap as PivotHeaderLayoutMap).setPagination(undefined);
          table.refreshRowColCount();
          maxRow = table.rowCount - 1;
        } else {
          maxRow = table.recordsCount * layoutMap.bodyRowSpanCount + layoutMap.headerLevelCount;
        }
      }
    }
    return maxRow;
  };

  const reset = () => {
    // 恢复透视表的pagination配置
    if (isPivot && exportAllData && pagination) {
      (table.internalProps.layoutMap as PivotHeaderLayoutMap).setPagination(pagination);
      // 刷新，恢复分页时的rowCount，保证在导出时是正确的rowCount
      table.refreshRowColCount();
    }
  };
  return {
    reset,
    handleRowCount
  };
}
