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

    // 插入虚拟记录来处理视口限制问题
    this.injectVirtualRecords(options);

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
  }

  /**
   * 插入虚拟记录来解决视口限制问题
   */
  private injectVirtualRecords(options: VTable.ListTableConstructorOptions): void {
    if (!options.records || !Array.isArray(options.records)) {
      return;
    }
    const originalRecords = options.records;
    if (originalRecords.length === 0) {
      return;
    }
    const topId = `__vtable_virtual_top_${Date.now()}_${Math.random()}`;
    const bottomId = `__vtable_virtual_bottom_${Date.now()}_${Math.random()}`;
    this.virtualRecordIds = { topId, bottomId };
    const minRecord = this.createVirtualRecord(originalRecords, 'top', topId);
    const maxRecord = this.createVirtualRecord(originalRecords, 'bottom', bottomId);
    options.records = [minRecord, ...originalRecords, maxRecord];
  }

  /**
   * 创建虚拟记录
   */
  private createVirtualRecord(
    originalRecords: Record<string, unknown>[],
    type: 'top' | 'bottom',
    virtualId: string
  ): Record<string, unknown> {
    const record: Record<string, unknown> = {};
    // 获取第一个记录的所有字段，为每个字段设置空值
    if (originalRecords.length > 0) {
      const firstRecord = originalRecords[0];
      Object.keys(firstRecord).forEach(fieldName => {
        record[fieldName] = ' ';
      });
    }
    record.children = undefined;
    // 标记为虚拟记录并设置唯一ID
    record.__vtable_virtual_record__ = true;
    record.__vtable_virtual_id__ = virtualId;
    return record;
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
  setupVirtualRecordRowHeight(): void {
    const firstDataRowIndex = this.table.columnHeaderLevelCount;
    const lastDataRowIndex = this.table.rowCount - this.table.bottomFrozenRowCount - 1;
    try {
      if (typeof this.table.setRowHeight === 'function') {
        const visibleRange = this.table.getBodyVisibleRowRange();
        this.table.setRowHeight(firstDataRowIndex, 0);
        if (visibleRange && lastDataRowIndex >= visibleRange.rowStart && lastDataRowIndex <= visibleRange.rowEnd) {
          this.table.setRowHeight(lastDataRowIndex, 0);
        } else {
          this.table._setRowHeight(lastDataRowIndex, 0, true);
        }
      }
    } catch (error) {
      console.warn('Failed to set virtual record row height:', error);
    }
  }

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
