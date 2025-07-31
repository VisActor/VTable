import type * as VTable from '@visactor/vtable';
import * as VTablePlugins from '@visactor/vtable-plugins';
import type { ISheetDefine, IColumnDefine } from '../ts-types';

/**
 * 获取表格插件列表
 * @param sheetDefine Sheet配置定义
 * @returns 插件数组
 */
export function getTablePlugins(sheetDefine?: ISheetDefine): VTable.TYPES.IPlugin[] {
  const plugins: VTable.TYPES.IPlugin[] = [
    new VTablePlugins.AddRowColumnPlugin({
      addRowCallback: (row: number, tableInstance: VTable.ListTable) => {
        tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
      }
    }),
    new VTablePlugins.TableSeriesNumber({
      rowCount: 100,
      colCount: 100,
      rowSeriesNumberWidth: 30,
      colSeriesNumberHeight: 30
    }),
    new VTablePlugins.HighlightHeaderWhenSelectCellPlugin({
      colHighlight: true,
      rowHighlight: true
    }),
    new VTablePlugins.ContextMenuPlugin({}),
    new VTablePlugins.ExcelEditCellKeyboardPlugin()
  ];

  const filterPlugin = createFilterPlugin(sheetDefine);
  if (filterPlugin) {
    plugins.push(filterPlugin);
  }

  return plugins;
}

/**
 * 创建筛选插件（如果需要）
 * @param sheetDefine Sheet配置
 * @returns 筛选插件实例或null
 */
function createFilterPlugin(sheetDefine?: ISheetDefine): VTablePlugins.FilterPlugin | null {
  if (!sheetDefine?.filter) {
    return null;
  }

  // 简单布尔值配置
  if (sheetDefine.filter === true) {
    return new VTablePlugins.FilterPlugin({
      enableFilter: createColumnFilterChecker(sheetDefine)
    });
  }

  // 对象配置
  if (typeof sheetDefine.filter === 'object') {
    return new VTablePlugins.FilterPlugin({
      filterIcon: sheetDefine.filter.filterIcon,
      filteringIcon: sheetDefine.filter.filteringIcon,
      enableFilter: createColumnFilterChecker(sheetDefine)
    });
  }

  return null;
}

/**
 * 创建列级别筛选检查函数
 * @param sheetDefine Sheet配置
 * @returns 筛选检查函数
 */
function createColumnFilterChecker(sheetDefine: ISheetDefine) {
  return (columnIndex: number, column: VTable.TYPES.ColumnDefine): boolean => {
    // 空白列不启用筛选
    if (!column.title) {
      return false;
    }

    // 确保列索引有效
    if (columnIndex < 0 || !sheetDefine.columns || columnIndex >= sheetDefine.columns.length) {
      return true; // 默认启用，保持向后兼容
    }

    // 获取列定义配置
    const columnDefine = sheetDefine.columns[columnIndex] as IColumnDefine;

    // 明确禁用检查
    if (columnDefine?.filter === false) {
      return false;
    }

    // 其他情况（true 或 undefined）都启用筛选
    return true;
  };
}
