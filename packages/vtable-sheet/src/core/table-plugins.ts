import type * as VTable from '@visactor/vtable';
import {
  FilterPlugin,
  AddRowColumnPlugin,
  TableSeriesNumber,
  HighlightHeaderWhenSelectCellPlugin,
  ContextMenuPlugin,
  ExcelEditCellKeyboardPlugin,
  AutoFillPlugin,
  DEFAULT_HEADER_MENU_ITEMS,
  DEFAULT_BODY_MENU_ITEMS,
  DEFAULT_COLUMN_SERIES_MENU_ITEMS
} from '@visactor/vtable-plugins';
import type {
  FilterOptions,
  MenuItemOrSeparator,
  MenuClickEventArgs,
  AddRowColumnOptions,
  TableSeriesNumberOptions,
  IHighlightHeaderWhenSelectCellPluginOptions,
  ContextMenuOptions
} from '@visactor/vtable-plugins';
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
  const plugins: VTable.plugins.IVTablePlugin[] = [];
  // 结合options.VTablePluginModules，来判断是否禁用插件
  const disabledPlugins = options?.VTablePluginModules?.filter(module => module.disabled);
  const enabledPlugins = options?.VTablePluginModules?.filter(module => !module.disabled);
  if (!disabledPlugins?.some(module => module.module === FilterPlugin)) {
    const userPluginOptions = enabledPlugins?.find(module => module.module === FilterPlugin)
      ?.moduleOptions as FilterOptions;
    const filterPlugin = createFilterPlugin(sheetDefine, userPluginOptions);
    plugins.push(filterPlugin);
  }
  if (!disabledPlugins?.some(module => module.module === AddRowColumnPlugin)) {
    const userPluginOptions = enabledPlugins?.find(module => module.module === AddRowColumnPlugin)
      ?.moduleOptions as AddRowColumnOptions;
    const addRowColumnPlugin = new AddRowColumnPlugin({
      addRowCallback: (row: number, tableInstance: VTable.ListTable) => {
        tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
      },
      ...userPluginOptions
    });
    plugins.push(addRowColumnPlugin);
  }
  if (!disabledPlugins?.some(module => module.module === TableSeriesNumber)) {
    const userPluginOptions = enabledPlugins?.find(module => module.module === TableSeriesNumber)
      ?.moduleOptions as TableSeriesNumberOptions;
    const tableSeriesNumberPlugin = new TableSeriesNumber({
      rowCount: sheetDefine?.rowCount || 100,
      colCount: sheetDefine?.columnCount || 100,
      rowSeriesNumberWidth: 30,
      colSeriesNumberHeight: 30,
      rowSeriesNumberCellStyle:
        sheetDefine?.theme?.rowSeriesNumberCellStyle || options?.theme?.rowSeriesNumberCellStyle,
      colSeriesNumberCellStyle:
        sheetDefine?.theme?.colSeriesNumberCellStyle || options?.theme?.colSeriesNumberCellStyle,
      ...userPluginOptions
    });
    plugins.push(tableSeriesNumberPlugin);
  }
  // 这个插件有个bug 先不启用 #4447
  // if (!disabledPlugins?.some(module => module.module === HighlightHeaderWhenSelectCellPlugin)) {
  //   const userPluginOptions = enabledPlugins?.find(module => module.module === HighlightHeaderWhenSelectCellPlugin)
  //     ?.moduleOptions as IHighlightHeaderWhenSelectCellPluginOptions;
  //   const highlightHeaderWhenSelectCellPlugin = new HighlightHeaderWhenSelectCellPlugin({
  //     colHighlight: true,
  //     rowHighlight: true,
  //     ...userPluginOptions
  //   });
  //   plugins.push(highlightHeaderWhenSelectCellPlugin); // 这个插件有个bug 先不启用 #4447
  // }
  if (!disabledPlugins?.some(module => module.module === ContextMenuPlugin)) {
    const userPluginOptions = enabledPlugins?.find(module => module.module === ContextMenuPlugin)?.moduleOptions;
    const contextMenuPlugin = createContextMenuItems(sheetDefine, userPluginOptions);
    plugins.push(contextMenuPlugin);
  }
  if (!disabledPlugins?.some(module => module.module === ExcelEditCellKeyboardPlugin)) {
    const userPluginOptions = enabledPlugins?.find(
      module => module.module === ExcelEditCellKeyboardPlugin
    )?.moduleOptions;
    const excelEditCellKeyboardPlugin = new ExcelEditCellKeyboardPlugin(userPluginOptions);
    plugins.push(excelEditCellKeyboardPlugin);
  }
  if (!disabledPlugins?.some(module => module.module === AutoFillPlugin)) {
    // const userPluginOptions = enabledPlugins?.find(
    //   module => module.module === VTablePlugins.AutoFillPlugin
    // )?.moduleOptions;
    const autoFillPlugin = new AutoFillPlugin();
    plugins.push(autoFillPlugin);
  }
  if (options?.VTablePluginModules) {
    options.VTablePluginModules.forEach(
      (module: { module: new (options: any) => VTable.plugins.IVTablePlugin; moduleOptions: any }) => {
        if (typeof module?.module === 'function') {
          // 检查是否为构造函数
          plugins.push(new module.module(module.moduleOptions));
        } else {
          console.error(`Invalid plugin: ${module.module}`);
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
function createFilterPlugin(sheetDefine?: ISheetDefine, userPluginOptions?: FilterOptions): FilterPlugin | null {
  // // 对象配置
  // if (typeof sheetDefine.filter === 'object') {
  //   return new VTablePlugins.FilterPlugin({
  //     filterIcon: sheetDefine.filter.filterIcon,
  //     filteringIcon: sheetDefine.filter.filteringIcon,
  //     enableFilter: createColumnFilterChecker(sheetDefine),
  //     filterModes: sheetDefine.filter.filterModes
  //   });
  // }
  return new FilterPlugin({
    enableFilter: createColumnFilterChecker(sheetDefine),
    ...userPluginOptions
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

function createContextMenuItems(sheetDefine: ISheetDefine, userPluginOptions?: ContextMenuOptions) {
  return new ContextMenuPlugin({
    headerCellMenuItems: [
      ...DEFAULT_HEADER_MENU_ITEMS,
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
      ...DEFAULT_BODY_MENU_ITEMS,
      {
        text: '启用首行表头',
        menuKey: 'enable_first_row_as_header'
      }
    ],
    columnSeriesNumberMenuItems: [
      ...DEFAULT_COLUMN_SERIES_MENU_ITEMS,
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
      menuItems: MenuItemOrSeparator[],
      table: VTable.ListTable,
      col: number,
      row: number
    ) => {
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
      set_filter: (args: MenuClickEventArgs, table: VTable.ListTable) => {
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
      cancel_filter: (args: MenuClickEventArgs, table: VTable.ListTable) => {
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
      enable_first_row_as_header: (args: MenuClickEventArgs, table: VTable.ListTable) => {
        handleEnableFirstRowAsHeader(table);
      },
      disable_first_row_as_header: (args: MenuClickEventArgs, table: VTable.ListTable) => {
        handleDisableFirstRowAsHeader(table);
      }
    },
    ...userPluginOptions
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
