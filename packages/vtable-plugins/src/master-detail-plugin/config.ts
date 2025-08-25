import * as VTable from '@visactor/vtable';
import type { DetailGridOptions, MasterDetailPluginOptions, VirtualRecordIds } from './types';

/**
 * 配置注入相关功能
 */
export class ConfigManager {
  private virtualRecordIds: VirtualRecordIds | null = null;

  constructor(private pluginOptions: MasterDetailPluginOptions, private table: VTable.ListTable) {}

  /**
   * 获取记录的详情数据
   */
  getDetailData(record: unknown): unknown[] {
    if (this.pluginOptions.getDetailData) {
      return this.pluginOptions.getDetailData(record);
    }
    // 默认使用children字段
    if (record && typeof record === 'object' && 'children' in record) {
      return Array.isArray((record as any).children) ? (record as any).children : [];
    }
    return [];
  }

  /**
   * 检查记录是否有详情数据
   */
  hasDetailData(record: unknown): boolean {
    if (this.pluginOptions.hasDetailData) {
      return this.pluginOptions.hasDetailData(record);
    }
    // 默认检查children字段
    const detailData = this.getDetailData(record);
    return detailData.length > 0;
  }

  /**
   * 注入主从表配置到表格选项中
   */
  injectMasterDetailOptions(options: VTable.ListTableConstructorOptions): void {
    // 启用主从表基础设施
    (options as VTable.ListTableConstructorOptions & { masterDetail: boolean }).masterDetail = true;
    if (!options.customConfig) {
      options.customConfig = {};
    }
    options.customConfig.scrollEventAlwaysTrigger = true;
    const originalCustomComputeRowHeight = options.customComputeRowHeight;
    options.customComputeRowHeight = params => {
      const { row, table } = params;
      if (this.isVirtualRow(row)) {
        return 0;
      }
      if (this.isRowExpanded(row)) {
        const expandedHeight = table.getRowHeight(row);
        // 确保返回值符合 customComputeRowHeight 的类型要求
        if (Array.isArray(expandedHeight)) {
          return expandedHeight[0] ?? 'auto';
        }
        return expandedHeight as number | 'auto';
      }
      if (originalCustomComputeRowHeight) {
        const userResult = originalCustomComputeRowHeight(params);
        if (userResult !== undefined && userResult !== null) {
          return userResult;
        }
      }
      // 优先使用表头/表体的用户配置的默认行高（如果存在）
      // 如果当前是表头行，优先使用 defaultHeaderRowHeight，其次回退到 defaultRowHeight
      // 否则使用 defaultRowHeight，最后回退到 'auto'
      const opts = options as VTable.ListTableConstructorOptions & Record<string, unknown>;
      const userDefaultRow = opts.defaultRowHeight;
      const userDefaultHeaderRow = opts.defaultHeaderRowHeight;
      const headerLevelCount = typeof table.columnHeaderLevelCount === 'number' ? table.columnHeaderLevelCount : 0;
      if (row < headerLevelCount) {
        // 表头行：优先使用 defaultHeaderRowHeight，然后 defaultRowHeight，最后 'auto'
        if (userDefaultHeaderRow !== undefined && userDefaultHeaderRow !== null) {
          return userDefaultHeaderRow;
        }
        if (userDefaultRow !== undefined && userDefaultRow !== null) {
          return userDefaultRow;
        }
        return 'auto';
      }
      // 表体行：使用 defaultRowHeight，最后 'auto'
      if (userDefaultRow !== undefined && userDefaultRow !== null) {
        return userDefaultRow;
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
  }

  /**
   * 拦截表格的refreshRowColCount方法来添加虚拟行
   */
  private interceptRefreshRowColCount(): void {
    const originalRefreshRowColCount = this.table.refreshRowColCount.bind(this.table);
    this.table.refreshRowColCount = () => {
      originalRefreshRowColCount();
      // 添加虚拟行
      this.addVirtualRows();
    };
  }

  /**
   * 添加虚拟行
   */
  private addVirtualRows(): void {
    const { layoutMap } = this.table.internalProps;
    if (!layoutMap) {
      return;
    }

    // 获取数据数量
    let dataCount = 0;
    if (this.table.pagination) {
      dataCount = this.table.dataSource?.currentPagerIndexedData?.length ?? 0;
    } else {
      dataCount = this.table.dataSource?.sourceLength ?? 0;
    }
    if (dataCount > 0) {
      const virtualRowsCount = 1;
      const originalRowCount = this.table.rowCount;
      this.table.rowCount = originalRowCount + virtualRowsCount;
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
    const virtualRowIndex =
      headerLevelCount + dataCount + layoutMap.hasAggregationOnBottomCount + layoutMap.hasAggregationOnTopCount;
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
   * 检查是否为分组标题行
   */
  private isGroupTitleRow(col: number, row: number): boolean {
    try {
      const record = this.table.getRecordByCell(col, row);
      // 分组标题行的特征：有vtableMergeName字段，且children是数组中包含实际数据对象
      if (record && typeof record === 'object' && 'vtableMergeName' in record) {
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
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
      // 检查是否有主从表的详情数据（非分组children）
      if (!record || !this.hasDetailData(record) || this.isGroupTitleRow(col, row)) {
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
            <path d="M4.64988 6.81235C4.38797 6.48497 4.62106 6 5.04031 6L10.9597 6C11.3789 6 11.612 6.48497 
             11.3501 6.81235L8.39043 10.512C8.19027 10.7622 7.80973 10.7622 7.60957 10.512L4.64988 
             6.81235Z" fill="#141414" fill-opacity="1"/>
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
          <path d="M5.81235 11.3501C5.48497 11.612 5 11.3789 5 10.9597L5 5.04031C5 4.62106 5.48497 
           4.38797 5.81235 4.64988L9.51196 7.60957C9.76216 7.80973 9.76216 8.19027 9.51196 8.39044L5.81235 
           11.3501Z" fill="#141414" fill-opacity="1"/>
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
