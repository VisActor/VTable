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
  IHeaderTreeDefine,
  IDimensionInfo,
  SortOrder,
  IIndicator,
  PivotChartConstructorOptions,
  CollectValueBy,
  AggregationRules,
  AggregationRule,
  AnyFunction
} from './ts-types';
import { AggregationType } from './ts-types';
import { HierarchyState } from './ts-types';
import type { PivotHeaderLayoutMap } from './layout/pivot-header-layout';
import { getField } from './data/DataSource';
import { PivoLayoutMap } from './layout/pivot-layout';
import { PIVOT_CHART_EVENT_TYPE } from './ts-types/pivot-table/PIVOT_TABLE_EVENT_TYPE';
import { cellInRange, emptyFn } from './tools/helper';
import { Dataset } from './dataset/dataset';
import { _setDataSource } from './core/tableHelper';
import { BaseTable } from './core/BaseTable';
import type { PivotTableProtected } from './ts-types/base-table';
import type { IChartColumnIndicator } from './ts-types/pivot-table/indicator/chart-indicator';
import type { Chart } from './scenegraph/graphic/chart';

export class PivotChart extends BaseTable implements PivotTableAPI {
  declare internalProps: PivotTableProtected;
  declare options: PivotChartConstructorOptions;
  pivotSortState: PivotSortState[];

  dataset?: Dataset; //数据处理对象  开启数据透视分析的表

