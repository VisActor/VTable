import * as VTable from '@visactor/vtable';
import type { DetailTableOptions, MasterDetailPluginOptions } from './types';

/**
 * 配置注入相关功能
 */
export class ConfigManager {
  constructor(private pluginOptions: MasterDetailPluginOptions, private table: VTable.ListTable) {}

  /**
   * 检查记录是否有子数据
   */
  private hasChildren(record: unknown): boolean {
    if (record && typeof record === 'object' && 'children' in record) {
      const children = record.children;
      return Array.isArray(children) && children.length > 0;
    }
    return false;
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
    // 确保滚动事件始终触发，用于子表位置同步
    options.customConfig.scrollEventAlwaysTrigger = true;
    const originalCustomComputeRowHeight = options.customComputeRowHeight;
    options.customComputeRowHeight = params => {
      const { row, table } = params;
      if (this.isVirtualRow(row)) {
        return 0;
      }
      if (this.isRowExpanded(row)) {
        const expandedHeight = table.getRowHeight(row);
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

    // 设置第一列为树形结构，是为什么方便getHierarchyState等的判断，他们需要有tree的配置，这不会导致主从表变为tree的状态，因为在_setRecords的时候会直接强制设置为grid
    if (options.columns && options.columns.length > 0) {
      const firstColumn = options.columns[0] as VTable.TYPES.ColumnDefine;
      firstColumn.tree = true;
    }

    // 监听表格初始化完成事件，设置图标
    this.setupInitializedListener();

    // 注入子表配置
    if (this.pluginOptions.detailTableOptions) {
      const detailOptions = this.pluginOptions.detailTableOptions;
      // 判断是静态配置还是动态函数
      if (typeof detailOptions === 'function') {
        // 动态配置：根据数据和行索引返回不同的子表配置
        (
          options as VTable.ListTableConstructorOptions & {
            getDetailGridOptions: (params: { data: unknown; bodyRowIndex: number }) => DetailTableOptions;
          }
        ).getDetailGridOptions = detailOptions;
      } else {
        // 静态配置：所有子表使用相同配置
        (
          options as VTable.ListTableConstructorOptions & { detailTableOptions: DetailTableOptions }
        ).detailTableOptions = detailOptions;
      }
    }

    // 拦截表格的refreshRowColCount方法来添加虚拟行
    this.interceptRefreshRowColCount();

    // 禁用 _refreshHierarchyState 方法
    this.disableRefreshHierarchyState();
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
   * 在表格底部添加一行虚拟行，用于展开子表时处理setBodyAndRowHeaderY的lastBodyCell.attribute.height的问题
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
   * 禁用VTable的_refreshHierarchyState方法
   * 在主从表场景下，我们需要自己控制层级状态，避免VTable的自动刷新机制干扰
   */
  private disableRefreshHierarchyState(): void {
    // 延迟执行，确保表格已经创建完成
    setTimeout(() => {
      const tableWithPrivateMethod = this.table as unknown as {
        _refreshHierarchyState?: () => void;
        _originalRefreshHierarchyState?: () => void;
      };
      if (tableWithPrivateMethod && typeof tableWithPrivateMethod._refreshHierarchyState === 'function') {
        tableWithPrivateMethod._originalRefreshHierarchyState = tableWithPrivateMethod._refreshHierarchyState;
        tableWithPrivateMethod._refreshHierarchyState = () => {
          // 禁用_refreshHierarchyState函数
        };
      }
    }, 0);
  }

  /**
   * 处理图标的显示
   */
  private setupInitializedListener(): void {
    // 监听表格初始化完成事件
    this.table.on('initialized', () => {
      const records = this.table.dataSource.records;
      this.processRecordsHierarchyStates(records);
      this.table.renderWithRecreateCells();
    });
  }

  /**
   * 处理图标的显示
   */
  private processRecordsHierarchyStates(records: unknown[]): void {
    const HierarchyState = VTable.TYPES.HierarchyState;
    const processRecords = (recordList: unknown[]) => {
      recordList.forEach(record => {
        if (record && typeof record === 'object') {
          const recordObj = record as Record<string, unknown>;
          // 处理普通的有子数据的记录
          if (this.hasChildren(record)) {
            recordObj.hierarchyState = HierarchyState.collapse;
          } else if (recordObj.children === true) {
            recordObj.hierarchyState = HierarchyState.collapse;
          }
        }
      });
    };
    processRecords(records);
  }

  /**
   * 获取详情配置
   */
  getDetailConfigForRecord(record: unknown, bodyRowIndex: number): DetailTableOptions | null {
    const detailOptions = this.pluginOptions.detailTableOptions;
    if (!detailOptions) {
      return null;
    }
    // 判断是函数还是静态配置
    if (typeof detailOptions === 'function') {
      return detailOptions({ data: record, bodyRowIndex: bodyRowIndex });
    }
    return detailOptions;
  }

  private isRowExpanded: (row: number) => boolean = () => false;

  /**
   * 设置行展开状态检查函数
   */
  setRowExpandedChecker(checker: (row: number) => boolean): void {
    this.isRowExpanded = checker;
  }

  /**
   * 释放所有资源和引用
   */
  release(): void {
    this.isRowExpanded = () => false;
    // 清理对表格的引用
    (this as unknown as { table: VTable.ListTable | null }).table = null;
    (this as unknown as { pluginOptions: MasterDetailPluginOptions | null }).pluginOptions = null;
  }
}
