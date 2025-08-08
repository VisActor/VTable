import type * as VTable from '@visactor/vtable';
import * as VTablePlugins from '@visactor/vtable-plugins';
import type { ISheetDefine, IColumnDefine, IVTableSheetOptions } from '../ts-types';

/**
 * 获取表格插件列表
 * @param sheetDefine Sheet配置定义
 * @returns 插件数组
 */
export function getTablePlugins(
  sheetDefine?: ISheetDefine,
  options?: IVTableSheetOptions
): VTable.plugins.IVTablePlugin[] {
  const filterPlugin = createFilterPlugin(sheetDefine);
  const addRowColumnPlugin = new VTablePlugins.AddRowColumnPlugin({
    addRowCallback: (row: number, tableInstance: VTable.ListTable) => {
      tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
    }
  });
  const tableSeriesNumberPlugin = new VTablePlugins.TableSeriesNumber({
    rowCount: 100,
    colCount: 100,
    rowSeriesNumberWidth: 30,
    colSeriesNumberHeight: 30
  });
  const highlightHeaderWhenSelectCellPlugin = new VTablePlugins.HighlightHeaderWhenSelectCellPlugin({
    colHighlight: true,
    rowHighlight: true
  });
  const contextMenuPlugin = createContextMenuItems(sheetDefine);
  const excelEditCellKeyboardPlugin = new VTablePlugins.ExcelEditCellKeyboardPlugin();
  const plugins: VTable.plugins.IVTablePlugin[] = [
    addRowColumnPlugin,
    tableSeriesNumberPlugin,
    highlightHeaderWhenSelectCellPlugin,
    contextMenuPlugin,
    excelEditCellKeyboardPlugin,
    filterPlugin
  ];
  if (options?.pluginModules) {
    options.pluginModules.forEach(
      (module: { module: new (options: any) => VTable.plugins.IVTablePlugin; moduleOptions: any }) => {
        if (typeof module.module === 'function') {
          // 检查是否为构造函数
          plugins.push(new module.module(module.moduleOptions));
        } else {
          throw new Error(`Invalid plugin: ${module.module}`);
        }
      }
    );
  }
  return plugins;
}

/**
 * 创建筛选插件（如果需要）
 * @param sheetDefine Sheet配置
 * @returns 筛选插件实例或null
 */
function createFilterPlugin(sheetDefine?: ISheetDefine): VTablePlugins.FilterPlugin | null {
  // 对象配置
  if (typeof sheetDefine.filter === 'object') {
    return new VTablePlugins.FilterPlugin({
      filterIcon: sheetDefine.filter.filterIcon,
      filteringIcon: sheetDefine.filter.filteringIcon,
      enableFilter: createColumnFilterChecker(sheetDefine)
    });
  }
  return new VTablePlugins.FilterPlugin({
    enableFilter: createColumnFilterChecker(sheetDefine)
  });
}

/**
 * 创建列级别筛选检查函数
 * @param sheetDefine Sheet配置
 * @returns 筛选检查函数
 */
function createColumnFilterChecker(sheetDefine: ISheetDefine) {
  return (columnIndex: number, column: VTable.TYPES.ColumnDefine): boolean => {
    // 确保列索引有效
    if (columnIndex < 0 || !sheetDefine.columns || columnIndex >= sheetDefine.columns.length) {
      return false; // 默认启用，保持向后兼容
    }

    // 获取列定义配置
    const columnDefine = sheetDefine.columns[columnIndex] as IColumnDefine;
    const filter = !!(columnDefine?.filter ?? sheetDefine.filter);
    // 明确禁用检查
    return filter;
  };
}

function createContextMenuItems(sheetDefine: ISheetDefine) {
  return new VTablePlugins.ContextMenuPlugin({
    headerCellMenuItems: [
      ...VTablePlugins.DEFAULT_HEADER_MENU_ITEMS,
      {
        text: '设置筛选器',
        menuKey: 'set_filter'
      },
      {
        text: '取消筛选器',
        menuKey: 'cancel_filter'
      }
    ],
    beforeShowAdjustMenuItems: (
      menuItems: VTablePlugins.MenuItemOrSeparator[],
      table: VTable.ListTable,
      col: number,
      row: number
    ) => {
      console.log('beforeShowAdjustMenuItems', menuItems, table, col, row);
      const cellType = table.isHeader(col, row) ? 'headerCell' : 'bodyCell';
      if (cellType === 'bodyCell') {
        return menuItems;
      }
      const column = table.options.columns[col] as IColumnDefine;
      if (column.filter ?? sheetDefine?.filter) {
        menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'set_filter');
      } else {
        menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'cancel_filter');
      }
      return menuItems;
    },
    menuClickCallback: {
      set_filter: (args: VTablePlugins.MenuClickEventArgs, table: VTable.ListTable) => {
        console.log('set_filter', args, table);
        // 更新 sheetDefine 配置
        sheetDefine.columns[args.colIndex].filter = true;

        // 创建新的 options 对象，确保配置变化被正确传递
        const newOptions = {
          ...table.options,
          columns: table.options.columns.map((col: VTable.ColumnDefine, index: number) => {
            if (index === args.colIndex) {
              return { ...col, filter: true };
            }
            return col;
          })
        };

        // 更新表格配置
        table.updateOption(newOptions);
      },
      cancel_filter: (args: VTablePlugins.MenuClickEventArgs, table: VTable.ListTable) => {
        console.log('cancel_filter', args, table);
        // 更新 sheetDefine 配置
        sheetDefine.columns[args.colIndex].filter = false;

        // 创建新的 options 对象，确保配置变化被正确传递
        const newOptions = {
          ...table.options,
          columns: table.options.columns.map((col: VTable.ColumnDefine, index: number) => {
            if (index === args.colIndex) {
              return { ...col, filter: false };
            }
            return col;
          })
        };

        // 更新表格配置
        table.updateOption(newOptions);
      }
    }
  });
}