  _selectedDataItemsInChart: any[] = [];
  _chartEventMap: Record<string, AnyFunction> = {};
  constructor(options: PivotChartConstructorOptions) {
    super(options);
    if ((options as any).layout) {
      //TODO hack处理之前的demo都是定义到layout上的 所以这里直接并到options中
      Object.assign(options, (options as any).layout);
    }
    this.setCustomStateNameToSpec();
    this.internalProps.dataConfig = {};
    this.internalProps.enableDataAnalysis = true;
    if (this.internalProps.enableDataAnalysis && (options.rows || options.columns)) {
      const rowKeys = options.rows.reduce((keys, rowObj) => {
        if (typeof rowObj === 'string') {
          keys.push(rowObj);
        } else {
          keys.push(rowObj.dimensionKey);
        }
        return keys;
      }, []);
      const columnKeys = options.columns.reduce((keys, columnObj) => {
        if (typeof columnObj === 'string') {
          keys.push(columnObj);
        } else {
          keys.push(columnObj.dimensionKey);
        }
        return keys;
      }, []);
      const indicatorKeys =
        options.indicators?.reduce((keys, indicatorObj) => {
          if (typeof indicatorObj === 'string') {
            keys.push(indicatorObj);
          } else {
            keys.push(indicatorObj.indicatorKey);
          }
          return keys;
        }, []) ?? [];
      this.internalProps.dataConfig.collectValuesBy = this._generateCollectValuesConfig(columnKeys, rowKeys);
      this.internalProps.dataConfig.aggregationRules = this._generateAggregationRules();
      this.dataset = new Dataset(
        this.internalProps.dataConfig,
        rowKeys,
        columnKeys,
        indicatorKeys,
        options.records,
        options.columnTree,
        options.rowTree
      );
    }

    this.refreshHeader();
    if (options.dataSource) {
      _setDataSource(this, options.dataSource);
    } else if (options.records) {
      this.setRecords(options.records as any, this.internalProps.sortState);
    } else {
      this.setRecords([]);
    }
  }
  static get EVENT_TYPE(): typeof PIVOT_CHART_EVENT_TYPE {
    return PIVOT_CHART_EVENT_TYPE;
  }
  isListTable(): false {
    return false;
  }
  isPivotTable(): true {
    return true;
  }
  isPivotChart(): true {
    return true;
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
  updateOption(options: PivotChartConstructorOptions, accelerateFirstScreen = false) {
    const internalProps = this.internalProps;
    //维护选中状态
    // const range = internalProps.selection.range; //保留原有单元格选中状态
    super.updateOption(options);

    // 更新protectedSpace
    internalProps.dataConfig = {};
    this.internalProps.enableDataAnalysis = true;
    //TODO 这里需要加上判断 dataConfig是否有配置变化
    if (this.internalProps.enableDataAnalysis && (options.rows || options.columns)) {
      const rowKeys = options.rows.reduce((keys, rowObj) => {
        if (typeof rowObj === 'string') {
          keys.push(rowObj);
        } else {
          keys.push(rowObj.dimensionKey);
        }
        return keys;
      }, []);
      const columnKeys = options.columns.reduce((keys, columnObj) => {
        if (typeof columnObj === 'string') {
          keys.push(columnObj);
        } else {
          keys.push(columnObj.dimensionKey);
        }
        return keys;
      }, []);
      const indicatorKeys = options.indicators.reduce((keys, indicatorObj) => {
        if (typeof indicatorObj === 'string') {
          keys.push(indicatorObj);
        } else {
          keys.push(indicatorObj.indicatorKey);
        }
        return keys;
      }, []);
      this.internalProps.dataConfig.collectValuesBy = this._generateCollectValuesConfig(columnKeys, rowKeys);
      this.internalProps.dataConfig.aggregationRules = this._generateAggregationRules();
      this.dataset = new Dataset(internalProps.dataConfig, rowKeys, columnKeys, indicatorKeys, options.records);
    }
    // 更新表头
    this.refreshHeader();

    // this.hasMedia = null; // 避免重复绑定
    // 清空目前数据
    if (internalProps.disposables) {
      internalProps.disposables.forEach(disposable => disposable?.dispose?.());
      internalProps.disposables = null;
    }
    // // 恢复selection状态
    // internalProps.selection.range = range;
    this._updateSize();
    // 传入新数据
    if (options.dataSource) {
      _setDataSource(this, options.dataSource);
    } else if (options.records) {
      this.setRecords(options.records as any, undefined);
    } else {
      this._resetFrozenColCount();
    }

    return new Promise(resolve => {
      setTimeout(resolve, 0);
    });
  }

  refreshHeader(): void {
    const internalProps = this.internalProps;

    //原表头绑定的事件 解除掉
    if (internalProps.headerEvents) {
      internalProps.headerEvents.forEach((id: number) => this.unlisten(id));
    }

    if (this.internalProps.enableDataAnalysis) {
      internalProps.layoutMap = new PivoLayoutMap(this, this.dataset);
    }
    // else if (Array.isArray(this.options.columnTree) || Array.isArray(this.options.rowTree)) {
    //   internalProps.layoutMap = new PivotHeaderLayoutMap(this);
    //   //判断如果数据是二维数组 则标识已经分析过 直接从二维数组挨个读取渲染即可
    //   //不是二维数组 对应是个object json对象 则表示flat数据，需要对应行列维度进行转成方便数据查询的行列树结构
    //   if (this.options.records?.[0]?.constructor !== Array) {
    //     this.flatDataToObjects = new DatesetForPivotChart(
    //       {
    //         rows: internalProps.layoutMap.rowDimensionKeys,
    //         columns: internalProps.layoutMap.colDimensionKeys,
    //         indicators: internalProps.layoutMap.indicatorKeys,
    //         indicatorsAsCol: internalProps.layoutMap.indicatorsAsCol,
    //         indicatorDimensionKey: internalProps.layoutMap.indicatorDimensionKey
    //       },
    //       this.options.records
    //     );
    //   }
    // }

    //设置列宽
    for (let col = 0; col < internalProps.layoutMap.columnWidths.length; col++) {
      const { width, minWidth, maxWidth } = internalProps.layoutMap.columnWidths?.[col] ?? {};
      // width 为 "auto" 时先不存储ColWidth
      if (width && ((typeof width === 'string' && width !== 'auto') || (typeof width === 'number' && width > 0))) {
        this.setColWidth(col, width);
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
    table.frozenColCount = layoutMap.rowHeaderLevelCount; //TODO
    table.frozenRowCount = layoutMap.headerLevelCount;
  }
  protected _getSortFuncFromHeaderOption(
    columns: undefined,
    field: FieldDef,
    fieldKey?: FieldKeyDef
  ): ((v1: any, v2: any, order: SortOrder) => 0 | 1 | -1) | undefined {
    return undefined;
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
          this.syncHierarchyState(sourceNode.children[index], targetChildNode);
        }
      });
    }
  }

  getRecordIndexByRow(row: number): number {
    const { layoutMap } = this.internalProps;
    return layoutMap.getRecordIndexByRow(row);
  }
  getRecordIndexByCol(col: number): number {
    const { layoutMap } = this.internalProps;
    return layoutMap.getRecordIndexByCol(col);
  }
  getFieldData(field: FieldDef | FieldFormat | undefined, col: number, row: number): FieldData {
    if (field === null || field === undefined) {
      return null;
    }
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return null;
    }
    const rowIndex = this.getRecordIndexByRow(row);
    const colIndex = this.getRecordIndexByCol(col);
    const dataValue = table.dataSource?.getField(rowIndex, colIndex);
    if (typeof field !== 'string') {
      //field为函数format
      const cellHeaderPaths = table.internalProps.layoutMap.getCellHeaderPaths(col, row);
      return getField({ dataValue, ...cellHeaderPaths }, field, emptyFn as any);
    }
    return dataValue;
  }

  getCellValue(col: number, row: number): FieldData {
    if (this.internalProps.layoutMap.isHeader(col, row)) {
      const { caption, fieldFormat } = this.internalProps.layoutMap.getHeader(col, row);
      return typeof fieldFormat === 'function' ? fieldFormat(caption) : caption;
    }
    if (this.dataset) {
      const colKey = this.dataset.colKeysPath[this.internalProps.layoutMap.getRecordIndexByCol(col)] ?? [];
      const rowKey = this.dataset.rowKeysPath[this.internalProps.layoutMap.getRecordIndexByRow(row)] ?? [];
      const aggregator = this.dataset.getAggregator(
        rowKey[rowKey.length - 1],
        colKey[colKey.length - 1],
        (this.internalProps.layoutMap as PivoLayoutMap).getIndicatorKey(col, row)
      );
      return aggregator.value ? aggregator.value() : undefined;
    }
    const { field, fieldFormat } = this.internalProps.layoutMap.getBody(col, row);
    return this.getFieldData(fieldFormat || field, col, row);
  }

  getCellOriginValue(col: number, row: number): FieldData {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      const { caption } = table.internalProps.layoutMap.getHeader(col, row);
      return typeof caption === 'function' ? caption() : caption;
    }
    if (this.dataset) {
      const colKey = this.dataset.colKeysPath[this.internalProps.layoutMap.getRecordIndexByCol(col)] ?? [];
      const rowKey = this.dataset.rowKeysPath[this.internalProps.layoutMap.getRecordIndexByRow(row)] ?? [];
      const aggregator = this.dataset.getAggregator(
        rowKey[rowKey.length - 1],
        colKey[colKey.length - 1],
        (this.internalProps.layoutMap as PivoLayoutMap).getIndicatorKey(col, row)
      );
      return aggregator.value ? aggregator.value() : undefined;
      // return ''
    }
    const { field } = table.internalProps.layoutMap.getBody(col, row);
    return table.getFieldData(field, col, row);
  }

  // 获取原始数据
  getCellOriginRecord(col: number, row: number) {
    const table = this;
    if (table.internalProps.layoutMap.isHeader(col, row)) {
      return undefined;
    }
    if (this.dataset) {
      const colKey = this.dataset.colKeysPath[this.internalProps.layoutMap.getRecordIndexByCol(col)] ?? [];
      const rowKey = this.dataset.rowKeysPath[this.internalProps.layoutMap.getRecordIndexByRow(row)] ?? [];
      const aggregator = this.dataset.getAggregator(
        rowKey[rowKey.length - 1],
        colKey[colKey.length - 1],
        (this.internalProps.layoutMap as PivoLayoutMap).getIndicatorKey(col, row)
      );
      return aggregator.records;
      // return ''
    }
    return undefined;
  }
  /**
   * 全量更新排序规则
   * @param sortRules
   */
  updateSortRules(sortRules: SortRules) {
    this.internalProps.dataConfig.sortRules = sortRules;
    this.dataset.updateSortRules(sortRules);
    (this.internalProps.layoutMap as PivoLayoutMap).updateDataset(this.dataset);
    this.invalidate();
  }
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
          for (let row = 0; row < this.records.length; row++) {
            const sourceColumns = (this.records[row] as unknown as number[]).splice(
              moveContext.sourceIndex - this.rowHeaderLevelCount,
              moveContext.moveSize
            );
            sourceColumns.unshift((moveContext.targetIndex as any) - this.rowHeaderLevelCount, 0 as any);
            Array.prototype.splice.apply(this.records[row] as unknown as number[], sourceColumns);
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
          const sourceRows = (this.records as unknown as number[]).splice(
            moveContext.sourceIndex - this.columnHeaderLevelCount,
            moveContext.moveSize
          );
          sourceRows.unshift((moveContext.targetIndex as any) - this.columnHeaderLevelCount, 0 as any);
          Array.prototype.splice.apply(this.records, sourceRows);
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
    const hierarchyState = this.getHierarchyState(col, row);
    if (hierarchyState === HierarchyState.expand) {
      this.fireListeners(PIVOT_CHART_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
        col: col,
        row: row,
        hierarchyState: HierarchyState.collapse
      });
    } else if (hierarchyState === HierarchyState.collapse) {
      this.fireListeners(PIVOT_CHART_EVENT_TYPE.TREE_HIERARCHY_STATE_CHANGE, {
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
    this.scenegraph.updateRow(result.removeCellPositions, result.addCellPositions);
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

  hasHierarchyTreeHeader() {
    return (this.internalProps.layoutMap as PivotHeaderLayoutMap).rowHierarchyType === 'tree';
  }

  getMenuInfo(col: number, row: number, type: string): DropDownMenuEventInfo {
    const dimensionInfos = (this.internalProps.layoutMap as PivotHeaderLayoutMap).getPivotDimensionInfo(col, row);
    const result: DropDownMenuEventInfo = {
      dimensionKey: dimensionInfos[dimensionInfos.length - 1].dimensionKey,
      value: this.getCellValue(col, row),
      cellType: this.getCellType(col, row),
      isPivotCorner: this.isCornerHeader(col, row)
    };
    return result;
  }
  /**
   * 根据用户配置 生成 收集维度值collectValuesBy 的配置  传给dataset用
   * @param columnKeys
   * @param rowKeys
   * @returns
   */
  private _generateCollectValuesConfig(columnKeys: string[], rowKeys: string[]) {
    const option = this.options;
    const collectValuesBy: Record<string, CollectValueBy> = {};

    if (option.indicatorsAsCol === false) {
      for (let i = 0, len = option.indicators.length; i < len; i++) {
        if (typeof option.indicators[i] !== 'string') {
          if ((option.indicators[i] as IChartColumnIndicator).chartSpec) {
            const indicatorDefine = option.indicators[i] as IIndicator;
            // 收集指标值的范围
            collectValuesBy[indicatorDefine.indicatorKey] = {
              by: rowKeys,
              range: true,
              // 判断是否需要匹配维度值相同的进行求和计算
              sumBy:
                (indicatorDefine as IChartColumnIndicator).chartSpec?.stack !== false &&
                columnKeys.concat((indicatorDefine as IChartColumnIndicator).chartSpec?.xField)
            };
            if ((indicatorDefine as IChartColumnIndicator).chartSpec.series) {
              (indicatorDefine as IChartColumnIndicator).chartSpec.series.forEach((chartSeries: any) => {
                const xField = typeof chartSeries.xField === 'string' ? chartSeries.xField : chartSeries.xField[0];
                collectValuesBy[xField] = {
                  by: columnKeys,
                  type: 'xField'
                };

                const yField = chartSeries.yField;
                collectValuesBy[yField] = {
                  by: rowKeys,
                  range: true,
                  sumBy: chartSeries.stack !== false && columnKeys.concat(xField)
                };
              });
            } else {
              const xField =
                typeof (indicatorDefine as IChartColumnIndicator).chartSpec.xField === 'string'
                  ? (indicatorDefine as IChartColumnIndicator).chartSpec.xField
                  : (indicatorDefine as IChartColumnIndicator).chartSpec.xField[0];
              collectValuesBy[xField] = {
                by: columnKeys,
                type: 'xField'
              };
              //下面这个收集的值 应该是和收集的 collectValuesBy[indicatorDefine.indicatorKey] 相同
              const yField = (indicatorDefine as IChartColumnIndicator).chartSpec.yField;
              collectValuesBy[yField] = {
                by: rowKeys,
                range: true,
                sumBy: (indicatorDefine as IChartColumnIndicator).chartSpec.stack !== false && columnKeys.concat(xField)
              };
            }
          }
        }
      }
    } else {
      for (let i = 0, len = option.indicators.length; i < len; i++) {
        if (typeof option.indicators[i] !== 'string') {
          if ((option.indicators[i] as IChartColumnIndicator).chartSpec) {
            const indicatorDefine = option.indicators[i] as IIndicator;
            // 收集指标值的范围
            collectValuesBy[indicatorDefine.indicatorKey] = {
              by: columnKeys,
              range: true,
              // 判断是否需要匹配维度值相同的进行求和计算
              sumBy:
                (indicatorDefine as IChartColumnIndicator).chartSpec?.stack !== false &&
                rowKeys.concat((indicatorDefine as IChartColumnIndicator).chartSpec?.yField)
            };
            if ((indicatorDefine as IChartColumnIndicator).chartSpec.series) {
              (indicatorDefine as IChartColumnIndicator).chartSpec.series.forEach((chartSeries: any) => {
                const yField = typeof chartSeries.yField === 'string' ? chartSeries.yField : chartSeries.yField[0];
                collectValuesBy[yField] = {
                  by: rowKeys,
                  type: 'yField'
                };

                const xField = chartSeries.xField;
                collectValuesBy[xField] = {
                  by: columnKeys,
                  range: true,
                  sumBy: chartSeries.stack !== false && rowKeys.concat(yField)
                };
              });
            } else {
              const yField =
                typeof (indicatorDefine as IChartColumnIndicator).chartSpec.yField === 'string'
                  ? (indicatorDefine as IChartColumnIndicator).chartSpec.yField
                  : (indicatorDefine as IChartColumnIndicator).chartSpec.yField[0];
              collectValuesBy[yField] = {
                by: rowKeys,
                type: 'yField'
              };
              //下面这个收集的值 应该是和收集的 collectValuesBy[indicatorDefine.indicatorKey] 相同
              const xField = (indicatorDefine as IChartColumnIndicator).chartSpec.xField;
              collectValuesBy[xField] = {
                by: columnKeys,
                range: true,
                sumBy: (indicatorDefine as IChartColumnIndicator).chartSpec.stack !== false && rowKeys.concat(yField)
              };
            }
          }
        }
      }
    }
    return collectValuesBy;
  }
  // private _generateAggregationRules(indicatorKeys: string[]): AggregationRules {
  //   return indicatorKeys.map((indicatorKey: string) => {
  //     return {
  //       indicatorKey, //field转为指标key
  //       field: indicatorKey, //指标依据字段
  //       aggregationType: AggregationType.RECORD //计算类型
  //     };
  //   });
  // }
  private _generateAggregationRules() {
    const aggregationRules: AggregationRules = [];
    this.options.indicators.forEach((indicator: IIndicator | string) => {
      if (typeof indicator === 'string') {
        aggregationRules.push({
          indicatorKey: indicator, //field转为指标key
          field: indicator, //指标依据字段
          aggregationType: AggregationType.RECORD //计算类型
        } as AggregationRule<AggregationType.RECORD>);
      } else {
        // 如果chartSpec配置了组合图 series 则需要考虑 series中存在的多个指标
        if ((indicator as IChartColumnIndicator).chartSpec?.series) {
          const fields: string[] = [];
          (indicator as IChartColumnIndicator).chartSpec?.series.forEach((seriesSpec: any) => {
            const seriesField = this.options.indicatorsAsCol === false ? seriesSpec.yField : seriesSpec.xField;
            if (fields.indexOf(seriesField) === -1) {
              fields.push(seriesField);
            }
          });
          aggregationRules.push({
            indicatorKey: indicator.indicatorKey, //field转为指标key
            field: fields, //指标依据字段
            aggregationType: AggregationType.RECORD //计算类型
          });
        } else {
          aggregationRules.push({
            indicatorKey: indicator.indicatorKey, //field转为指标key
            field: indicator.indicatorKey, //指标依据字段
            aggregationType: AggregationType.RECORD //计算类型
          });
        }
      }
    });

    return aggregationRules;
  }
  private setCustomStateNameToSpec() {
    /** 修改设置的selected 和 dselected_reverse的名字加前缀vtable */
    const setCustomStateName = (spec: any) => {
      if (spec.bar?.state?.selected) {
        spec.bar.state.vtable_selected = spec.bar.state.selected;
        spec.bar.state.vtable_selected_reverse = spec.bar.state.selected_reverse;
        delete spec.bar.state.selected;
        delete spec.bar.state.selected_reverse;
      }
      if (spec.point?.state?.selected) {
        spec.point.state.vtable_selected = spec.point.state.selected;
        spec.point.state.vtable_selected_reverse = spec.point.state.selected_reverse;
        delete spec.point.state.selected;
        delete spec.point.state.selected_reverse;
      }
      if (spec.line?.state?.selected) {
        spec.line.state.vtable_selected = spec.line.state.selected;
        spec.line.state.vtable_selected_reverse = spec.line.state.selected_reverse;
        delete spec.line.state.selected;
        delete spec.line.state.selected_reverse;
      }
      if (spec.area?.state?.selected) {
        spec.area.state.vtable_selected = spec.area.state.selected;
        spec.area.state.vtable_selected_reverse = spec.area.state.selected_reverse;
        delete spec.area.state.selected;
        delete spec.area.state.selected_reverse;
      }
    };
    this.options.indicators.forEach((indicator: string | IIndicator) => {
      if ((indicator as IChartColumnIndicator).chartSpec) {
        const spec = (indicator as IChartColumnIndicator).chartSpec;
        if (spec.series) {
          spec.series.forEach((series: any) => {
            setCustomStateName(series);
          });
        } else {
          setCustomStateName(spec);
        }
      }
    });
  }
  /** 获取当前hover单元格的图表实例。这个方法hover实时获取有点缺陷：鼠标hover到单元格上触发了 chart.ts中的activate方法 但此时this.stateManeger.hover?.cellPos?.col还是-1 */
  _getActiveChartInstance() {
    // 根据hover的单元格位置 获取单元格实例 拿到chart图元
    const cellGroup = this.scenegraph.getCell(
      this.stateManeger.hover?.cellPos?.col,
      this.stateManeger.hover?.cellPos?.row
    );
    return cellGroup?.getChildren()?.[0]?.type === 'chart'
      ? (cellGroup.getChildren()[0] as Chart).activeChartInstance
      : null;
  }
  /**
   * 监听vchart事件
   * @param type vchart事件类型
   * @param listener vchart事件监听器
   * @returns 事件监听器id
   */
  listenChart(type: string, listener: AnyFunction): void {
    // this.internalProps.layoutMap.columnObjects.forEach((indicatorObj: IndicatorData) => {
    //   indicatorObj.chartInstance.on(type, listener);
    // });
    this._chartEventMap[type] = listener;
  }

  unlistenChart(type: string): void {
    // this.internalProps.layoutMap.columnObjects.forEach((indicatorObj: IndicatorData) => {
    //   indicatorObj.chartInstance.off(type);
    // });
    delete this._chartEventMap[type];
  }
  /** 给activeChartInstance逐个绑定chart用户监听事件 */
  _bindChartEvent(activeChartInstance: any) {
    if (activeChartInstance) {
      for (const key in this._chartEventMap) {
        activeChartInstance.on(key, this._chartEventMap[key]);
      }
    }
  }
}
