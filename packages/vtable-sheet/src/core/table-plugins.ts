import type * as VTable from '@visactor/vtable';
import * as VTablePlugins from '@visactor/vtable-plugins';
import type { ISheetDefine, IColumnDefine, IVTableSheetOptions } from '../ts-types';
import { isValid } from '@visactor/vutils';

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
    colSeriesNumberHeight: 30,
    rowSeriesNumberCellStyle: options?.theme?.rowSeriesNumberCellStyle,
    colSeriesNumberCellStyle: options?.theme?.colSeriesNumberCellStyle
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
  if (options?.VTablePluginModules) {
    options.VTablePluginModules.forEach(
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
    // 由于在 vtable-sheet，把列索引作为列的唯一标识 field，因此这里直接使用列索引
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
      },
      {
        text: '首行表头',
        menuKey: 'enable_first_row_as_header'
      },
      {
        text: '取消表头',
        menuKey: 'disable_first_row_as_header'
      }
    ],
    bodyCellMenuItems: [
      ...VTablePlugins.DEFAULT_BODY_MENU_ITEMS,
      {
        text: '启用首行表头',
        menuKey: 'enable_first_row_as_header'
      }
    ],
    columnSeriesNumberMenuItems: [
      ...VTablePlugins.DEFAULT_COLUMN_SERIES_MENU_ITEMS,
      {
        text: '首行表头',
        menuKey: 'enable_first_row_as_header'
      },
      {
        text: '取消表头',
        menuKey: 'disable_first_row_as_header'
      }
    ],
    beforeShowAdjustMenuItems: (
      menuItems: VTablePlugins.MenuItemOrSeparator[],
      table: VTable.ListTable,
      col: number,
      row: number
    ) => {
      console.log('beforeShowAdjustMenuItems', menuItems, table, col, row);
      let isColumnSeriesNumber = false;
      let isHeaderCell = false;
      let isBodyCell = false;

      if (!isValid(row)) {
        isColumnSeriesNumber = true;
      }
      if (isValid(col) && isValid(row)) {
        if (table.isHeader(col, row)) {
          isHeaderCell = true;
        } else {
          isBodyCell = true;
        }
      }
      if (isHeaderCell) {
        const column = table.options.columns[col] as IColumnDefine;
        if (column.filter ?? sheetDefine?.filter) {
          menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'set_filter');
        } else {
          menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'cancel_filter');
        }
      }

      if (isHeaderCell) {
        menuItems = menuItems.filter(item => typeof item === 'string' || item.menuKey !== 'enable_first_row_as_header');
      } else if (isBodyCell) {
        if (row === 0) {
          menuItems = menuItems.filter(
            item => typeof item === 'string' || item.menuKey !== 'disable_first_row_as_header'
          );
        } else {
          menuItems = menuItems.filter(
            item => typeof item === 'string' || item.menuKey !== 'enable_first_row_as_header'
          );
        }
      } else if (isColumnSeriesNumber) {
        if (table.isHeader(col, 0)) {
          menuItems = menuItems.filter(
            item => typeof item === 'string' || item.menuKey !== 'enable_first_row_as_header'
          );
        } else {
          menuItems = menuItems.filter(
            item => typeof item === 'string' || item.menuKey !== 'disable_first_row_as_header'
          );
        }
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
        table.updateOption(newOptions, { clearColWidthCache: false, clearRowHeightCache: false });
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
        table.updateOption(newOptions, { clearColWidthCache: false, clearRowHeightCache: false });
      },
      enable_first_row_as_header: (args: VTablePlugins.MenuClickEventArgs, table: VTable.ListTable) => {
        handleEnableFirstRowAsHeader(table);
      },
      disable_first_row_as_header: (args: VTablePlugins.MenuClickEventArgs, table: VTable.ListTable) => {
        handleDisableFirstRowAsHeader(table);
      }
    }
  });
}

/**
 * 处理启用第一行作为表头
 */
function handleEnableFirstRowAsHeader(table: VTable.ListTable): void {
  // 获取第一行数据
  const firstRecord = table.records[0] as string[];
  // 获取剩余数据
  const new_records = table.records.slice(1);
  //获取当前column
  const columns = table.columns;
  // 设置第一行为表头
  firstRecord.forEach((item, index) => {
    columns[index].title = item;
  });
  table.updateOption(Object.assign({}, table.options, { records: new_records, columns, showHeader: true }), {
    clearColWidthCache: false,
    clearRowHeightCache: false
  });
  // 更新渲染
  table.scenegraph.updateNextFrame();
}

/**
 * 处理禁用第一行作为表头
 */
function handleDisableFirstRowAsHeader(table: VTable.ListTable): void {
  const columns = table.columns;
  const firstRecord: (string | number)[] = [];
  columns.forEach((col, index) => {
    firstRecord.push(col.title as string);
  });
  //像records中添加第一行
  const new_records = [firstRecord, ...table.records];
  table.updateOption(Object.assign({}, table.options, { records: new_records, columns, showHeader: false }), {
    clearColWidthCache: false,
    clearRowHeightCache: false
  });
  table.scenegraph.updateNextFrame();
}
