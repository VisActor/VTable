import * as VTable from '@visactor/vtable';
import type { DetailTableOptions, MasterDetailPluginOptions } from './types';

/**
 * 配置注入相关功能
 */
export class ConfigManager {
  private expandRowCallback?: (rowIndex: number) => void;

  constructor(private pluginOptions: MasterDetailPluginOptions, private table: VTable.ListTable) {}

  /**
   * 设置展开行的回调函数
   */
  setExpandRowCallback(callback: (rowIndex: number) => void): void {
    this.expandRowCallback = callback;
  }

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
    // 这个customComputeRowHeight用来保持展开行的高度
    options.customComputeRowHeight = params => {
      const { row, table } = params;
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
    // 禁用 _refreshHierarchyState 方法
    this.disableRefreshHierarchyState();
  }

  /**
   * 禁用VTable的_refreshHierarchyState方法
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
   * 处理记录的层级状态
   */
  private processRecordsHierarchyStates(records: unknown[]): void {
    const HierarchyState = VTable.TYPES.HierarchyState;
    const headerExpandLevel = this.table.options.headerExpandLevel;
    const processRecords = (recordList: unknown[]) => {
      recordList.forEach(record => {
        if (record && typeof record === 'object') {
          const recordObj = record as Record<string, unknown>;
          // 处理有子数据的记录
          if (this.hasChildren(record) || recordObj.children === true) {
            // 优先级：records 中的 hierarchyState > headerExpandLevel
            if (recordObj.hierarchyState === 'expand') {
              // 明确设置为展开
              recordObj.hierarchyState = HierarchyState.expand;
            } else if (recordObj.hierarchyState === 'collapse') {
              // 明确设置为收起
              recordObj.hierarchyState = HierarchyState.collapse;
            } else if (!recordObj.hierarchyState) {
              // 没有明确设置，根据 headerExpandLevel 决定
              if (headerExpandLevel && headerExpandLevel > 1) {
                recordObj.hierarchyState = HierarchyState.expand;
              } else {
                recordObj.hierarchyState = HierarchyState.collapse;
              }
            }
          }
        }
      });
    };
    processRecords(records);
    this.performInitialExpansion();
  }

  /**
   * 遍历所有记录，根据 hierarchyState 状态执行初始展开
   * 与VTable的异步CellGroup创建过程同步，在每个CellGroup创建后检查是否需要展开
   */
  private performInitialExpansion(): void {
    // 获取需要展开的记录索引列表
    const expandableRecords = this.getExpandableRecords();
    if (expandableRecords.length === 0) {
      return;
    }

    // 开始异步展开过程，与VTable的渲染频率同步
    this.startAsyncExpansion(expandableRecords);
  }

  /**
   * 获取所有需要展开的记录信息
   */
  private getExpandableRecords(): Array<{ recordIndex: number; actualRowIndex: number; record: unknown }> {
    const dataSource = this.table.dataSource as unknown as {
      source?: unknown[];
      _source?: unknown[];
      records: unknown[];
    };
    const allRecords = dataSource.source || dataSource._source || this.table.dataSource.records;
    const HierarchyState = VTable.TYPES.HierarchyState;
    const expandableRecords: Array<{ recordIndex: number; actualRowIndex: number; record: unknown }> = [];

    // 获取插件内部属性来访问 expandedRecordIndices
    const tableWithInternalProps = this.table as unknown as {
      internalProps: { expandedRecordIndices: number[] };
    };
    if (!tableWithInternalProps.internalProps.expandedRecordIndices) {
      tableWithInternalProps.internalProps.expandedRecordIndices = [];
    }
    const expandedRecordIndices = tableWithInternalProps.internalProps.expandedRecordIndices;

    // 遍历所有记录，收集需要展开的行
    for (let recordIndex = 0; recordIndex < allRecords.length; recordIndex++) {
      const record = allRecords[recordIndex];
      if (record && typeof record === 'object') {
        const recordObj = record as Record<string, unknown>;
        // 检查是否需要展开
        if (
          (this.hasChildren(record) || recordObj.children === true) &&
          recordObj.hierarchyState === HierarchyState.expand
        ) {
          // 将记录索引添加到 expandedRecordIndices 中
          if (!expandedRecordIndices.includes(recordIndex)) {
            expandedRecordIndices.push(recordIndex);
          }
          // 尝试获取行索引
          try {
            const bodyRowIndex = this.table.getBodyRowIndexByRecordIndex(recordIndex);
            if (bodyRowIndex >= 0) {
              const actualRowIndex = bodyRowIndex + this.table.columnHeaderLevelCount;
              expandableRecords.push({ recordIndex, actualRowIndex, record });
            }
          } catch (error) {
            // 记录可能不在当前页面中，跳过
          }
        }
      }
    }

    return expandableRecords;
  }

  /**
   * 开始异步展开过程，与VTable的异步渲染同步
   */
  private startAsyncExpansion(
    expandableRecords: Array<{ recordIndex: number; actualRowIndex: number; record: unknown }>
  ): void {
    let currentIndex = 0;

    const processNextExpansion = (): void => {
      if (currentIndex >= expandableRecords.length) {
        return; // 所有展开操作完成
      }

      const { actualRowIndex } = expandableRecords[currentIndex];
      // 检查该行的CellGroup是否已经创建
      if (this.isCellGroupCreated(actualRowIndex)) {
        // CellGroup已创建，立即执行展开
        if (this.expandRowCallback) {
          this.expandRowCallback(actualRowIndex);
        }
        currentIndex++;
        // 立即处理下一个，避免不必要的延迟
        setTimeout(processNextExpansion, 0);
      } else {
        // CellGroup尚未创建，等待16ms后再检查（与VTable的异步渲染频率同步）
        setTimeout(processNextExpansion, 16);
      }
    };
    // 启动异步展开过程
    setTimeout(processNextExpansion, 0);
  }

  /**
   * 检查指定行的CellGroup是否已经创建
   */
  private isCellGroupCreated(rowIndex: number): boolean {
    try {
      // 检查第一列的CellGroup是否存在且有效
      const cellGroup = this.table.scenegraph.getCell(0, rowIndex);
      return cellGroup && cellGroup.role === 'cell';
    } catch (error) {
      return false;
    }
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
