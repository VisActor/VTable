import * as VTable from '@visactor/vtable';
import type { DetailGridOptions, MasterDetailPluginOptions, VirtualRecordIds } from './types';

/**
 * 配置注入相关功能
 */
export class ConfigManager {
  private virtualRecordIds: VirtualRecordIds | null = null;

  constructor(private pluginOptions: MasterDetailPluginOptions, private table: VTable.ListTable) {}

  /**
   * 注入主从表配置到表格选项中
   */
  injectMasterDetailOptions(options: VTable.ListTableConstructorOptions): void {
    // 启用主从表基础设施
    (options as VTable.ListTableConstructorOptions & { masterDetail: boolean }).masterDetail = true;

    // 确保滚动事件始终触发，以便can_scroll事件能在边界情况下正常工作
    if (!options.customConfig) {
      options.customConfig = {};
    }
    options.customConfig.scrollEventAlwaysTrigger = true;
    const originalCustomComputeRowHeight = options.customComputeRowHeight;
    // 配置自定义行高计算，让虚拟行高度为0，同时保持展开行的高度
    options.customComputeRowHeight = params => {
      const { row, table } = params;
      if (this.isVirtualRow(row)) {
        return 0;
      }
      if (this.isRowExpanded(row)) {
        return table.getRowHeight(row);
      }
      if (originalCustomComputeRowHeight) {
        const userResult = originalCustomComputeRowHeight(params);
        if (userResult !== undefined && userResult !== null) {
          return userResult;
        }
      }
      return 'auto';
    };

    // 给第一列添加图标
    this.injectHierarchyIcons(options);

    // 注入子表配置
    if (this.pluginOptions.detailGridOptions) {
      const detailOptions = this.pluginOptions.detailGridOptions;
      // 判断是静态配置还是动态函数
      if (typeof detailOptions === 'function') {
        (
          options as VTable.ListTableConstructorOptions & {
            getDetailGridOptions: (params: { data: unknown; bodyRowIndex: number }) => DetailGridOptions;
          }
        ).getDetailGridOptions = detailOptions;
      } else {
        (options as VTable.ListTableConstructorOptions & { detailGridOptions: DetailGridOptions }).detailGridOptions =
          detailOptions;
      }
    }

    // 拦截表格的refreshRowColCount方法来添加虚拟行
    this.interceptRefreshRowColCount();

    // 拦截表格的getCellValue方法来处理虚拟行显示
    this.interceptGetCellValue();
  }

  /**
   * 拦截表格的getCellValue方法来处理虚拟行显示
   */
  private interceptGetCellValue(): void {
    const originalGetCellValue = this.table.getCellValue.bind(this.table);
    this.table.getCellValue = (col: number, row: number, skipCustomMerge?: boolean) => {
      // 检查是否为虚拟行
      if (this.isVirtualRow(row)) {
        // 如果虚拟行同时是聚合行，优先使用聚合逻辑
        const layoutMap = this.table.internalProps?.layoutMap;
        if (layoutMap && typeof layoutMap.isAggregation === 'function' && layoutMap.isAggregation(col, row)) {
          return originalGetCellValue(col, row, skipCustomMerge);
        }
        return this.getVirtualRowCellValue(col, row);
      }
      // 如果不是虚拟行，调用原始方法
      return originalGetCellValue(col, row, skipCustomMerge);
    };
  }

  /**
   * 获取虚拟行的单元格值
   */
  private getVirtualRowCellValue(col: number, row: number): string {
    const virtualRowType = this.getVirtualRowType(row);
    if (virtualRowType === 'bottom') {
      // 根据是否有分页显示不同的消息
      if (this.table.pagination) {
        return col === 0 ? '当前页结束' : '';
      }
      return col === 0 ? '数据结束' : '';
    }
    return '';
  }

  /**
   * 拦截表格的refreshRowColCount方法来添加虚拟行
   */
  private interceptRefreshRowColCount(): void {
    const originalRefreshRowColCount = this.table.refreshRowColCount.bind(this.table);
    this.table.refreshRowColCount = () => {
      // 先执行原始的refreshRowColCount
      originalRefreshRowColCount();
      // 总是添加虚拟行，不管是否有分页
      this.addVirtualRows();
    };
  }

  /**
   * 添加虚拟行（在有分页和无分页情况下都添加）
   */
  private addVirtualRows(): void {
    const { layoutMap } = this.table.internalProps;
    if (!layoutMap) {
      return;
    }

    // 获取数据数量（分页情况下取当前页数据，非分页情况下取全部数据）
    let dataCount = 0;
    if (this.table.pagination) {
      dataCount = this.table.dataSource?.currentPagerIndexedData?.length ?? 0;
    } else {
      dataCount = this.table.dataSource?.sourceLength ?? 0;
    }
    
    // 只有有数据时才添加虚拟行
    if (dataCount > 0) {
      // 检查是否有底部聚合行
      const hasBottomAggregation = layoutMap.hasAggregationOnBottomCount > 0;
      
      // 只添加1个底部虚拟行
      const virtualRowsCount = 1;
      
      // 不修改 layoutMap.recordsCount，只修改 table.rowCount
      const originalRowCount = this.table.rowCount;
      
      if (hasBottomAggregation) {
        // 如果有聚合行，虚拟行应该添加在聚合行之后，避免冲突
        this.table.rowCount = originalRowCount + virtualRowsCount;
      } else {
        // 如果没有聚合行，正常添加虚拟行
        this.table.rowCount = originalRowCount + virtualRowsCount;
      }
      
      // 注意：现在通过 customComputeRowHeight 自动设置虚拟行高度为0
    }
  }

