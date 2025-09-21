import * as VTable from '@visactor/vtable';
import type { DetailTableOptions, MasterDetailPluginOptions, VirtualRecordIds, LazyLoadState } from './types';

/**
 * 配置注入相关功能
 */
export class ConfigManager {
  private virtualRecordIds: VirtualRecordIds | null = null;
  private lazyLoadingStates: Map<number, LazyLoadState> = new Map();

  constructor(private pluginOptions: MasterDetailPluginOptions, private table: VTable.ListTable) {
    // 注册loading图标（如果配置了懒加载回调）
    if (this.pluginOptions.onLazyLoad) {
      this.registerLoadingIcon();
    }
  }

  /**
   * 注册loading图标
   */
  private registerLoadingIcon(): void {
    const iconConfig = this.pluginOptions.lazyLoadingIcon || {};
    const gifUrl =
      iconConfig.src || 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/loading-circle.gif';

    VTable.register.icon('master-detail-loading', {
      type: 'image',
      width: iconConfig.width || 16,
      height: iconConfig.height || 16,
      src: gifUrl,
      gif: gifUrl, // 添加gif属性启用动画
      isGif: true, // 标记为GIF图标
      name: 'master-detail-loading',
      positionType: VTable.TYPES.IconPosition.contentLeft,
      marginLeft: 0,
      marginRight: 4,
      visibleTime: 'always',
      hover: {
        width: 20,
        height: 20,
        bgColor: 'rgba(101,117,168,0.1)'
      }
    } as VTable.TYPES.ImageIcon & { gif: string; isGif: boolean }); // 扩展类型定义
  }

  /**
   * 检查记录是否为懒加载节点
   */
  isLazyLoadRecord(record: unknown): boolean {
    // 只有配置了懒加载回调函数才启用懒加载功能
    if (!this.pluginOptions.onLazyLoad) {
      return false;
    }
    return record && typeof record === 'object' && 'children' in record && record.children === true;
  }

  /**
   * 获取懒加载状态
   */
  getLazyLoadingState(bodyRowIndex: number): LazyLoadState | undefined {
    return this.lazyLoadingStates.get(bodyRowIndex);
  }

  /**
   * 设置懒加载状态
   */
  setLazyLoadingState(bodyRowIndex: number, state: LazyLoadState): void {
    this.lazyLoadingStates.set(bodyRowIndex, state);
  }

  /**
   * 创建loading图标配置
   */
  private createLoadingIcon(): VTable.TYPES.ImageIcon & { gif: string; isGif: boolean } {
    const iconConfig = this.pluginOptions.lazyLoadingIcon || {};
    const gifUrl =
      iconConfig.src || 'https://lf9-dp-fe-cms-tos.byteorg.com/obj/bit-cloud/VTable/media/loading-circle.gif';
    return {
      type: 'image',
      width: iconConfig.width || 16,
      height: iconConfig.height || 16,
      src: gifUrl,
      gif: gifUrl, // 添加gif属性启用动画
      isGif: true, // 标记为GIF图标
      name: 'master-detail-loading',
      positionType: VTable.TYPES.IconPosition.contentLeft,
      marginLeft: 0,
      marginRight: 4,
      cursor: 'default'
    };
  }

  /**
   * 创建展开图标配置
   */
  private createExpandIcon(): VTable.TYPES.SvgIcon {
    return {
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
      cursor: 'pointer',
      visibleTime: 'always',
      hover: {
        width: 20,
        height: 20,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      }
    } as VTable.TYPES.SvgIcon;
  }

  /**
   * 创建收起图标配置
   */
  private createCollapseIcon(): VTable.TYPES.SvgIcon {
    return {
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
      cursor: 'pointer',
      visibleTime: 'always',
      hover: {
        width: 20,
        height: 20,
        bgColor: 'rgba(101, 117, 168, 0.1)'
      }
    } as VTable.TYPES.SvgIcon;
  }

  /**
   * 创建占位图标配置
   */
  private createPlaceholderIcon(): VTable.TYPES.SvgIcon {
    return {
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
    } as VTable.TYPES.SvgIcon;
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

    // 给第一列添加图标
    this.injectHierarchyIcons(options);

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
   * 给第一列添加层级图标
   * 为有子数据的行添加展开/收起图标，无子数据的行添加占位图标保持对齐
   */
  private injectHierarchyIcons(options: VTable.ListTableConstructorOptions): void {
    if (!options.columns || options.columns.length === 0) {
      return;
    }

    // 获取第一列，用于添加展开/收起图标
    const firstColumn = options.columns[0] as VTable.TYPES.ColumnDefine;

    // 创建图标函数
    const iconFunction = (args: VTable.TYPES.CellInfo & { table: VTable.BaseTableAPI }) => {
      const { col, row } = args;
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

      if (!record) {
        return [this.createPlaceholderIcon()];
      }

      // 检查是否为懒加载节点
      if (this.isLazyLoadRecord(record)) {
        const bodyRowIndex = row - this.table.columnHeaderLevelCount;
        const loadingState = this.getLazyLoadingState(bodyRowIndex);
        if (loadingState === 'loading') {
          return [this.createLoadingIcon()];
        }
        const isExpanded = this.isRowExpanded(row);
        return isExpanded ? [this.createCollapseIcon()] : [this.createExpandIcon()];
      }

      // 检查是否有实际children数据
      if (!this.hasChildren(record)) {
        return [this.createPlaceholderIcon()];
      }

      const isExpanded = this.isRowExpanded(row);
      return isExpanded ? [this.createCollapseIcon()] : [this.createExpandIcon()];
    };

    // 设置第一列的图标
    firstColumn.icon = iconFunction;
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

  /**
   * 释放所有资源和引用
   */
  release(): void {
    this.virtualRecordIds = null;
    this.isRowExpanded = () => false;
    // 清理懒加载状态
    this.lazyLoadingStates.clear();
    // 清理对表格的引用
    (this as unknown as { table: VTable.ListTable | null }).table = null;
    (this as unknown as { pluginOptions: MasterDetailPluginOptions | null }).pluginOptions = null;
  }
}
