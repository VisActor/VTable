import type * as VTable from '@visactor/vtable';
import {
  FilterPlugin,
  AddRowColumnPlugin,
  TableSeriesNumber,
  HighlightHeaderWhenSelectCellPlugin,
  ContextMenuPlugin,
  ExcelEditCellKeyboardPlugin,
  ExcelEditCellKeyboardResponse,
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
import type { ISheetDefine, IColumnDefine, IVTableSheetOptions, SheetKeyboardShortcutPolicy } from '../ts-types';
import { isValid } from '@visactor/vutils';

/**
 * 获取表格插件列表
 * @param sheetDefine Sheet配置定义
 * @param options 配置选项
 * @param vtableSheet VTableSheet实例（可选，用于访问公式管理器）
 * @returns 插件数组
 */
export function getTablePlugins(
  sheetDefine?: ISheetDefine,
  options?: IVTableSheetOptions,
  vtableSheet?: any
): VTable.pluginsDefinition.IVTablePlugin[] {
  const plugins: VTable.pluginsDefinition.IVTablePlugin[] = [];
  // 结合options.VTablePluginModules，来判断是否禁用插件
  const disabledPluginsUserSetted = options?.VTablePluginModules?.filter(module => module.disabled);
  let enabledPluginsUserSetted = options?.VTablePluginModules?.filter(module => !module.disabled);

  const globalEditable = options?.editable;
  const sheetEditable = sheetDefine?.editable;
  const effectiveEditable = sheetEditable ?? (globalEditable ?? true);

  let effectiveKeyboardPolicy: SheetKeyboardShortcutPolicy | undefined;
  if (options?.keyboardShortcutPolicy || sheetDefine?.keyboardShortcutPolicy) {
    effectiveKeyboardPolicy = {
      ...(options?.keyboardShortcutPolicy as SheetKeyboardShortcutPolicy),
      ...(sheetDefine?.keyboardShortcutPolicy as SheetKeyboardShortcutPolicy)
    };
  }
  if (!disabledPluginsUserSetted?.some(module => module.module === FilterPlugin)) {
    const userPluginOptions = enabledPluginsUserSetted?.find(module => module.module === FilterPlugin)
      ?.moduleOptions as FilterOptions;
    const filterPlugin = createFilterPlugin(sheetDefine, userPluginOptions);
    if (filterPlugin) {
      plugins.push(filterPlugin);
    }
  }
  if (!disabledPluginsUserSetted?.some(module => module.module === AddRowColumnPlugin)) {
    const userPluginOptions = enabledPluginsUserSetted?.find(module => module.module === AddRowColumnPlugin)
      ?.moduleOptions as AddRowColumnOptions;

    // Safety check for AddRowColumnPlugin availability
    if (!AddRowColumnPlugin) {
      console.warn('AddRowColumnPlugin is not available in @visactor/vtable-plugins');
    } else {
      const addRowColumnPlugin = new AddRowColumnPlugin({
        addRowCallback: (row: number, tableInstance: VTable.ListTable) => {
          tableInstance.addRecord([], row - tableInstance.columnHeaderLevelCount);
        },
        ...userPluginOptions
      });
      plugins.push(addRowColumnPlugin);
    }
    //已经初始化过的插件，从enabledPluginsUserSetted中移除
    enabledPluginsUserSetted = enabledPluginsUserSetted?.filter(module => module.module !== AddRowColumnPlugin);
  }
  if (!disabledPluginsUserSetted?.some(module => module.module === TableSeriesNumber)) {
    const userPluginOptions = enabledPluginsUserSetted?.find(module => module.module === TableSeriesNumber)
      ?.moduleOptions as TableSeriesNumberOptions;

    // Safety check for TableSeriesNumber availability
    if (!TableSeriesNumber) {
      console.warn('TableSeriesNumber is not available in @visactor/vtable-plugins');
    } else {
      // 构建插件选项，包含dragOrder（即使类型定义中没有，插件实际支持）
      const pluginOptions: TableSeriesNumberOptions & { dragOrder?: any } = {
        rowCount: sheetDefine?.rowCount || 100,
        colCount: sheetDefine?.columnCount || 100,
        rowSeriesNumberWidth: 30,
        colSeriesNumberHeight: 30,
        rowSeriesNumberCellStyle:
          sheetDefine?.theme?.rowSeriesNumberCellStyle || options?.theme?.rowSeriesNumberCellStyle,
        colSeriesNumberCellStyle:
          sheetDefine?.theme?.colSeriesNumberCellStyle || options?.theme?.colSeriesNumberCellStyle,
        ...userPluginOptions
      };

      // 如果sheet定义中有dragOrder，添加到插件选项中
      if (sheetDefine?.dragOrder) {
        pluginOptions.dragOrder = sheetDefine.dragOrder;
      }

      const tableSeriesNumberPlugin = new TableSeriesNumber(pluginOptions);
      plugins.push(tableSeriesNumberPlugin);
    }
    //已经初始化过的插件，从enabledPluginsUserSetted中移除
    enabledPluginsUserSetted = enabledPluginsUserSetted?.filter(module => module.module !== TableSeriesNumber);
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
  if (!disabledPluginsUserSetted?.some(module => module.module === ContextMenuPlugin)) {
    const userPluginOptions = enabledPluginsUserSetted?.find(
      module => module.module === ContextMenuPlugin
    )?.moduleOptions;

    // Safety check for ContextMenuPlugin availability
    if (!ContextMenuPlugin) {
      console.warn('ContextMenuPlugin is not available in @visactor/vtable-plugins');
    } else {
      const contextMenuPlugin = createContextMenuItems(
        sheetDefine,
        userPluginOptions as ContextMenuOptions,
        effectiveEditable,
        effectiveKeyboardPolicy
      );
      plugins.push(contextMenuPlugin);
    }
    //已经初始化过的插件，从enabledPluginsUserSetted中移除
    enabledPluginsUserSetted = enabledPluginsUserSetted?.filter(module => module.module !== ContextMenuPlugin);
  }
  if (!disabledPluginsUserSetted?.some(module => module.module === ExcelEditCellKeyboardPlugin)) {
    const userPluginOptions =
      enabledPluginsUserSetted?.find(module => module.module === ExcelEditCellKeyboardPlugin)?.moduleOptions ?? {};

    // Safety check for ExcelEditCellKeyboardPlugin availability
    if (!ExcelEditCellKeyboardPlugin) {
      console.warn('ExcelEditCellKeyboardPlugin is not available in @visactor/vtable-plugins');
    } else {
      const excelEditCellKeyboardPlugin = new ExcelEditCellKeyboardPlugin(userPluginOptions);
      plugins.push(excelEditCellKeyboardPlugin);
    }
    //已经初始化过的插件，从enabledPluginsUserSetted中移除
    enabledPluginsUserSetted = enabledPluginsUserSetted?.filter(
      module => module.module !== ExcelEditCellKeyboardPlugin
    );
  }
  if (!disabledPluginsUserSetted?.some(module => module.module === AutoFillPlugin)) {
    const userPluginOptions = enabledPluginsUserSetted?.find(module => module.module === AutoFillPlugin)?.moduleOptions;

    // Safety check for AutoFillPlugin availability
    if (!AutoFillPlugin) {
      console.warn('AutoFillPlugin is not available in @visactor/vtable-plugins');
    } else {
      // Create formula detection functions that use vtable-sheet's formula engine
      const formulaDetectionOptions = createFormulaDetectionOptions(sheetDefine, options, vtableSheet);

      const autoFillPlugin = new AutoFillPlugin({
        ...userPluginOptions,
        ...formulaDetectionOptions
      });
      plugins.push(autoFillPlugin);
    }
    //已经初始化过的插件，从enabledPluginsUserSetted中移除
    enabledPluginsUserSetted = enabledPluginsUserSetted?.filter(module => module.module !== AutoFillPlugin);
  }
  if (enabledPluginsUserSetted?.length) {
    enabledPluginsUserSetted.forEach(
      (module: {
        module: new (options: unknown) => VTable.pluginsDefinition.IVTablePlugin;
        moduleOptions: unknown;
        disabled: boolean;
      }) => {
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

  // 检查 FilterPlugin 是否可用
  if (!FilterPlugin) {
    console.warn('FilterPlugin is not available in @visactor/vtable-plugins');
    return null;
  }

  // 构建插件选项，确保符合FilterOptions接口
  const pluginOptions: FilterOptions = {
    enableFilter: createColumnFilterChecker(sheetDefine),
    ...userPluginOptions
  };

  return new FilterPlugin(pluginOptions);
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

function createContextMenuItems(
  sheetDefine: ISheetDefine,
  userPluginOptions?: ContextMenuOptions,
  effectiveEditable?: boolean,
  policy?: SheetKeyboardShortcutPolicy
) {
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
      if (effectiveEditable === false) {
        const editKeys = new Set([
          'copy',
          'cut',
          'paste',
          'delete',
          'insert',
          'insert_row_above',
          'insert_row_below',
          'delete_row',
          'insert_column_left',
          'insert_column_right',
          'delete_column',
          'merge_cells',
          'unmerge_cells'
        ]);
        menuItems = menuItems.filter(item => {
          if (typeof item === 'string') {
            return true;
          }
          if (editKeys.has(item.menuKey as string) || editKeys.has(item.iconName as string)) {
            return false;
          }
          if (Array.isArray(item.children) && item.children.length) {
            item.children = item.children.filter(child => {
              if (typeof child === 'string') {
                return true;
              }
              return !editKeys.has(child.menuKey as string);
            });
          }
          return true;
        });
      } else if (policy) {
        menuItems = menuItems.map(item => {
          if (typeof item === 'string') {
            return item;
          }
          if (item.menuKey === 'copy' && policy.copySelected === false) {
            return { ...item, disabled: true };
          }
          if (item.menuKey === 'cut' && policy.cutSelected === false) {
            return { ...item, disabled: true };
          }
          if (item.menuKey === 'paste' && policy.pasteValueToCell === false) {
            return { ...item, disabled: true };
          }
          return item;
        });
      }
      if(menuItems.length===1&&menuItems[0]==='---'){
        menuItems=[];
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

/**
 * 创建公式检测选项，使用vtable-sheet的公式引擎
 */
function createFormulaDetectionOptions(sheetDefine?: ISheetDefine, options?: IVTableSheetOptions, vtableSheet?: any) {
  return {
    /**
     * 自定义公式检测函数 - 使用vtable-sheet的公式引擎判断是否为公式
     */
    isFormulaCell: (col: number, row: number, cellData: unknown, table: VTable.ListTable): boolean => {
      // 首先尝试使用vtable-sheet的公式管理器
      if (vtableSheet?.formulaManager) {
        try {
          const sheetName = (vtableSheet.sheetManager as any)?._activeSheetKey || 'Sheet1';
          return vtableSheet.formulaManager.isCellFormula({
            sheet: sheetName,
            row: row,
            col: col
          });
        } catch (error) {
          // 如果公式引擎调用失败，回退到表格级别的检测
        }
      }

      // 回退到简单检测：检查单元格值是否以=开头
      if (typeof cellData === 'string' && cellData.startsWith('=')) {
        return true;
      }

      // 检查单元格原始值（可能是计算后的值）
      const cellValue = table.getCellValue(col, row);
      return typeof cellValue === 'string' && cellValue.startsWith('=');
    },

    /**
     * 自定义公式获取函数 - 从vtable-sheet公式引擎获取公式字符串
     */
    getCellFormula: (col: number, row: number, cellData: unknown, table: VTable.ListTable): string | undefined => {
      // 首先尝试使用vtable-sheet的公式管理器
      if (vtableSheet?.formulaManager) {
        try {
          const sheetName = (vtableSheet.sheetManager as any)?._activeSheetKey || 'Sheet1';
          return vtableSheet.formulaManager.getCellFormula({
            sheet: sheetName,
            row: row,
            col: col
          });
        } catch (error) {
          // 如果公式引擎调用失败，回退到表格级别的检测
        }
      }

      // 回退到简单检测：如果单元格值以=开头，返回该值作为公式
      const cellValue = table.getCellValue(col, row);
      if (typeof cellValue === 'string' && cellValue.startsWith('=')) {
        return cellValue;
      }

      return undefined;
    },

    /**
     * 自定义公式设置函数 - 使用vtable-sheet公式引擎设置公式
     */
    setCellFormula: (col: number, row: number, formula: string, table: VTable.ListTable): void => {
      // 首先尝试使用vtable-sheet的公式管理器
      if (vtableSheet?.formulaManager) {
        try {
          const sheetName = (vtableSheet.sheetManager as any)?._activeSheetKey || 'Sheet1';
          vtableSheet.formulaManager.setCellContent(
            {
              sheet: sheetName,
              row: row,
              col: col
            },
            formula
          );
          return;
        } catch (error) {
          // 如果公式引擎调用失败，回退到表格级别的设置
        }
      }

      // 回退到直接设置单元格值
      table.changeCellValue(col, row, formula);
    }
  };
}
