import type {
  FieldData,
  FieldDef,
  FieldFormat,
  PivotTableAPI,
  SortRules,
  PivotSortState,
  CellAddress,
  ICellHeaderPaths,
  DropDownMenuEventInfo,
  FieldKeyDef,
  PivotTableConstructorOptions,
  IHeaderTreeDefine,
  IDimensionInfo,
  SortOrder,
  IPagination,
  CellLocation,
  IIndicator
} from './ts-types';
import { HierarchyState } from './ts-types';
import { PivotHeaderLayoutMap } from './layout/pivot-header-layout';
import { FlatDataToObjects } from './dataset/flatDataToObject';
import { PIVOT_TABLE_EVENT_TYPE } from './ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';
import { cellInRange, emptyFn } from './tools/helper';
import { Dataset } from './dataset/dataset';
import { BaseTable } from './core/BaseTable';
import type { BaseTableAPI, PivotTableProtected } from './ts-types/base-table';
import { Title } from './components/title/title';
import { cloneDeep } from '@visactor/vutils';
import { Env } from './tools/env';
import type { LayouTreeNode } from './layout/tree-helper';
import { TABLE_EVENT_TYPE } from './core/TABLE_EVENT_TYPE';
import { EditManeger } from './edit/edit-manager';
import * as editors from './edit/editors';
import type { IEditor } from '@visactor/vtable-editors';
import { computeColWidth } from './scenegraph/layout/compute-col-width';
import { computeRowHeight } from './scenegraph/layout/compute-row-height';
import { isAllDigits } from './tools/util';
export class PivotTable extends BaseTable implements PivotTableAPI {
  declare internalProps: PivotTableProtected;
  declare options: PivotTableConstructorOptions;
  pivotSortState: PivotSortState[];
  editorManager: EditManeger;
  dataset?: Dataset; //数据处理对象  开启数据透视分析的表
  flatDataToObjects?: FlatDataToObjects; //数据处理对象 聚合后的flat数据 转成便于查询的行列二维数组
  // drillMenu: Menu; //上卷下钻的按钮
  // eslint-disable-next-line default-param-last
  constructor(options: PivotTableConstructorOptions);
  constructor(container: HTMLElement, options: PivotTableConstructorOptions);
  constructor(container?: HTMLElement | PivotTableConstructorOptions, options?: PivotTableConstructorOptions) {
    if (Env.mode === 'node') {
      options = container as PivotTableConstructorOptions;
      container = null;
    } else if (!(container instanceof HTMLElement)) {
      options = container as PivotTableConstructorOptions;
      if ((container as PivotTableConstructorOptions).container) {
        container = (container as PivotTableConstructorOptions).container;
      } else {
        container = null;
      }
    }
    super(container as HTMLElement, options);
    if ((options as any).layout) {
      //TODO hack处理之前的demo都是定义到layout上的 所以这里直接并到options中
      Object.assign(options, (options as any).layout);
    }
    this.internalProps.columns = cloneDeep(options.columns);
    this.internalProps.rows = cloneDeep(options.rows);
    this.internalProps.indicators = cloneDeep(options.indicators);
    options.indicators?.forEach((indicatorDefine, index) => {
      //如果editor 是一个IEditor的实例  需要这样重新赋值 否则clone后变质了
      if (typeof indicatorDefine === 'object' && indicatorDefine?.editor) {
        (this.internalProps.indicators[index] as IIndicator).editor = indicatorDefine.editor;
      }
    });
    this.internalProps.columnTree =
      options.indicatorsAsCol && !options.columns?.length && !options.columnTree ? [] : cloneDeep(options.columnTree);
    this.internalProps.rowTree =
      !options.indicatorsAsCol && !options.rows?.length && !options.rowTree ? [] : cloneDeep(options.rowTree);
    this.internalProps.records = options.records;

    //分页配置
    this.pagination = options.pagination;
    this.internalProps.columnResizeType = options.columnResizeType ?? 'column';
    this.internalProps.dataConfig = cloneDeep(options.dataConfig);

    // this.internalProps.enableDataAnalysis = options.enableDataAnalysis;
    if (!options.rowTree && !options.columnTree) {
      this.internalProps.enableDataAnalysis = true;
    } else {
      this.internalProps.enableDataAnalysis = false;
    }
    const records = this.internalProps.records;
    if (this.internalProps.enableDataAnalysis && (options.rows || options.columns)) {
      const rowKeys =
        options.rows?.reduce((keys, rowObj) => {
          if (typeof rowObj === 'string') {
            keys.push(rowObj);
          } else {
            keys.push(rowObj.dimensionKey);
          }
          return keys;
        }, []) ?? [];
      const columnKeys =
        options.columns?.reduce((keys, columnObj) => {
          if (typeof columnObj === 'string') {
            keys.push(columnObj);
          } else {
            keys.push(columnObj.dimensionKey);
          }
          return keys;
        }, []) ?? [];
      const indicatorKeys =
        options.indicators?.reduce((keys, indicatorObj) => {
          if (typeof indicatorObj === 'string') {
            keys.push(indicatorObj);
          } else {
            keys.push(indicatorObj.indicatorKey);
          }
          return keys;
        }, []) ?? [];
      this.dataset = new Dataset(
        this.internalProps.dataConfig,
        // this.pagination,
        rowKeys,
        columnKeys,
        // options.indicatorsAsCol === false ? rowKeys.concat(IndicatorDimensionKeyPlaceholder) : rowKeys,
        // options.indicatorsAsCol !== false ? columnKeys.concat(IndicatorDimensionKeyPlaceholder) : columnKeys,
        indicatorKeys,
        this.internalProps.indicators,
        options.indicatorsAsCol ?? true,
        options.records,
        options.rowHierarchyType,
        this.internalProps.columnTree, //传递自定义树形结构会在dataset中补充指标节点children
        this.internalProps.rowTree
      );
      this.internalProps.layoutMap = new PivotHeaderLayoutMap(this, this.dataset);
    } else if (Array.isArray(this.internalProps.columnTree) || Array.isArray(this.internalProps.rowTree)) {
      this.internalProps.layoutMap = new PivotHeaderLayoutMap(this, null);
      //判断如果数据是二维数组 则标识已经分析过 直接从二维数组挨个读取渲染即可
      //不是二维数组 对应是个object json对象 则表示flat数据，需要对应行列维度进行转成方便数据查询的行列树结构
      if (records?.[0]?.constructor !== Array) {
        this.flatDataToObjects = new FlatDataToObjects(
          {
            rows: this.internalProps.layoutMap.fullRowDimensionKeys,
            columns: this.internalProps.layoutMap.colDimensionKeys,
            indicators: this.internalProps.layoutMap.indicatorKeys,
            indicatorsAsCol: this.internalProps.layoutMap.indicatorsAsCol,
            indicatorDimensionKey: this.internalProps.layoutMap.indicatorDimensionKey
          },
          records
        );
      }
    } else {
      console.warn('VTable Warn: your option is invalid, please check it!');
      return;
    }
    this.pivotSortState = [];
    if (options.pivotSortState) {
      this.updatePivotSortState(options.pivotSortState);
    }
    if (Env.mode !== 'node') {
      this.editorManager = new EditManeger(this);
    }
    this.refreshHeader();
    this.stateManager.initCheckedState(records);
    // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;
    // 生成单元格场景树
    this.scenegraph.createSceneGraph();
    // this.render();

    if (options.title) {
      this.internalProps.title = new Title(options.title, this);
      this.scenegraph.resize();
    }
    //为了确保用户监听得到这个事件 这里做了异步 确保vtable实例已经初始化完成
    setTimeout(() => {
      this.fireListeners(TABLE_EVENT_TYPE.INITIALIZED, null);
    }, 0);
  }
  static get EVENT_TYPE(): typeof PIVOT_TABLE_EVENT_TYPE {
    return PIVOT_TABLE_EVENT_TYPE;
  }
  isListTable(): false {
    return false;
  }
  isPivotTable(): true {
    return true;
  }
  isPivotChart(): false {
    return false;
  }
  get recordsCount() {
    return this.records?.length;
  }
  _canResizeColumn(col: number, row: number): boolean {
    const ifCan = super._canResizeColumn(col, row);
    if (ifCan) {
      if (!this.internalProps.layoutMap.indicatorsAsCol) {
        // 列上是否配置了禁止拖拽列宽的配置项disableColumnResize
        const cellDefine = this.internalProps.layoutMap.getBody(col, this.columnHeaderLevelCount);
        if (cellDefine?.disableColumnResize) {
          return false;
        }
      }
    }
    return ifCan;
  }
  updateOption(options: PivotTableConstructorOptions) {
    const internalProps = this.internalProps;
    //维护选中状态
    // const range = internalProps.selection.range; //保留原有单元格选中状态
    super.updateOption(options);
    this.internalProps.columns = cloneDeep(options.columns);
    this.internalProps.rows = cloneDeep(options.rows);
    this.internalProps.indicators = !options.indicators?.length ? [] : cloneDeep(options.indicators);
    options.indicators?.forEach((indicatorDefine, index) => {
      if (typeof indicatorDefine === 'object' && indicatorDefine?.editor) {
        (this.internalProps.indicators[index] as IIndicator).editor = indicatorDefine.editor;
      }
    });
    this.internalProps.columnTree =
      options.indicatorsAsCol && !options.columns?.length && !options.columnTree ? [] : cloneDeep(options.columnTree);
    this.internalProps.rowTree =
      !options.indicatorsAsCol && !options.rows?.length && !options.rowTree ? [] : cloneDeep(options.rowTree);
    options.records && (this.internalProps.records = options.records);
    this.stateManager.initCheckedState(this.internalProps.records);

    //分页配置
    this.pagination = options.pagination;
    // 更新protectedSpace
    internalProps.columnResizeType = options.columnResizeType ?? 'column';
    internalProps.dataConfig = cloneDeep(options.dataConfig);
    // internalProps.enableDataAnalysis = options.enableDataAnalysis;
    if (!options.rowTree && !options.columnTree) {
      internalProps.enableDataAnalysis = true;
    } else {
      internalProps.enableDataAnalysis = false;
    }
    //维护tree树形结构的展开状态
    if (
      options?.rowHierarchyType === 'tree' &&
      (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType === 'tree' &&
      (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowExpandLevel === options?.rowExpandLevel
    ) {
      const beforeRowDimensions = (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowDimensionTree.tree.children;
      this.internalProps.rowTree?.forEach((node: IHeaderTreeDefine, index: number) => {
        const beforeRowDimension = beforeRowDimensions.find(
          item => item.dimensionKey === node.dimensionKey && item.value === node.value
        );
        if (beforeRowDimension) {
          this.syncHierarchyState(beforeRowDimension, node);
        }
      });
    }
    const records = this.internalProps.records;
    //TODO 这里需要加上判断 dataConfig是否有配置变化
    if (this.internalProps.enableDataAnalysis && (options.rows || options.columns)) {
      const rowKeys = options.rows?.reduce((keys, rowObj) => {
        if (typeof rowObj === 'string') {
          keys.push(rowObj);
        } else {
          keys.push(rowObj.dimensionKey);
        }
        return keys;
      }, []);
      const columnKeys = options.columns?.reduce((keys, columnObj) => {
        if (typeof columnObj === 'string') {
          keys.push(columnObj);
        } else {
          keys.push(columnObj.dimensionKey);
        }
        return keys;
      }, []);
      const indicatorKeys = options.indicators?.reduce((keys, indicatorObj) => {
        if (typeof indicatorObj === 'string') {
          keys.push(indicatorObj);
        } else {
          keys.push(indicatorObj.indicatorKey);
        }
        return keys;
      }, []);
      this.dataset = new Dataset(
        internalProps.dataConfig,
        // this.pagination,
        rowKeys,
        columnKeys,
        indicatorKeys,
        this.internalProps.indicators,
        options.indicatorsAsCol ?? true,
        options.records,
        options.rowHierarchyType,
        this.internalProps.columnTree, //传递自定义树形结构会在dataset中补充指标节点children
        this.internalProps.rowTree
      );
      internalProps.layoutMap = new PivotHeaderLayoutMap(this, this.dataset);
    } else if (Array.isArray(this.internalProps.columnTree) || Array.isArray(this.internalProps.rowTree)) {
      internalProps.layoutMap = new PivotHeaderLayoutMap(this, null);
      //判断如果数据是二维数组 则标识已经分析过 直接从二维数组挨个读取渲染即可
      //不是二维数组 对应是个object json对象 则表示flat数据，需要对应行列维度进行转成方便数据查询的行列树结构
      if (records?.[0]?.constructor !== Array) {
        this.flatDataToObjects = new FlatDataToObjects(
          {
            rows: internalProps.layoutMap.fullRowDimensionKeys,
            columns: internalProps.layoutMap.colDimensionKeys,
            indicators: internalProps.layoutMap.indicatorKeys,
            indicatorsAsCol: internalProps.layoutMap.indicatorsAsCol,
            indicatorDimensionKey: internalProps.layoutMap.indicatorDimensionKey
          },
          records
        );
      }
    } else {
      console.warn('VTable Warn: your option is invalid, please check it!');
      return this;
    }
    this.pivotSortState = [];
    if (options.pivotSortState) {
      this.updatePivotSortState(options.pivotSortState);
    }
    // 更新表头
    this.refreshHeader();

    // this.hasMedia = null; // 避免重复绑定
    // 清空目前数据
    if (internalProps.releaseList) {
      internalProps.releaseList.forEach(releaseObj => releaseObj?.release?.());
      internalProps.releaseList = null;
    }
    // // 恢复selection状态
    // internalProps.selection.range = range;
    // this._updateSize();

    // 清空单元格内容
    this.scenegraph.clearCells();
    // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;
    // 生成单元格场景树
    this.scenegraph.createSceneGraph();

    // if (this.internalProps.title && !this.internalProps.title.isReleased) {
    //   this._updateSize();
    //   this.internalProps.title.resize();
    //   this.scenegraph.resize();
    // }
    if (options.title) {
      this.internalProps.title = new Title(options.title, this);
      this.scenegraph.resize();
    }

    // this.render();
    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  /**
   * 更新页码
   * @param pagination 修改页码
   */
  updatePagination(pagination?: IPagination): void {
    if (pagination) {
      if (!this.pagination) {
        this.pagination = { currentPage: 0, perPageCount: 0 };
      }
      typeof pagination.currentPage === 'number' &&
        pagination.currentPage >= 0 &&
        (this.pagination.currentPage = pagination.currentPage);
      pagination.perPageCount &&
        (this.pagination.perPageCount = pagination.perPageCount || this.pagination.perPageCount);
      // 清空单元格内容
      this.scenegraph.clearCells();
      //数据源缓存数据更新
      (this.internalProps.layoutMap as PivotHeaderLayoutMap).setPagination(this.pagination);
      // this.refreshHeader();
      //刷新表头，原来这里是_refreshRowCount 后改名为_refreshRowColCount  因为表头定义会影响行数，而转置模式下会影响列数
      this.refreshRowColCount();
      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      this.render();
    } else if (this.pagination) {
      // 原来有分页 现在更新成不分页
      this.pagination = undefined;
      // 清空单元格内容
      this.scenegraph.clearCells();
      //数据源缓存数据更新
      (this.internalProps.layoutMap as PivotHeaderLayoutMap).setPagination(undefined);
      // this.refreshHeader();
      //刷新表头，原来这里是_refreshRowCount 后改名为_refreshRowColCount  因为表头定义会影响行数，而转置模式下会影响列数
      this.refreshRowColCount();
      // 生成单元格场景树
      this.scenegraph.createSceneGraph();
      this.render();
    }
  }

  refreshHeader(): void {
    const internalProps = this.internalProps;
    //设置列宽
    for (let col = 0; col < internalProps.layoutMap.columnWidths.length; col++) {
      const { width, minWidth, maxWidth } = internalProps.layoutMap.columnWidths?.[col] ?? {};
      // width 为 "auto" 时先不存储ColWidth
      if (width && ((typeof width === 'string' && width !== 'auto') || (typeof width === 'number' && width > 0))) {
        this._setColWidth(col, width);
      }
      if (minWidth && ((typeof minWidth === 'number' && minWidth > 0) || typeof minWidth === 'string')) {
        this.setMinColWidth(col, minWidth);
      }
      if (maxWidth && ((typeof maxWidth === 'number' && maxWidth > 0) || typeof maxWidth === 'string')) {
        this.setMaxColWidth(col, maxWidth);
      }
    }
    //刷新表头，原来这里是_refreshRowCount 后改名为_refreshRowColCount  因为表头定义会影响行数，而转置模式下会影响列数
    this.refreshRowColCount();
  }

  refreshRowColCount(): void {
    const table = this;
    const { layoutMap } = table.internalProps;
    if (!layoutMap) {
      return;
    }
    table.colCount = layoutMap.colCount ?? 0;
    table.rowCount = layoutMap.rowCount ?? 0;
    // table.frozenColCount = layoutMap.rowHeaderLevelCount; //这里不要这样写 这个setter会检查扁头宽度 可能将frozenColCount置为0
    table.internalProps.frozenColCount = layoutMap.rowHeaderLevelCount ?? 0;
    table.frozenRowCount = layoutMap.headerLevelCount;

    if (table.bottomFrozenRowCount !== (this.options.bottomFrozenRowCount ?? 0)) {
      table.bottomFrozenRowCount = this.options.bottomFrozenRowCount ?? 0;
    }
    if (table.rightFrozenColCount !== (this.options.rightFrozenColCount ?? 0)) {
      table.rightFrozenColCount = this.options.rightFrozenColCount ?? 0;
    }
    this.stateManager.setFrozenCol(this.internalProps.frozenColCount);
  }
  protected _getSortFuncFromHeaderOption(
    columns: undefined,
    field: FieldDef,
    fieldKey?: FieldKeyDef
  ): ((v1: any, v2: any, order: SortOrder) => 0 | 1 | -1) | undefined {
    return undefined;
  }
  /**
   * Get rowHierarchyType of pivotTable
   */
  get rowHierarchyType(): 'grid' | 'tree' {
    return (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType;
  }
  /**
   * 将现有tree中的的hierarchyState同步到rows透视树中
   * @param sourceNode
   * @param targetNode
   */
  private syncHierarchyState(sourceNode: any, targetNode: IHeaderTreeDefine) {
    if (sourceNode.value === targetNode.value && sourceNode.dimensionKey === targetNode.dimensionKey) {
      targetNode.hierarchyState =
        targetNode.hierarchyState ?? (targetNode?.children ? sourceNode.hierarchyState : undefined);
      targetNode?.children?.forEach((targetChildNode: IHeaderTreeDefine, index: number) => {
        if (sourceNode?.children?.[index] && targetChildNode) {
          const beforeRowDimension = sourceNode.children.find(
            (item: any) => item.dimensionKey === targetChildNode.dimensionKey && item.value === targetChildNode.value
          );
          if (beforeRowDimension) {
            this.syncHierarchyState(beforeRowDimension, targetChildNode);
          }
        }
      });
    }
  }
  getRecordShowIndexByCell(col: number, row: number): number {
    return undefined;
  }
  getTableIndexByRecordIndex(recordIndex: number): number {
    return undefined;
  }
  getTableIndexByField(field: FieldDef): number {
    return undefined;
  }
  getCellAddrByFieldRecord(field: FieldDef, recordIndex: number): CellAddress {
    return undefined;
  }
  getBodyIndexByRow(row: number): number {
    const { layoutMap } = this.internalProps;
    return layoutMap.getBodyIndexByRow(row);
  }
  getBodyIndexByCol(col: number): number {
    const { layoutMap } = this.internalProps;
    return layoutMap.getBodyIndexByCol(col);
  }
  getFieldData(field: string, col: number, row: number): FieldData {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      if (cellDimensionPath) {
        const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
          return colPath.indicatorKey ?? colPath.value;
        });
        const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
          return rowPath.indicatorKey ?? rowPath.value;
        });
        const aggregator = this.dataset.getAggregator(
          !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
          this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
          (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row)
        );
        if (aggregator.records && aggregator.records.length >= 1) {
          return aggregator.records[0][field];
        }
        // return ''
      }
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        this.internalProps.layoutMap.getBody(col, row).indicatorKey,
        false
      );
      if (treeNode?.record) {
        return treeNode?.record[field];
      }
    }
    const rowIndex = this.getBodyIndexByRow(row);
    const colIndex = this.getBodyIndexByCol(col);
    return this.records[rowIndex]?.[colIndex];
  }
  getCellValue(col: number, row: number): FieldData {
    const customMergeText = this.getCustomMergeValue(col, row);
    if (customMergeText) {
      return customMergeText;
    }
    if (this.internalProps.layoutMap.isHeader(col, row)) {
      const { title, fieldFormat } = this.internalProps.layoutMap.getHeader(col, row);
      return typeof fieldFormat === 'function' ? fieldFormat(title, col, row, this as BaseTableAPI) : title;
    }
    if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const aggregator = this.dataset.getAggregator(
        !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row)
      );
      return aggregator.formatValue ? aggregator.formatValue(col, row, this as BaseTableAPI) : '';
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const valueNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        this.internalProps.layoutMap.getBody(col, row).indicatorKey
      );
      const { fieldFormat } = this.internalProps.layoutMap.getBody(col, row);
      return typeof fieldFormat === 'function'
        ? fieldFormat(valueNode?.value, col, row, this as BaseTableAPI)
        : valueNode?.value ?? '';
    }
    const { fieldFormat } = this.internalProps.layoutMap.getBody(col, row);
    const rowIndex = this.getBodyIndexByRow(row);
    const colIndex = this.getBodyIndexByCol(col);
    const dataValue = this.records[rowIndex]?.[colIndex];
    // const cellHeaderPaths = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
    if (typeof fieldFormat === 'function') {
      const fieldResult = fieldFormat(dataValue, col, row, this as BaseTableAPI);
      return fieldResult;
    }
    return dataValue;
    // return this.getFieldData(fieldFormat || field, col, row);
  }

  getCellOriginValue(col: number, row: number): FieldData {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      const { title } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof title === 'function' ? title() : title;
    }
    if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const aggregator = this.dataset.getAggregator(
        !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row)
      );
      return aggregator.value ? aggregator.value() : undefined;
      // return ''
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        this.internalProps.layoutMap.getBody(col, row).indicatorKey
      );
      return treeNode?.value;
    }
    const rowIndex = this.getBodyIndexByRow(row);
    const colIndex = this.getBodyIndexByCol(col);
    const dataValue = this.records[rowIndex]?.[colIndex];
    return dataValue;
    // const { field } = table.internalProps.layoutMap.getBody(col, row);
    // return table.getFieldData(field, col, row);
  }

  /** 获取单元格展示数据源最原始值 */
  getCellRawValue(col: number, row: number): FieldData {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      const { title } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof title === 'function' ? title() : title;
    }
    if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const aggregator = this.dataset.getAggregator(
        !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
        false
      );
      return aggregator.value ? aggregator.value() : undefined;
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        this.internalProps.layoutMap.getBody(col, row).indicatorKey,
        false
      );
      return treeNode?.value;
    }
    const rowIndex = this.getBodyIndexByRow(row);
    const colIndex = this.getBodyIndexByCol(col);
    const dataValue = this.records[rowIndex]?.[colIndex];
    console.warn('VTable warning: this raw value may be changed in editable mode');
    return dataValue;
  }

  // 获取原始数据
  getCellOriginRecord(col: number, row: number) {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const aggregator = this.dataset.getAggregator(
        !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row)
      );
      return aggregator.records;
      // return ''
    } else if (this.flatDataToObjects) {
      //数据为行列树结构 根据row col获取对应的维度名称 查找到对应值
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      const treeNode = this.flatDataToObjects.getTreeNode(
        rowKeys,
        colKeys,
        this.internalProps.layoutMap.getBody(col, row).indicatorKey,
        false
      );
      return treeNode?.record;
    }
    const rowIndex = this.getBodyIndexByRow(row);
    const colIndex = this.getBodyIndexByCol(col);
    const dataValue = this.records[rowIndex]?.[colIndex];
    return dataValue;
  }

  getCellRawRecord(col: number, row: number) {
    return this.getCellOriginRecord(col, row);
  }
  /**
   * 全量更新排序规则
   * @param sortRules
   */
  updateSortRules(sortRules: SortRules) {
    this.internalProps.dataConfig.sortRules = sortRules;
    this.dataset.updateSortRules(sortRules);
    this.internalProps.layoutMap.resetHeaderTree();
    // 清空单元格内容
    this.scenegraph.clearCells();
    this.refreshHeader();
    // 生成单元格场景树
    this.scenegraph.createSceneGraph();
    this.render();
  }
  /**
   * 更新排序状态
   * @param pivotSortStateConfig.dimensions 排序状态维度对应关系；pivotSortStateConfig.order 排序状态
   */
  updatePivotSortState(
    pivotSortStateConfig: {
      dimensions: IDimensionInfo[];
      order: SortOrder;
    }[]
  ) {
    // // dimensions: IDimensionInfo[], order: SortOrder
    // // 清空当前 pivot sort 状态
    // const cells = this.pivotSortState.map((cell) => ({ col: cell.col, row: cell.row }));
    // this.pivotSortState.length = 0;
    // cells.map((cell) => {
    //   this.invalidateCellRange(this.getCellRange(cell.col, cell.row));
    // });

    // 更新 pivot sort 状态
    for (let i = 0; i < pivotSortStateConfig.length; i++) {
      const { dimensions, order } = pivotSortStateConfig[i];
      const cellAddress = (this.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotCellAdress(dimensions);

      cellAddress &&
        this.pivotSortState.push({
          col: cellAddress.col,
          row: cellAddress.row,
          order
        });
    }

    // // 更新相关单元格样式
    // this.pivotSortState.map((cell) => {
    //   this.invalidateCellRange(this.getCellRange(cell.col, cell.row));
    // });
  }

  getPivotSortState(col: number, row: number): SortOrder {
    if (!this.pivotSortState) {
      return undefined;
    }
    const cellRange = this.getCellRange(col, row);
    for (let i = 0; i < this.pivotSortState.length; i++) {
      const { col: sortCol, row: sortRow, order } = this.pivotSortState[i];

      if (cellInRange(cellRange, sortCol, sortRow)) {
        return order;
      }
    }
    return undefined;
  }
  /**
   * 拖拽移动表头位置
   * @param source 移动源位置
   * @param target 移动目标位置
   */
  moveHeaderPosition(source: CellAddress, target: CellAddress) {
    // 调用布局类 布局数据结构调整为移动位置后的
    const moveContext = (this.internalProps.layoutMap as PivotHeaderLayoutMap).moveHeaderPosition(source, target);
    if (moveContext) {
      if (moveContext.moveType === 'column') {
        // 是扁平数据结构 需要将二维数组this.records进行调整
        if (this.options.records?.[0]?.constructor === Array) {
          for (let row = 0; row < this.internalProps.records.length; row++) {
            const sourceColumns = (this.internalProps.records[row] as unknown as number[]).splice(
              moveContext.sourceIndex - this.rowHeaderLevelCount,
              moveContext.moveSize
            );
            sourceColumns.unshift((moveContext.targetIndex as any) - this.rowHeaderLevelCount, 0 as any);
            Array.prototype.splice.apply(this.internalProps.records[row] as unknown as number[], sourceColumns);
          }
        }
        //colWidthsMap 中存储着每列的宽度 根据移动 sourceCol targetCol 调整其中的位置
        this.colWidthsMap.adjustOrder(moveContext.sourceIndex, moveContext.targetIndex, moveContext.moveSize);
        //下面代码取自refreshHeader列宽设置逻辑
        //设置列宽极限值 TODO 目前是有问题的 最大最小宽度限制 移动列位置后不正确
        for (let col = 0; col < this.internalProps.layoutMap.columnWidths.length; col++) {
          const { minWidth, maxWidth } = this.internalProps.layoutMap.columnWidths?.[col] ?? {};
          if (minWidth && ((typeof minWidth === 'number' && minWidth > 0) || typeof minWidth === 'string')) {
            this.setMinColWidth(col, minWidth);
          }
          if (maxWidth && ((typeof maxWidth === 'number' && maxWidth > 0) || typeof maxWidth === 'string')) {
            this.setMaxColWidth(col, maxWidth);
          }
        }
      } else if (moveContext.moveType === 'row') {
        // 是扁平数据结构 需要将二维数组this.records进行调整
        if (this.options.records?.[0]?.constructor === Array) {
          const sourceRows = (this.internalProps.records as unknown as number[]).splice(
            moveContext.sourceIndex - this.columnHeaderLevelCount,
            moveContext.moveSize
          );
          sourceRows.unshift((moveContext.targetIndex as any) - this.columnHeaderLevelCount, 0 as any);
          Array.prototype.splice.apply(this.internalProps.records, sourceRows);
        }
        //colWidthsMap 中存储着每列的宽度 根据移动 sourceCol targetCol 调整其中的位置
        this.rowHeightsMap.adjustOrder(moveContext.sourceIndex, moveContext.targetIndex, moveContext.moveSize);
      }
      return true;
    }
    return false;
  }
  /**
   * 表头切换层级状态
   * @param col
   * @param row
   */
  toggleHierarchyState(col: number, row: number) {
    let notFillWidth = false;
    let notFillHeight = false;
    const checkHasChart = this.internalProps.layoutMap.checkHasChart();
    // 检查当前状态总宽高未撑满autoFill是否在起作用
    if (checkHasChart) {
      if (this.autoFillWidth) {
        notFillWidth = this.getAllColsWidth() <= this.tableNoFrameWidth;
      }
      if (this.autoFillHeight) {
        notFillHeight = this.getAllRowsHeight() <= this.tableNoFrameHeight;
      }
    }
    const hierarchyState = this.getHierarchyState(col, row);
    if (hierarchyState === HierarchyState.expand) {
      this.fireListeners(PIVOT_TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.collapse
      });
    } else if (hierarchyState === HierarchyState.collapse) {
      this.fireListeners(PIVOT_TABLE_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.expand,
        originData: this.getCellOriginRecord(col, row)
      });
    }

    const result = (this.internalProps.layoutMap as PivotHeaderLayoutMap).toggleHierarchyState(col, row);
    //影响行数
    this.refreshRowColCount();
    // this.scenegraph.clearCells();
    // this.scenegraph.createSceneGraph();
    // this.invalidate();
    this.clearCellStyleCache();
    this.scenegraph.updateHierarchyIcon(col, row);
    this.scenegraph.updateRow(result.removeCellPositions, result.addCellPositions, result.updateCellPositions);
    if (checkHasChart) {
      // 检查更新节点状态后总宽高未撑满autoFill是否在起作用
      if (this.autoFillWidth && !notFillWidth) {
        notFillWidth = this.getAllColsWidth() <= this.tableNoFrameWidth;
      }
      if (this.autoFillHeight && !notFillHeight) {
        notFillHeight = this.getAllRowsHeight() <= this.tableNoFrameHeight;
      }
      if (this.widthMode === 'adaptive' || notFillWidth || this.heightMode === 'adaptive' || notFillHeight) {
        this.scenegraph.updateChartSize(0); // 如果收起展开有性能问题 可以排查下这个防范
      }
    }
  }
  /**
   * 通过表头的维度值路径来计算单元格位置  getCellAddressByHeaderPaths接口更强大一些 不限表头 不限参数格式
   * @param dimensionPaths
   * @returns
   */
  getHeaderCellAddressByPath(dimensionPaths: IDimensionInfo[]): CellAddress {
    const cellAddress = (this.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotCellAdress(dimensionPaths);
    return cellAddress;
  }
  /**
   * 通过表头的维度值路径来计算单元格位置
   * @param dimensionPaths
   * @returns
   */
  getCellAddressByHeaderPaths(
    dimensionPaths:
      | {
          colHeaderPaths: IDimensionInfo[];
          rowHeaderPaths: IDimensionInfo[];
          cellLocation: CellLocation;
        }
      | IDimensionInfo[]
  ): CellAddress {
    const cellAddress = (this.internalProps.layoutMap as PivotHeaderLayoutMap).getCellAdressByHeaderPath(
      dimensionPaths
    );
    return cellAddress;
  }

  /**
   * 通过传入的坐标 获取该位置当前单元格的维度路径；
   * @param coordinate 从body左上角为原点 coordinate为偏移距离 去计算单元格的headerPath；
   * 如不传coordinate坐标则按取body中左上角第一个单元格的维度路径
   * @returns
   */
  getHeaderPathByXY(coordinate?: { x: number; y: number }): ICellHeaderPaths {
    let cellAddr;
    if (coordinate) {
      cellAddr = this.getCellAt(
        coordinate.x + this.getFrozenColsWidth() + this.scrollLeft + 1,
        coordinate.y + this.getFrozenRowsHeight() + this.scrollTop + 1
      );
    } else {
      cellAddr = this.getCellAt(
        this.getFrozenColsWidth() + this.scrollLeft + 1,
        this.getFrozenRowsHeight() + this.scrollTop + 1
      );
    }
    const cellHeaderPaths = this.internalProps.layoutMap.getCellHeaderPaths(cellAddr.col, cellAddr.row);
    return cellHeaderPaths;
  }
  getHierarchyState(col: number, row: number): HierarchyState {
    return this._getHeaderLayoutMap(col, row)?.hierarchyState;
  }
  /** 获取列头树结构 */
  getLayoutColumnTree(): LayouTreeNode[] {
    const layoutMap = this.internalProps.layoutMap;
    return layoutMap.getLayoutColumnTree();
  }
  /** 获取表格列头树形结构的占位的总节点数 */
  getLayoutColumnTreeCount(): number {
    const layoutMap = this.internalProps.layoutMap;
    return layoutMap.getLayoutColumnTreeCount();
  }
  /** 获取行头树结构 */
  getLayoutRowTree(): LayouTreeNode[] {
    const layoutMap = this.internalProps.layoutMap;
    return layoutMap.getLayoutRowTree();
  }
  /** 获取表格行头树形结构的占位的总节点数 */
  getLayoutRowTreeCount(): number {
    const layoutMap = this.internalProps.layoutMap;
    return layoutMap.getLayoutRowTreeCount();
  }
  /**
   * 根据行列号获取表头tree节点，包含了用户在自定义树rowTree及columnTree树上的自定义属性（也是内部布局树的节点，获取后请不要随意修改）
   * @param col
   * @param row
   * @returns
   */
  getCellHeaderTreeNodes(col: number, row: number): ICellHeaderPaths {
    const layoutMap = this.internalProps.layoutMap;
    const headerNodes = layoutMap.getCellHeaderPathsWidthTreeNode(col, row);
    return headerNodes;
  }
  _hasHierarchyTreeHeader() {
    return (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType === 'tree';
  }

  getMenuInfo(col: number, row: number, type: string): DropDownMenuEventInfo {
    const dimensionInfos = (this.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row);
    const result: DropDownMenuEventInfo = {
      dimensionKey: dimensionInfos[dimensionInfos.length - 1].dimensionKey,
      value: this.getCellValue(col, row),
      cellLocation: this.getCellLocation(col, row),
      isPivotCorner: this.isCornerHeader(col, row),
      event: undefined
    };
    return result;
  }

  /**
   * 设置表格数据 及排序状态
   * @param records
   * @param sort
   */
  setRecords(records: Array<any>): void {
    const oldHoverState = { col: this.stateManager.hover.cellPos.col, row: this.stateManager.hover.cellPos.row };
    this.options.records = this.internalProps.records = records;
    const options = this.options;
    const internalProps = this.internalProps;
    if (this.internalProps.enableDataAnalysis && (options.rows || options.columns)) {
      this.dataset.setRecords(records);
      internalProps.layoutMap = new PivotHeaderLayoutMap(this, this.dataset);
      this.pivotSortState = [];
      if (options.pivotSortState) {
        this.updatePivotSortState(options.pivotSortState);
      }
    } else if (Array.isArray(this.internalProps.columnTree) || Array.isArray(this.internalProps.rowTree)) {
      //判断如果数据是二维数组 则标识已经分析过 直接从二维数组挨个读取渲染即可
      //不是二维数组 对应是个object json对象 则表示flat数据，需要对应行列维度进行转成方便数据查询的行列树结构
      if (records?.[0]?.constructor !== Array) {
        this.flatDataToObjects = new FlatDataToObjects(
          {
            rows: internalProps.layoutMap.fullRowDimensionKeys,
            columns: internalProps.layoutMap.colDimensionKeys,
            indicators: internalProps.layoutMap.indicatorKeys,
            indicatorsAsCol: internalProps.layoutMap.indicatorsAsCol,
            indicatorDimensionKey: internalProps.layoutMap.indicatorDimensionKey
          },
          records
        );
      }
    }

    // 更新表头
    this.refreshHeader();

    // 清空单元格内容
    this.scenegraph.clearCells();
    // this.internalProps.frozenColCount = this.options.frozenColCount || this.rowHeaderLevelCount;
    // 生成单元格场景树
    this.clearCellStyleCache();
    this.scenegraph.createSceneGraph();
    this.stateManager.updateHoverPos(oldHoverState.col, oldHoverState.row);
    if (this.internalProps.title && !this.internalProps.title.isReleased) {
      this._updateSize();
      this.internalProps.title.resize();
      this.scenegraph.resize();
    }
    this.eventManager.updateEventBinder();
  }
  /** 结束编辑 */
  completeEditCell() {
    this.editorManager.completeEdit();
  }
  /** 获取单元格对应的编辑器 */
  getEditor(col: number, row: number) {
    const define = this.getBodyColumnDefine(col, row);
    let editorDefine = define?.editor ?? this.options.editor;

    if (typeof editorDefine === 'function') {
      const arg = {
        col,
        row,
        dataValue: this.getCellOriginValue(col, row),
        value: this.getCellValue(col, row) || '',
        table: this
      };
      editorDefine = (editorDefine as Function)(arg);
    }
    if (typeof editorDefine === 'string') {
      return editors.get(editorDefine);
    }
    return editorDefine as IEditor;
  }

  /** 更改单元格数据 会触发change_cell_value事件*/
  changeCellValue(col: number, row: number, value: string | undefined) {
    let newValue: any = value;
    const rawValue = this.getCellRawValue(col, row);
    if (typeof rawValue === 'number' && isAllDigits(value)) {
      newValue = parseFloat(value);
    }
    this._changeCellValueToDataSet(col, row, newValue);
    // const cell_value = this.getCellValue(col, row);
    this.scenegraph.updateCellContent(col, row);
    if (this.widthMode === 'adaptive' || (this.autoFillWidth && this.getAllColsWidth() <= this.tableNoFrameWidth)) {
      if (this.internalProps._widthResizedColMap.size === 0) {
        //如果没有手动调整过行高列宽 则重新计算一遍并重新分配
        this.scenegraph.recalculateColWidths();
      }
    } else if (!this.internalProps._widthResizedColMap.has(col)) {
      const oldWidth = this.getColWidth(col);
      const newWidth = computeColWidth(col, 0, this.rowCount - 1, this, false);
      if (newWidth !== oldWidth) {
        this.scenegraph.updateColWidth(col, newWidth - oldWidth);
      }
    }
    if (this.heightMode === 'adaptive' || (this.autoFillHeight && this.getAllRowsHeight() <= this.tableNoFrameHeight)) {
      this.scenegraph.recalculateRowHeights();
    } else if (this.heightMode === 'autoHeight') {
      const oldHeight = this.getRowHeight(row);
      const newHeight = computeRowHeight(row, 0, this.colCount - 1, this);
      this.scenegraph.updateRowHeight(row, newHeight - oldHeight);
    }
    this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
      col,
      row,
      rawValue: this.getCellRawValue(col, row),
      changedValue: newValue
    });
    this.scenegraph.updateNextFrame();
  }
  /**
   * 批量更新多个单元格的数据
   * @param col 粘贴数据的起始列号
   * @param row 粘贴数据的起始行号
   * @param values 多个单元格的数据数组
   */
  changeCellValues(startCol: number, startRow: number, values: string[][]) {
    let pasteColEnd = startCol;
    let pasteRowEnd = startRow;
    // const rowCount = values.length;
    for (let i = 0; i < values.length; i++) {
      if (startRow + i > this.rowCount - 1) {
        break;
      }
      pasteRowEnd = startRow + i;
      const rowValues = values[i];
      let thisRowPasteColEnd = startCol;
      for (let j = 0; j < rowValues.length; j++) {
        if (startCol + j > this.colCount - 1) {
          break;
        }

        thisRowPasteColEnd = startCol + j;
        const value = rowValues[j];
        let newValue: string | number = value;
        const rawValue = this.getCellRawValue(startCol + j, startRow + i);
        if (typeof rawValue === 'number' && isAllDigits(value)) {
          newValue = parseFloat(value);
        }
        this._changeCellValueToDataSet(startCol + j, startRow + i, newValue);

        this.fireListeners(TABLE_EVENT_TYPE.CHANGE_CELL_VALUE, {
          col: startCol + j,
          row: startRow + i,
          rawValue,
          changedValue: this.getCellOriginValue(startCol + j, startRow + i)
        });
      }
      pasteColEnd = Math.max(pasteColEnd, thisRowPasteColEnd);
    }

    // const cell_value = this.getCellValue(col, row);
    const startRange = this.getCellRange(startCol, startRow);
    const range = this.getCellRange(pasteColEnd, pasteRowEnd);
    for (let sCol = startRange.start.col; sCol <= range.end.col; sCol++) {
      for (let sRow = startRange.start.row; sRow <= range.end.row; sRow++) {
        this.scenegraph.updateCellContent(sCol, sRow);
      }
    }
    if (this.widthMode === 'adaptive' || (this.autoFillWidth && this.getAllColsWidth() <= this.tableNoFrameWidth)) {
      if (this.internalProps._widthResizedColMap.size === 0) {
        //如果没有手动调整过行高列宽 则重新计算一遍并重新分配
        this.scenegraph.recalculateColWidths();
      }
    } else {
      for (let sCol = startCol; sCol <= range.end.col; sCol++) {
        if (!this.internalProps._widthResizedColMap.has(sCol)) {
          const oldWidth = this.getColWidth(sCol);
          const newWidth = computeColWidth(sCol, 0, this.rowCount - 1, this, false);
          if (newWidth !== oldWidth) {
            this.scenegraph.updateColWidth(sCol, newWidth - oldWidth);
          }
        }
      }
    }

    if (this.heightMode === 'adaptive' || (this.autoFillHeight && this.getAllRowsHeight() <= this.tableNoFrameHeight)) {
      this.scenegraph.recalculateRowHeights();
    } else if (this.heightMode === 'autoHeight') {
      const rows: number[] = [];
      const deltaYs: number[] = [];
      for (let sRow = startRow; sRow <= range.end.row; sRow++) {
        if (this.rowHeightsMap.get(sRow)) {
          // 已经计算过行高的才走更新逻辑
          const oldHeight = this.getRowHeight(sRow);
          const newHeight = computeRowHeight(sRow, 0, this.colCount - 1, this);
          rows.push(sRow);
          deltaYs.push(newHeight - oldHeight);
        }
      }
      this.scenegraph.updateRowsHeight(rows, deltaYs);
    }

    this.scenegraph.updateNextFrame();
  }

  private _changeCellValueToDataSet(col: number, row: number, newValue: string | number) {
    if (this.dataset) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });
      this.dataset.changeTreeNodeValue(
        !this.internalProps.layoutMap.indicatorsAsCol ? rowKeys.slice(0, -1) : rowKeys,
        this.internalProps.layoutMap.indicatorsAsCol ? colKeys.slice(0, -1) : colKeys,
        (this.internalProps.layoutMap as PivotHeaderLayoutMap).getIndicatorKey(col, row),
        newValue
      );
    } else if (this.flatDataToObjects) {
      const cellDimensionPath = this.internalProps.layoutMap.getCellHeaderPaths(col, row);
      const colKeys = cellDimensionPath.colHeaderPaths.map((colPath: any) => {
        return colPath.indicatorKey ?? colPath.value;
      });
      const rowKeys = cellDimensionPath.rowHeaderPaths.map((rowPath: any) => {
        return rowPath.indicatorKey ?? rowPath.value;
      });

      this.flatDataToObjects.changeTreeNodeValue(
        rowKeys,
        colKeys,
        this.internalProps.layoutMap.getBody(col, row).indicatorKey,
        newValue
      );
    } else {
      const rowIndex = this.getBodyIndexByRow(row);
      const colIndex = this.getBodyIndexByCol(col);
      this.records[rowIndex][colIndex] = newValue;
    }
  }
  _hasCustomRenderOrLayout() {
    if (this.options.customRender) {
      return true;
    }
    const { columnsDefine, rowsDefine, indicatorsDefine } = this.internalProps.layoutMap;
    for (let i = 0; i < columnsDefine.length; i++) {
      const columnDefine = columnsDefine[i];
      if (typeof columnDefine !== 'string' && (columnDefine.headerCustomLayout || columnDefine.headerCustomRender)) {
        return true;
      }
    }
    for (let i = 0; i < rowsDefine.length; i++) {
      const rowDefine = rowsDefine[i];
      if (typeof rowDefine !== 'string' && (rowDefine.headerCustomLayout || rowDefine.headerCustomRender)) {
        return true;
      }
    }
    for (let i = 0; i < indicatorsDefine.length; i++) {
      const indicatorDefine = indicatorsDefine[i];
      if (
        typeof indicatorDefine !== 'string' &&
        (indicatorDefine.customLayout ||
          indicatorDefine.headerCustomLayout ||
          indicatorDefine.customRender ||
          indicatorDefine.headerCustomRender)
      ) {
        return true;
      }
    }
    return false;
  }
}