  /**
   * 检查指定行是否为虚拟行
   */
  isVirtualRow(row: number): boolean {
    const { layoutMap } = this.table.internalProps;
    if (!layoutMap) {
      return false;
    }

    const headerLevelCount = layoutMap.headerLevelCount;
    // 获取数据数量（分页情况下取当前页数据，非分页情况下取全部数据）
    let dataCount = 0;
    if (this.table.pagination) {
      dataCount = this.table.dataSource?.currentPagerIndexedData?.length ?? 0;
    } else {
      dataCount = this.table.dataSource?.sourceLength ?? 0;
    }
    if (dataCount === 0) {
      return false;
    }

    // 检查是否有底部聚合行
    const hasBottomAggregation = layoutMap.hasAggregationOnBottomCount > 0;
    
    if (hasBottomAggregation) {
      // 如果有聚合行，虚拟行位置在聚合行之后
      const aggregationRowIndex = headerLevelCount + dataCount;
      const virtualRowIndex = aggregationRowIndex + layoutMap.hasAggregationOnBottomCount;
      return row === virtualRowIndex;
    }
    
    // 如果没有聚合行，虚拟行位置在数据行之后
    const virtualRowIndex = headerLevelCount + dataCount;
    return row === virtualRowIndex;
  }

  /**
   * 获取虚拟行的类型
   */
  getVirtualRowType(row: number): 'bottom' | null {
    if (!this.isVirtualRow(row)) {
      return null;
    }

    // 现在只有一个底部虚拟行
    return 'bottom';
  }

  /**
   * 给第一列添加层级图标
   */
  private injectHierarchyIcons(options: VTable.ListTableConstructorOptions): void {
    if (!options.columns || options.columns.length === 0) {
      return;
    }

    // 获取第一列
    const firstColumn = options.columns[0] as any;

    // 创建图标函数
    const iconFunction = (params: {
      col: number;
      row: number;
      dataValue: unknown;
      cellValue: unknown;
    }): VTable.TYPES.SvgIcon[] => {
      const { col, row } = params;
      // 获取记录
      let record: unknown;
      try {
        const recordIndex = this.table.getRecordShowIndexByCell(col, row);
        if (recordIndex !== undefined) {
          record = this.table.getRecordByCell(col, row);
        }
      } catch (error) {
        return [];
      }
      // 检查是否有children
      if (!record || !Array.isArray((record as any).children) || (record as any).children.length === 0) {
        return [
          {
            type: 'svg',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <!-- 透明占位图标，用于保持对齐 -->
            </svg>`,
            width: 16,
            height: 16,
            name: 'hierarchy-placeholder',
            positionType: VTable.TYPES.IconPosition.contentLeft,
            marginLeft: 0,
            marginRight: 4,
            cursor: 'default'
          } as VTable.TYPES.SvgIcon
        ];
      }

      const isExpanded = this.isRowExpanded(row);

      // 返回对应的图标配置
      if (isExpanded) {
        return [
          {
            type: 'svg',
            svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 6.81235Z" fill="#141414" fill-opacity="1"/>
          </svg>`,
            width: 16,
            height: 16,
            name: 'hierarchy-collapse',
            positionType: VTable.TYPES.IconPosition.contentLeft,
            marginLeft: 0,
            marginRight: 4,
            funcType: VTable.TYPES.IconFuncTypeEnum.collapse,
            cursor: 'pointer',
            hover: {
              width: 20,
              height: 20,
              bgColor: 'rgba(101, 117, 168, 0.1)'
            }
          } as VTable.TYPES.SvgIcon
        ];
      }
      return [
        {
          type: 'svg',
          svg: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 11.3501Z" fill="#141414" fill-opacity="1"/>
        </svg>`,
          width: 16,
          height: 16,
          name: 'hierarchy-expand',
          positionType: VTable.TYPES.IconPosition.contentLeft,
          marginLeft: 0,
          marginRight: 4,
          funcType: VTable.TYPES.IconFuncTypeEnum.expand,
          cursor: 'pointer',
          hover: {
            width: 20,
            height: 20,
            bgColor: 'rgba(101, 117, 168, 0.1)'
          }
        } as VTable.TYPES.SvgIcon
      ];
    };

    // 设置第一列的图标
    firstColumn.icon = iconFunction;
  }

  /**
   * 设置虚拟记录行高
   */
  /**
   * 获取详情配置
   */
  getDetailConfigForRecord(record: unknown, bodyRowIndex: number): DetailGridOptions | null {
    const detailOptions = this.pluginOptions.detailGridOptions;
    if (!detailOptions) {
      return null;
    }
    
    // 判断是函数还是静态配置
    if (typeof detailOptions === 'function') {
      return detailOptions({ data: record, bodyRowIndex: bodyRowIndex });
    }
    
    return detailOptions;
  }

  /**
   * 获取虚拟记录ID
   */
  getVirtualRecordIds(): VirtualRecordIds | null {
    return this.virtualRecordIds;
  }

  private isRowExpanded: (row: number) => boolean = () => false;

  /**
   * 设置行展开状态检查函数
   */
  setRowExpandedChecker(checker: (row: number) => boolean): void {
    this.isRowExpanded = checker;
  }
}
