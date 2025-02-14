import { isArray, isValid } from '@visactor/vutils';
import type {
  FilterRules,
  IPivotTableDataConfig,
  SortRule,
  AggregationRules,
  AggregationRule,
  SortRules,
  DerivedFieldRule,
  DerivedFieldRules,
  SortByIndicatorRule,
  SortByRule,
  SortTypeRule,
  SortFuncRule,
  Totals,
  MappingRules,
  SortOrder,
  IHeaderTreeDefine,
  CollectValueBy,
  CollectedValue,
  IIndicator,
  IPivotChartDataConfig,
  CalculateddFieldRules,
  SortType
} from '../ts-types';
import { AggregationType } from '../ts-types';
import type { Aggregator, IAggregator } from '../ts-types/dataset/aggregation';
import {
  registeredAggregators,
  AvgAggregator,
  CountAggregator,
  CustomAggregator,
  MaxAggregator,
  MinAggregator,
  NoneAggregator,
  RecalculateAggregator,
  RecordAggregator,
  SumAggregator,
  naturalSort,
  sortBy,
  typeSort
} from '../ts-types/dataset/aggregation';
import { IndicatorDimensionKeyPlaceholder } from '../tools/global';
import { join } from '../tools/join';
/**
 * 数据处理模块
 */
export class Dataset {
  /**
   * 用户配置
   */
  dataConfig?: IPivotTableDataConfig | IPivotChartDataConfig;
  // /**
  //  * 分页配置
  //  */
  // pagination: IPagination;
  /**
   * 明细数据
   */
  records?: any[] | Record<string, any[]>;
  filteredRecords?: any[] | Record<string, any[]>;
  /**
   * 树形节点，最后的子节点对应到body部分的每个单元格 树结构： 行-列-单元格
   */
  tree: Record<string, Record<string, Aggregator[]>> = {};
  changedTree: Record<string, Record<string, any[]>> = {};
  private colFlatKeys: Record<string, number> = {}; //记录某个colKey已经被添加过colKeys到
  private rowFlatKeys: Record<string, number> = {}; //记录某个rowKey已经被添加过rowKeys到

  //列表头的每列对应的表头键值
  colKeys: string[][] = [];
  //行表头的每行对应的表头键值
  rowKeys: string[][] = [];

  // 存储下未排序即初始normal下rowKeys和colKeys
  colKeys_normal: string[][] = [];
  rowKeys_normal: string[][] = [];
  // /**
  //  * 对应dataset中的rowKeys，行表头的每行表头键值，包含小计总计
  //  */
  // rowKeysPath: string[][];
  // /**
  //  * 对应dataset中的colKeys，列表头的每列表头键值，包含小计总计
  //  */
  // colKeysPath: string[][];
  // allTotal: SumAggregator;
  rowOrder = 'key_a_to_z';
  colOrder = 'key_a_to_z';
  //是否已排序
  sorted = false;
  //排序规则
  sortRules?: SortRules;
  //过滤规则
  filterRules?: FilterRules;
  //聚合规则
  aggregationRules?: AggregationRules;
  //派生字段规则
  derivedFieldRules?: DerivedFieldRules;
  mappingRules?: MappingRules;
  calculatedFieldRules?: CalculateddFieldRules;
  /** 计算字段 */
  calculatedFiledKeys?: string[];
  calculatedFieldDependIndicatorKeys?: string[];
  //汇总配置
  totals?: Totals;
  //全局统计各指标的极值
  indicatorStatistics: { max: Aggregator; min: Aggregator; total: Aggregator }[] = [];

  stringJoinChar = String.fromCharCode(0);
  //缓存rows对应每个值是否为汇总字段
  private rowsIsTotal: boolean[] = [];
  private colsIsTotal: boolean[] = [];
  private colGrandTotalLabel: string;
  private colSubTotalLabel: string;
  private rowGrandTotalLabel: string;
  private rowSubTotalLabel: string;
  private needSplitPositiveAndNegative?: boolean;
  collectValuesBy?: Record<string, CollectValueBy>; //收集维度值，field收集维度，by按什么进行分组收集
  collectedValues: Record<string, Record<string, CollectedValue>> = {};
  cacheCollectedValues: Record<string, Record<string, CollectedValue>> = {};
  rows: string[];
  rowsHasValue: boolean[]; //rows中的key是否有在records中体现
  columns: string[];
  columnsHasValue: boolean[]; //columns中的key是否有在records中体现
  indicatorKeys: string[];
  indicatorKeysIncludeCalculatedFieldDependIndicatorKeys: string[];
  customRowTree?: IHeaderTreeDefine[];
  customColTree?: IHeaderTreeDefine[];
  // 存储自定义表头树 对应每一行的 key path
  customRowTreeDimensionPaths: {
    dimensionKey?: string | number;
    value: string;
    indicatorKey?: string | number;
    isVirtual?: boolean;
    childKeys?: (string | number)[];
  }[][];
  // 存储自定义表头树 对应每一行的 key path
  customColTreeDimensionPaths: {
    dimensionKey?: string | number;
    value: string;
    indicatorKey?: string | number;
    isVirtual?: boolean;
  }[][];
  // // 存储行表头path 这个是全量的 对比于分页截取的rowKeysPath；
  // private rowKeysPath_FULL: string[][];
  colHeaderTree: any[];
  rowHeaderTree: any[];
  rowHierarchyType: 'grid' | 'tree' | 'grid-tree';
  columnHierarchyType: 'grid' | 'grid-tree';
  indicators?: (string | IIndicator)[];
  indicatorsAsCol: boolean;
  // 记录用户传入的汇总数据
  totalRecordsTree: Record<string, Record<string, Aggregator[]>> = {};
  hasExtensionRowTree?: boolean;
  parseCustomTreeToMatchRecords?: boolean;
  constructor(
    dataConfig: IPivotTableDataConfig | IPivotChartDataConfig | undefined,
    // pagination: IPagination,
    rows: string[],
    columns: string[],
    indicatorKeys: string[],
    indicators: (string | IIndicator)[] | undefined,
    indicatorsAsCol: boolean,
    records: any[] | Record<string, any[]> | undefined,
    rowHierarchyType?: 'grid' | 'tree' | 'grid-tree',
    columnHierarchyType?: 'grid' | 'grid-tree',
    customColTree?: IHeaderTreeDefine[],
    customRowTree?: IHeaderTreeDefine[],
    needSplitPositiveAndNegative?: boolean,
    hasExtensionRowTree?: boolean,
    parseCustomTreeToMatchRecords?: boolean
  ) {
    this.registerAggregators();
    this.dataConfig = dataConfig;
    this.filterRules = this.dataConfig?.filterRules;
    this.rowHierarchyType = rowHierarchyType ?? 'grid';
    this.columnHierarchyType = columnHierarchyType ?? 'grid';
    // this.allTotal = new SumAggregator(this.indicators[0]);
    this.sortRules = this.dataConfig?.sortRules;
    this.aggregationRules = this.dataConfig?.aggregationRules;
    this.derivedFieldRules = this.dataConfig?.derivedFieldRules;
    this.mappingRules = this.dataConfig?.mappingRules;
    this.calculatedFieldRules = this.dataConfig?.calculatedFieldRules;
    this.calculatedFiledKeys = this.calculatedFieldRules?.map(rule => rule.key) ?? [];
    this.calculatedFieldDependIndicatorKeys =
      this.calculatedFieldRules?.reduce((arr: string[], rule) => {
        for (let i = 0; i < rule.dependIndicatorKeys.length; i++) {
          if (arr.indexOf(rule.dependIndicatorKeys[i]) === -1) {
            arr.push(rule.dependIndicatorKeys[i]);
          }
        }
        return arr;
      }, []) ?? [];
    this.totals = this.dataConfig?.totals;
    this.rows = rows;
    this.columns = columns;
    this.indicatorKeys = indicatorKeys;
    this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys = [...indicatorKeys];

    for (let m = 0; m < this.calculatedFieldDependIndicatorKeys.length; m++) {
      if (
        this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys.indexOf(
          this.calculatedFieldDependIndicatorKeys[m]
        ) === -1
      ) {
        this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys.push(this.calculatedFieldDependIndicatorKeys[m]);
      }
    }
    this.indicatorsAsCol = indicatorsAsCol;
    this.indicators = indicators;
    this.customColTree = customColTree;
    this.customRowTree = customRowTree;
    this.hasExtensionRowTree = hasExtensionRowTree;
    this.parseCustomTreeToMatchRecords = parseCustomTreeToMatchRecords;
    if (this.parseCustomTreeToMatchRecords) {
      this.customColTreeDimensionPaths = this.customTreeToDimensionPathArr(this.customColTree, 'col');
      if (!this.hasExtensionRowTree) {
        this.customRowTreeDimensionPaths = this.customTreeToDimensionPathArr(this.customRowTree, 'row');
      }
    }
    this.colGrandTotalLabel = this.totals?.column?.grandTotalLabel ?? '总计';
    this.colSubTotalLabel = this.totals?.column?.subTotalLabel ?? '小计';
    this.rowGrandTotalLabel = this.totals?.row?.grandTotalLabel ?? '总计';
    this.rowSubTotalLabel = this.totals?.row?.subTotalLabel ?? '小计';
    this.collectValuesBy = (this.dataConfig as IPivotChartDataConfig)?.collectValuesBy;
    this.needSplitPositiveAndNegative = needSplitPositiveAndNegative ?? false;
    this.rowsIsTotal = new Array(this.rows?.length ?? 0).fill(false);
    this.colsIsTotal = new Array(this.columns?.length ?? 0).fill(false);

    if (this.totals?.row && this.totals.row.showSubTotals !== false && this.totals.row.subTotalsDimensions) {
      for (let i = 0, len = this.totals?.row?.subTotalsDimensions?.length ?? 0; i < len; i++) {
        const dimension = this.totals.row.subTotalsDimensions[i];
        const dimensionIndex = this.rows.indexOf(dimension);
        this.rowsIsTotal[dimensionIndex] = true;
      }
    }
    if (this.totals?.column && this.totals.column.showSubTotals !== false && this.totals.column.subTotalsDimensions) {
      for (let i = 0, len = this.totals?.column?.subTotalsDimensions?.length ?? 0; i < len; i++) {
        const dimension = this.totals.column.subTotalsDimensions[i];
        const dimensionIndex = this.columns.indexOf(dimension);
        this.colsIsTotal[dimensionIndex] = true;
      }
    }
    // this.rowKeysPath = [];
    // this.rowKeysPath_FULL = [];
    // this.colKeysPath = [];
    this.setRecords(records);
    // this.updatePagination(pagination);
  }

  setRecords(records: any[] | Record<string, any[]>) {
    this.records = records;
    this.collectedValues = {};
    this.cacheCollectedValues = {};
    this.totalRecordsTree = {};
    this.tree = {};
    this.colFlatKeys = {};
    this.rowFlatKeys = {};
    this.colKeys = [];
    this.rowKeys = [];
    this.rowsHasValue = [];
    this.columnsHasValue = [];
    this.sorted = false;
    if (records) {
      //处理数据
      this.records = records;
      const t0 = typeof window !== 'undefined' ? window.performance.now() : 0;
      // if (records?.[0]?.constructor !== Array) {
      // 不能加这个判断来提升性能了，
      // PivotChart 会有这种设置情况
      // records: {
      //   "0": [
      //     {
      //       "10001": "数量",
      //       "10002": "37534",
      //       "10003": "sum_1700027602758",
      //       "30001": "数量",
      //       "1700046734980": "",
      //       sum_1700027602758: "37534",
      //     },
      //   ],
      // },
      this.processRecords();
      // }

      //processRecord中按照collectValuesBy 收集了维度值。现在需要对有聚合需求的sumby 处理收集维度值范围
      this.processCollectedValuesWithSumBy();
      //processRecord中按照collectValuesBy 收集了维度值。现在需要对有排序需求的处理sortby
      this.generateCollectedValuesSortRule();
      this.processCollectedValuesWithSortBy();
      const t1 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('processRecords:', t1 - t0);

      // 处理汇总
      const t4 = typeof window !== 'undefined' ? window.performance.now() : 0;
      this.totalStatistics();
      const t5 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('totalStatistics:', t5 - t4);

      this.rowKeys_normal = this.rowKeys.slice();
      this.colKeys_normal = this.colKeys.slice();
      //对维度排序
      const t2 = typeof window !== 'undefined' ? window.performance.now() : 0;
      this.sortKeys();
      const t3 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('sortKeys:', t3 - t2);
      //转为树形
      // const t4 = typeof window !== 'undefined' ? window.performance.now() : 0;
      // this.madeTree(this.rowKeys);
      // const t41 = typeof window !== 'undefined' ? window.performance.now() : 0;
      // console.log('madeTree:', t41 - t4);

      const t7 = typeof window !== 'undefined' ? window.performance.now() : 0;
      if (this.customRowTree) {
        // if (!this.indicatorsAsCol) {
        //   this.customRowTree = this._adjustCustomTree(this.customRowTree);
        // }

        this.rowHeaderTree = this.customRowTree;
      } else {
        if (this.rowHierarchyType === 'tree') {
          this.rowHeaderTree = this.ArrToTree1(
            this.rowKeys,
            this.rows.filter((key, index) => {
              return this.rowsHasValue[index];
            }),
            this.indicatorsAsCol ? undefined : this.indicators,
            this.totals?.row?.showGrandTotals ||
              (!this.indicatorsAsCol && this.columns.length === 0) ||
              (this.indicatorsAsCol && this.rows.length === 0),
            this.rowGrandTotalLabel,
            this.totals?.row?.showGrandTotalsOnTop ?? false
          );
        } else {
          this.rowHeaderTree = this.ArrToTree(
            this.rowKeys,
            this.rows.filter((key, index) => {
              return this.rowsHasValue[index];
            }),
            this.indicatorsAsCol ? undefined : this.indicators,
            this.rowsIsTotal,
            this.totals?.row?.showGrandTotals || (this.indicatorsAsCol && this.rows.length === 0),
            this.rowGrandTotalLabel,
            this.rowSubTotalLabel,
            this.totals?.row?.showGrandTotalsOnTop ?? false,
            this.totals?.row?.showSubTotalsOnTop ?? false
          );
        }
      }
      if (this.customColTree) {
        // if (this.indicatorsAsCol) {
        //   this.customColTree = this._adjustCustomTree(this.customColTree);
        // }
        this.colHeaderTree = this.customColTree;
      } else {
        // if (this.columnHierarchyType !== 'grid') {
        //   this.colHeaderTree = this.ArrToTree1(
        //     this.colKeys,
        //     this.columns.filter((key, index) => {
        //       return this.columnsHasValue[index];
        //     }),
        //     this.indicatorsAsCol ? this.indicators : undefined,
        //     this.totals?.column?.showGrandTotals ||
        //       (!this.indicatorsAsCol && this.columns.length === 0) ||
        //       (this.indicatorsAsCol && this.rows.length === 0),
        //     this.colGrandTotalLabel
        //   );
        // } else {
        this.colHeaderTree = this.ArrToTree(
          this.colKeys,
          this.columns.filter((key, index) => {
            return this.columnsHasValue[index];
          }),
          this.indicatorsAsCol ? this.indicators : undefined,
          this.colsIsTotal,
          this.totals?.column?.showGrandTotals || (!this.indicatorsAsCol && this.columns.length === 0), // || this.rows.length === 0,//todo  这里原有逻辑暂时注释掉
          this.colGrandTotalLabel,
          this.colSubTotalLabel,
          this.totals?.column?.showGrandTotalsOnLeft ?? false,
          this.totals?.column?.showSubTotalsOnLeft ?? false
        );
        // }
      }
      const t8 = typeof window !== 'undefined' ? window.performance.now() : 0;
      console.log('TreeToArr:', t8 - t7);

      if ((this.dataConfig as IPivotChartDataConfig)?.isPivotChart) {
        // 处理PivotChart双轴图0值对齐
        // this.dealWithZeroAlign();

        // 记录PivotChart维度对应的数据
        this.cacheDeminsionCollectedValues();
      }
    }
  }
  //将聚合类型注册 收集到aggregators
  registerAggregator(type: string, aggregator: any) {
    registeredAggregators[type] = aggregator;
  }
  //将聚合类型注册
  registerAggregators() {
    this.registerAggregator(AggregationType.RECORD, RecordAggregator);
    this.registerAggregator(AggregationType.SUM, SumAggregator);
    this.registerAggregator(AggregationType.COUNT, CountAggregator);
    this.registerAggregator(AggregationType.MAX, MaxAggregator);
    this.registerAggregator(AggregationType.MIN, MinAggregator);
    this.registerAggregator(AggregationType.AVG, AvgAggregator);
    this.registerAggregator(AggregationType.NONE, NoneAggregator);
    this.registerAggregator(AggregationType.RECALCULATE, RecalculateAggregator);
    this.registerAggregator(AggregationType.CUSTOM, CustomAggregator);
  }
  /**processRecord中按照collectValuesBy 收集了维度值。现在需要对有聚合需求的 处理收集维度值范围 */
  private processCollectedValuesWithSumBy() {
    for (const field in this.collectedValues) {
      if (this.collectValuesBy?.[field]?.sumBy) {
        for (const byKeys in this.collectedValues[field]) {
          let max;

          //考虑有markLine设置sum的情况
          if (this.collectValuesBy[field]?.extendRange === 'sum') {
            max = Object.values(this.collectedValues[field][byKeys]).reduce((acc, cur) => {
              return acc + cur.value();
            }, 0);
            max += Math.round(max / 20);
          } else {
            // 寻找最大值作为轴范围的max
            max = Object.values(this.collectedValues[field][byKeys]).reduce((acc, cur) => {
              return cur.value() > acc ? cur.value() : acc;
            }, Number.MIN_SAFE_INTEGER);
            //考虑有markLine设置max的情况
            if (this.collectValuesBy[field]?.extendRange === 'max') {
              max += Math.round(max / 20);
            } else if (typeof this.collectValuesBy[field]?.extendRange === 'number') {
              max = Math.max(max, this.collectValuesBy[field]?.extendRange as number);
            }
          }
          const min = Object.values(this.collectedValues[field][byKeys]).reduce((acc, cur) => {
            return cur.value() < acc ? cur.value() : acc;
          }, Number.MAX_SAFE_INTEGER);
          let positiveMax;
          let negativeMin;
          if (this.needSplitPositiveAndNegative) {
            positiveMax = Object.values(this.collectedValues[field][byKeys]).reduce((acc, cur) => {
              return cur.positiveValue() > acc ? cur.positiveValue() : acc;
            }, Number.MIN_SAFE_INTEGER);
            negativeMin = Object.values(this.collectedValues[field][byKeys]).reduce((acc, cur) => {
              return cur.negativeValue() < acc ? cur.negativeValue() : acc;
            }, Number.MAX_SAFE_INTEGER);
          }

          this.collectedValues[field][byKeys] = {};
          (
            this.collectedValues[field][byKeys] as {
              max: number;
              min: number;
              positiveMax?: number;
              negativeMin?: number;
            }
          ).max = max;
          (
            this.collectedValues[field][byKeys] as {
              max: number;
              min: number;
              positiveMax?: number;
              negativeMin?: number;
            }
          ).min = min;
          if (this.needSplitPositiveAndNegative) {
            (
              this.collectedValues[field][byKeys] as {
                max: number;
                min: number;
                positiveMax?: number;
                negativeMin?: number;
              }
            ).positiveMax = positiveMax;
            (
              this.collectedValues[field][byKeys] as {
                max: number;
                min: number;
                positiveMax?: number;
                negativeMin?: number;
              }
            ).negativeMin = negativeMin;
          }
        }
      }
    }
  }
  /**processRecord中按照collectValuesBy 收集了维度值。现在需要对有排序需求的处理 */
  private processCollectedValuesWithSortBy() {
    const that = this;
    for (const field in this.collectedValues) {
      if (this.collectValuesBy?.[field]?.sortBy) {
        for (const byKeys in this.collectedValues[field]) {
          this.collectedValues[field][byKeys] = (this.collectedValues[field][byKeys] as Array<string>).sort(
            (a, b) =>
              (that.collectValuesBy![field].sortBy?.indexOf(a) ?? -1) -
              (that.collectValuesBy![field].sortBy?.indexOf(b) ?? -1)
          );
        }
      }
    }
  }
  /**
   * 为了轴顺序的一致  这里将收集到的轴范围进行排序 并写入sortBy。这样不同单元格的轴顺序保持一致 同时过滤数据updateFilterRules后也不影响排序
   */
  private generateCollectedValuesSortRule() {
    for (const field in this.collectedValues) {
      if (this.collectValuesBy && this.collectValuesBy[field] && !this.collectValuesBy[field].sortBy) {
        let sortByRule: string[] = [];
        for (const byKeys in this.collectedValues[field]) {
          if (Array.isArray(this.collectedValues[field][byKeys])) {
            // 将数组中的元素合并到数组sortByRule中
            sortByRule.push(...(this.collectedValues[field][byKeys] as Array<string>));
            // 使用Set和Array.from()方法去除重复值
            sortByRule = Array.from(new Set(sortByRule));
          }
        }
        if (sortByRule.length > 0) {
          this.collectValuesBy[field].sortBy = sortByRule;
        }
      }
    }
  }
  /**
   * 处理数据,遍历所有条目，过滤和派生字段的处理有待优化TODO
   */
  private processRecords() {
    let isNeedFilter = false;
    if ((this.filterRules?.length ?? 0) >= 1) {
      isNeedFilter = true;
    }
    //常规records是数组的情况
    if (Array.isArray(this.records)) {
      if (!this.filteredRecords) {
        this.filteredRecords = [];
      }
      for (let i = 0, len = this.records.length; i < len; i++) {
        const record = this.records[i];
        if (!isNeedFilter || this.filterRecord(record)) {
          (this.filteredRecords as any[]).push(record);
          this.processRecord(record);
        }
      }
    } else {
      if (!this.filteredRecords) {
        this.filteredRecords = {};
      }
      //records是用户传来的按指标分组后的数据
      for (const key in this.records) {
        for (let i = 0, len = this.records[key].length; i < len; i++) {
          const record = this.records[key][i];
          if (!isNeedFilter || this.filterRecord(record)) {
            if (!(this.filteredRecords as Record<string, any[]>)[key]) {
              (this.filteredRecords as Record<string, any[]>)[key] = [];
            }
            (this.filteredRecords as Record<string, any[]>)[key].push(record);
            this.processRecord(record, key);
          }
        }
      }
    }
    this.rowFlatKeys = {};
    this.colFlatKeys = {};
  }
  private filterRecord(record: any) {
    let isReserved = true;
    if (this.filterRules) {
      for (let i = 0; i < this.filterRules.length; i++) {
        const filterRule = this.filterRules[i];
        if (filterRule.filterKey) {
          const filterValue = record[filterRule.filterKey];
          if (filterRule.filteredValues?.indexOf(filterValue) === -1) {
            isReserved = false;
            break;
          }
        } else if (!filterRule.filterFunc?.(record)) {
          isReserved = false;
          break;
        }
      }
    }
    return isReserved;
  }
  /**
   * 处理单条数据
   * @param record
   * @param assignedIndicatorKey 指定要计算的指标key  外部用户 用指标做records的key 分别存储不同指标对应的数据时 会传入这个参数
   * @returns
   */
  private processRecord(record: any, assignedIndicatorKey?: string) {
    //这个派生字段的计算位置有待确定，是否应该放到filter之前
    this.derivedFieldRules?.forEach((derivedFieldRule: DerivedFieldRule, i: number) => {
      if (derivedFieldRule.fieldName && derivedFieldRule.derivedFunc) {
        record[derivedFieldRule.fieldName] = derivedFieldRule.derivedFunc(record);
      }
    });
    //#region 按照collectValuesBy 收集维度值
    for (const field in this.collectValuesBy) {
      if (isValid(record[field])) {
        if (!this.collectedValues[field]) {
          this.collectedValues[field] = {};
        }
        const collectKeys = this.collectValuesBy[field].by.map(byField => record[byField]).join(this.stringJoinChar);
        if (!this.collectedValues[field][collectKeys]) {
          if (this.collectValuesBy[field].sumBy) {
            this.collectedValues[field][collectKeys] = {};
          } else if (this.collectValuesBy[field].range) {
            this.collectedValues[field][collectKeys] = {
              min: Number.MAX_SAFE_INTEGER,
              max: Number.MIN_SAFE_INTEGER
            };
          } else {
            this.collectedValues[field][collectKeys] = [];
          }
        }

        if (this.collectValuesBy[field].sumBy) {
          const sumByKeys: string = this.collectValuesBy[field].sumBy
            ?.map(byField => record[byField])
            .join(this.stringJoinChar);
          if (!this.collectedValues[field][collectKeys][sumByKeys]) {
            this.collectedValues[field][collectKeys][sumByKeys] = new registeredAggregators[AggregationType.SUM]({
              key: field,
              field: field,
              isRecord: undefined,
              needSplitPositiveAndNegative: this.needSplitPositiveAndNegative
            });
          }
          this.collectedValues[field][collectKeys][sumByKeys].push(record);
        } else if (this.collectValuesBy[field].range) {
          const fieldRange = this.collectedValues[field][collectKeys] as {
            max: number;
            min: number;
          };
          const max = Math.max(record[field], fieldRange.max);
          const min = Math.min(record[field], fieldRange.min);
          if (!isNaN(max)) {
            fieldRange.max = max;
            fieldRange.min = min;
          }
        } else {
          const fieldRange = this.collectedValues[field][collectKeys] as Array<string>;
          if (fieldRange.indexOf(record[field]) === -1) {
            fieldRange.push(record[field]);
          }
        }
      }
    }
    //#endregion

    let isToTalRecord = false;
    //#region 收集rowKey colKey
    // 原先的逻辑不关心customRowTree 只是根据rows 从record上收集维度path。现在考虑了rowTree和colTree的传入，需要依据colTree的真实定义的path来给数据做对应关系。
    // 一条数据可能对应多个path（多列），所以这里收集rowKeys colKeys 是个path的数组，同时兼容path中有indicatorKey和没有indicatorKey的情况
    const colKeys: { colKey: string[]; indicatorKey: string | number }[] = [];
    const rowKeys: { rowKey: string[]; indicatorKey: string | number }[] = [];

    if (
      this.parseCustomTreeToMatchRecords &&
      !(this.dataConfig as IPivotChartDataConfig)?.isPivotChart &&
      this.customRowTree?.length &&
      !assignedIndicatorKey && // 目前应该透视图才有可能传入assignedIndicatorKey  所以前面判断了isPivotChart 这个应该也没用了
      !this.hasExtensionRowTree // 有扩展树的情况不走新处理逻辑 走旧的即可
    ) {
      const rowTreePath = this.getFieldMatchRowDimensionPaths(record);
      if (rowTreePath.length > 0) {
        for (let i = 0, len = rowTreePath.length; i < len; i++) {
          const rowPath = rowTreePath[i];
          const rowKey: string[] = [];
          let indicatorKey;
          for (let j = 0, len1 = rowPath.length; j < len1; j++) {
            if (isValid(rowPath[j].indicatorKey)) {
              indicatorKey = rowPath[j].indicatorKey;
            } else {
              rowKey.push(rowPath[j].value);
            }
          }
          rowKeys.push({ rowKey, indicatorKey });
        }
      }
    } else {
      const rowKey: string[] = [];
      rowKeys.push({ rowKey, indicatorKey: assignedIndicatorKey });
      for (let l = 0, len1 = this.rows.length; l < len1; l++) {
        const rowAttr = this.rows[l];
        if (rowAttr in record) {
          this.rowsHasValue[l] = true;
          rowKey.push(record[rowAttr]);
        } else if (rowAttr !== IndicatorDimensionKeyPlaceholder) {
          //如果数据中缺失某个维度的值 可以认为是用户传入的汇总数据
          if (
            this.dataConfig?.totals?.row?.showGrandTotals &&
            l === 0 &&
            !this.rows.find((rk: string) => {
              // 判断没有其他字段在record中 例如rows中维度有省份和城市，当前在判断省份 数据中确实省份自动 可以认为是行总计的前提是城市也不应该存在
              return rk in record;
            })
          ) {
            rowKey.push(this.rowGrandTotalLabel);
            isToTalRecord = true;
            break;
          } else if (
            // this.dataConfig?.totals?.row?.showSubTotals &&
            this.dataConfig?.totals?.row?.subTotalsDimensions &&
            this.dataConfig?.totals?.row?.subTotalsDimensions.indexOf(this.rows[l - 1]) >= 0
          ) {
            if (this.rowHierarchyType !== 'tree') {
              //如果是tree的话 不附加标签'小计'
              rowKey.push(this.rowSubTotalLabel);
            }
            isToTalRecord = true;
            break;
          }
        }
      }
    }

    if (
      this.parseCustomTreeToMatchRecords &&
      !(this.dataConfig as IPivotChartDataConfig)?.isPivotChart &&
      this.customColTree?.length &&
      !assignedIndicatorKey &&
      !this.hasExtensionRowTree
    ) {
      const colTreePath = this.getFieldMatchColDimensionPaths(record);
      if (colTreePath.length > 0) {
        for (let i = 0, len = colTreePath.length; i < len; i++) {
          const colPath = colTreePath[i];
          const colKey: string[] = [];
          let indicatorKey;
          for (let j = 0, len1 = colPath.length; j < len1; j++) {
            if (isValid(colPath[j].indicatorKey)) {
              indicatorKey = colPath[j].indicatorKey;
            } else {
              colKey.push(colPath[j].value);
            }
          }
          colKeys.push({ colKey: colKey, indicatorKey });
        }
      }
    } else {
      const colKey: string[] = [];
      colKeys.push({ colKey, indicatorKey: assignedIndicatorKey });
      for (let n = 0, len2 = this.columns.length; n < len2; n++) {
        const colAttr = this.columns[n];
        if (colAttr in record) {
          this.columnsHasValue[n] = true;
          colKey.push(record[colAttr]);
        } else if (colAttr !== IndicatorDimensionKeyPlaceholder) {
          //如果数据中缺失某个维度的值 可以认为是用户传入的汇总数据
          if (
            this.dataConfig?.totals?.column?.showGrandTotals &&
            n === 0 &&
            !this.columns.find((ck: string) => {
              // 判断没有其他字段在record中
              return ck in record;
            })
          ) {
            colKey.push(this.colGrandTotalLabel);
            isToTalRecord = true;
            break;
          } else if (
            // this.dataConfig?.totals?.column?.showSubTotals &&
            this.dataConfig?.totals?.column?.subTotalsDimensions &&
            this.dataConfig?.totals?.column?.subTotalsDimensions.indexOf(this.columns[n - 1]) >= 0
          ) {
            // if (this.columnHierarchyType === 'grid') {
            colKey.push(this.colSubTotalLabel);
            // }
            isToTalRecord = true;
            break;
          }
        }
      }
    }
    //#endregion
    //#region 对path的数组 rowKeys和colKeys 做双重循环
    for (let row_i = 0; row_i < rowKeys.length; row_i++) {
      const rowKey = rowKeys[row_i].rowKey;
      let assignedIndicatorKey_value;
      if (!this.indicatorsAsCol) {
        assignedIndicatorKey_value = rowKeys[row_i].indicatorKey;
      }
      for (let col_j = 0; col_j < colKeys.length; col_j++) {
        const colKey = colKeys[col_j].colKey;
        if (this.indicatorsAsCol) {
          assignedIndicatorKey_value = colKeys[col_j].indicatorKey;
        }
        const flatRowKey = rowKey.join(this.stringJoinChar);
        const flatColKey = colKey.join(this.stringJoinChar);

        //#region 收集用户传入的汇总数据到totalRecordsTree
        //该条数据为汇总数据
        if (isToTalRecord) {
          if (!this.totalRecordsTree[flatRowKey]) {
            this.totalRecordsTree[flatRowKey] = {};
          }
          if (!this.totalRecordsTree[flatRowKey][flatColKey]) {
            this.totalRecordsTree[flatRowKey][flatColKey] = [];
          }
          const toComputeIndicatorKeys = this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys;
          for (let i = 0; i < toComputeIndicatorKeys.length; i++) {
            if (this.calculatedFiledKeys.indexOf(toComputeIndicatorKeys[i]) >= 0) {
              const calculatedFieldRule = this.calculatedFieldRules?.find(
                rule => rule.key === toComputeIndicatorKeys[i]
              );
              if (!this.totalRecordsTree[flatRowKey]?.[flatColKey]?.[i]) {
                this.totalRecordsTree[flatRowKey][flatColKey][i] = new registeredAggregators[
                  AggregationType.RECALCULATE
                ]({
                  key: toComputeIndicatorKeys[i],
                  field: toComputeIndicatorKeys[i],
                  isRecord: true,
                  // single: true,
                  formatFun: (
                    this.indicators?.find((indicator: string | IIndicator) => {
                      if (typeof indicator !== 'string') {
                        return indicator.indicatorKey === toComputeIndicatorKeys[i];
                      }
                      return false;
                    }) as IIndicator
                  )?.format,
                  calculateFun: calculatedFieldRule?.calculateFun,
                  dependAggregators: this.totalRecordsTree[flatRowKey][flatColKey],
                  dependIndicatorKeys: calculatedFieldRule?.dependIndicatorKeys
                });
              }
              toComputeIndicatorKeys[i] in record && this.totalRecordsTree[flatRowKey]?.[flatColKey]?.[i].push(record);
            } else {
              const aggRule = this.getAggregatorRule(toComputeIndicatorKeys[i]);
              if (!this.totalRecordsTree[flatRowKey]?.[flatColKey]?.[i]) {
                this.totalRecordsTree[flatRowKey][flatColKey][i] = new registeredAggregators[
                  aggRule?.aggregationType ?? AggregationType.SUM
                ]({
                  // single: true,
                  key: toComputeIndicatorKeys[i],
                  field: aggRule?.field ?? toComputeIndicatorKeys[i],
                  aggregationFun: aggRule?.aggregationFun,
                  formatFun:
                    aggRule?.formatFun ??
                    (
                      this.indicators?.find((indicator: string | IIndicator) => {
                        if (typeof indicator !== 'string') {
                          return indicator.indicatorKey === toComputeIndicatorKeys[i];
                        }
                        return false;
                      }) as IIndicator
                    )?.format
                });
              }

              //push融合了计算过程
              toComputeIndicatorKeys[i] in record && this.totalRecordsTree[flatRowKey]?.[flatColKey]?.[i].push(record);
            }
          }
          return;
        }
        //#endregion

        // 此方法判断效率很低
        // if (this.rowKeys.indexOf(rowKey) === -1) this.rowKeys.push(rowKey);
        // if (this.colKeys.indexOf(colKey) === -1) this.colKeys.push(colKey);

        // 这一段代码需要再考虑下 目前isToTalRecord中没有 this.rowKeys.push逻辑 。造成的一个问题例如有列小计的相关自定义汇总数据，但没有push到this.rowKeys中
        // 但是放到上面目前isToTalRecord逻辑return之前的话 会引起新的问题。这个this.rowKeys的补充是否需要从this.totalRecordsTree中获取到？ TODO（pivot-tree demo加上列小计就能复现）
        if (rowKey.length !== 0) {
          if (!this.rowFlatKeys[flatRowKey]) {
            this.rowKeys.push(rowKey);
            this.rowFlatKeys[flatRowKey] = 1;
          }
        }
        if (colKey.length !== 0) {
          if (!this.colFlatKeys[flatColKey]) {
            this.colKeys.push(colKey);
            this.colFlatKeys[flatColKey] = 1;
          }
        }

        //组织树结构： 行-列-单元格  行key为flatRowKey如’山东青岛‘  列key为flatColKey如’家具椅子‘
        if (!this.tree[flatRowKey]) {
          this.tree[flatRowKey] = {};
        }
        //这里改成数组 因为可能是多个指标值 遍历indicators 生成对应类型的聚合对象
        if (!this.tree[flatRowKey]?.[flatColKey]) {
          this.tree[flatRowKey][flatColKey] = [];
        }

        const toComputeIndicatorKeys = this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys;
        for (let i = 0; i < toComputeIndicatorKeys.length; i++) {
          if (this.calculatedFiledKeys.indexOf(toComputeIndicatorKeys[i]) >= 0) {
            const calculatedFieldRule = this.calculatedFieldRules?.find(rule => rule.key === toComputeIndicatorKeys[i]);
            if (!this.tree[flatRowKey]?.[flatColKey]?.[i]) {
              this.tree[flatRowKey][flatColKey][i] = new registeredAggregators[AggregationType.RECALCULATE]({
                key: toComputeIndicatorKeys[i],
                field: toComputeIndicatorKeys[i],
                isRecord: true,
                formatFun: (
                  this.indicators?.find((indicator: string | IIndicator) => {
                    if (typeof indicator !== 'string') {
                      return indicator.indicatorKey === toComputeIndicatorKeys[i];
                    }
                    return false;
                  }) as IIndicator
                )?.format,
                calculateFun: calculatedFieldRule?.calculateFun,
                dependAggregators: this.tree[flatRowKey][flatColKey],
                dependIndicatorKeys: calculatedFieldRule?.dependIndicatorKeys
              });
            }
            this.tree[flatRowKey]?.[flatColKey]?.[i].push(record);
          } else {
            const aggRule = this.getAggregatorRule(toComputeIndicatorKeys[i]);
            let needAddToAggregator = false;
            if (assignedIndicatorKey_value) {
              if (assignedIndicatorKey === assignedIndicatorKey_value) {
                // 参数传入的assignedIndicatorKey 表示records是指标已经分好组的 组里一定要加入指标聚合对象中
                toComputeIndicatorKeys[i] === assignedIndicatorKey_value && (needAddToAggregator = true);
              } else {
                toComputeIndicatorKeys[i] === assignedIndicatorKey_value &&
                  toComputeIndicatorKeys[i] in record &&
                  (needAddToAggregator = true);
              }
            }
            //加入聚合结果 考虑field为数组的情况
            else if (aggRule?.field) {
              if (typeof aggRule?.field === 'string') {
                aggRule?.field in record && (needAddToAggregator = true);
              } else {
                const isPush = aggRule?.field.find((field: string) => {
                  return field in record;
                });
                isPush && (needAddToAggregator = true);
              }
            } else {
              //push融合了计算过程
              toComputeIndicatorKeys[i] in record && (needAddToAggregator = true);
            }
            if (!this.tree[flatRowKey]?.[flatColKey]?.[i] && needAddToAggregator) {
              this.tree[flatRowKey][flatColKey][i] = new registeredAggregators[
                aggRule?.aggregationType ?? AggregationType.SUM
              ]({
                key: toComputeIndicatorKeys[i],
                field: aggRule?.field ?? toComputeIndicatorKeys[i],
                aggregationFun: aggRule?.aggregationFun,
                formatFun:
                  aggRule?.formatFun ??
                  (
                    this.indicators?.find((indicator: string | IIndicator) => {
                      if (typeof indicator !== 'string') {
                        return indicator.indicatorKey === toComputeIndicatorKeys[i];
                      }
                      return false;
                    }) as IIndicator
                  )?.format
              });
            }

            if (needAddToAggregator) {
              this.tree[flatRowKey]?.[flatColKey]?.[i].push(record);
            }
          }
        }
        //统计整体的最大最小值和总计值 共mapping使用
        if (this.mappingRules) {
          for (let i = 0; i < this.indicatorKeys.length; i++) {
            if (!this.indicatorStatistics[i]) {
              const aggRule = this.getAggregatorRule(this.indicatorKeys[i]);
              this.indicatorStatistics[i] = {
                max: new registeredAggregators[AggregationType.MAX]({
                  key: this.indicatorKeys[i],
                  field: this.indicatorKeys[i]
                }),
                min: new registeredAggregators[AggregationType.MIN]({
                  key: this.indicatorKeys[i],
                  field: this.indicatorKeys[i]
                }),
                total: new registeredAggregators[aggRule?.aggregationType ?? AggregationType.SUM]({
                  key: this.indicatorKeys[i],
                  field: aggRule?.field ?? this.indicatorKeys[i],
                  aggregationFun: aggRule?.aggregationFun,
                  formatFun:
                    aggRule?.formatFun ??
                    (
                      this.indicators?.find((indicator: string | IIndicator) => {
                        if (typeof indicator !== 'string') {
                          return indicator.indicatorKey === this.indicatorKeys[i];
                        }
                        return false;
                      }) as IIndicator
                    )?.format
                })
              };
            }
            //push融合了计算过程
            this.indicatorStatistics[i].max.push(this.tree[flatRowKey]?.[flatColKey]?.[i].value());
            this.indicatorStatistics[i].min.push(this.tree[flatRowKey]?.[flatColKey]?.[i].value());
            this.indicatorStatistics[i].total.push(record);
          }
        }
      }
    }
    //#endregion
  }
  /**
   *  TODO 需要完善TreeToArr这里的逻辑
   * 全量更新排序规则 对数据重新排序 生成行列paths
   * @param sortRules
   */
  updateSortRules(sortRules: SortRules) {
    this.sorted = false;
    this.sortRules = sortRules;
    this.sortKeys();
    //和初始化代码逻辑一致 但未考虑透视图类型
    if (!this.customRowTree) {
      if (this.rowHierarchyType === 'tree') {
        this.rowHeaderTree = this.ArrToTree1(
          this.rowKeys,
          this.rows.filter((key, index) => {
            return this.rowsHasValue[index];
          }),
          this.indicatorsAsCol ? undefined : this.indicators,
          this.totals?.row?.showGrandTotals ||
            (!this.indicatorsAsCol && this.columns.length === 0) ||
            (this.indicatorsAsCol && this.rows.length === 0),
          this.rowGrandTotalLabel,
          this.totals?.row?.showGrandTotalsOnTop ?? false
        );
      } else {
        this.rowHeaderTree = this.ArrToTree(
          this.rowKeys,
          this.rows.filter((key, index) => {
            return this.rowsHasValue[index];
          }),
          this.indicatorsAsCol ? undefined : this.indicators,
          this.rowsIsTotal,
          this.totals?.row?.showGrandTotals || (this.indicatorsAsCol && this.rows.length === 0),
          this.rowGrandTotalLabel,
          this.rowSubTotalLabel,
          this.totals?.row?.showGrandTotalsOnTop ?? false,
          this.totals?.row?.showSubTotalsOnTop ?? false
        );
      }
    }

    if (!this.customColTree) {
      this.colHeaderTree = this.ArrToTree(
        this.colKeys,
        this.columns.filter((key, index) => {
          return this.columnsHasValue[index];
        }),
        this.indicatorsAsCol ? this.indicators : undefined,
        this.colsIsTotal,
        this.totals?.column?.showGrandTotals || (!this.indicatorsAsCol && this.columns.length === 0), // || this.rows.length === 0,//todo  这里原有逻辑暂时注释掉
        this.colGrandTotalLabel,
        this.colSubTotalLabel,
        this.totals?.column?.showGrandTotalsOnLeft ?? false,
        this.totals?.column?.showSubTotalsOnLeft ?? false
      );
    }
    // this.rowKeysPath_FULL = this.TreeToArr(
    //   this.ArrToTree(
    //     this.rowKeys,
    //     this.rows,
    //     this.indicatorsAsCol ? undefined : this.indicators,
    //     this.rowsIsTotal,
    //     this?.totals?.row?.showGrandTotals || this.columns.length === 0,
    //     this.rowGrandTotalLabel,
    //     this.rowSubTotalLabel
    //   )
    // );
    // this.colKeysPath = this.TreeToArr(
    //   this.ArrToTree(
    //     this.colKeys,
    //     this.columns,
    //     this.indicatorsAsCol ? this.indicators : undefined,
    //     this.colsIsTotal,
    //     this.totals?.column?.showGrandTotals || this.rows.length === 0,
    //     this.colGrandTotalLabel,
    //     this.colSubTotalLabel
    //   )
    // );
  }
  /** 更新过滤规则 修改tree数据及收集的value */
  updateFilterRules(filterRules: FilterRules, isResetTree: boolean = false) {
    this.filterRules = filterRules;
    this.filteredRecords = undefined;
    if (isResetTree) {
      this.tree = {};
    } else {
      for (const treeRowKey in this.tree) {
        for (const treeColKey in this.tree[treeRowKey]) {
          for (let i = 0; i < this.tree[treeRowKey][treeColKey].length; i++) {
            this.tree[treeRowKey][treeColKey][i]?.reset();
          }
        }
      }
    }
    this.collectedValues = {};
    this.processRecords();
    this.processCollectedValuesWithSumBy();
    this.processCollectedValuesWithSortBy();
    this.totalStatistics();
    if ((this.dataConfig as IPivotChartDataConfig)?.isPivotChart) {
      // 处理PivotChart双轴图0值对齐
      // this.dealWithZeroAlign();
      // 记录PivotChart维度对应的数据
      this.cacheDeminsionCollectedValues();
    }
  }
  private getAggregatorRule(indicatorKey: string): AggregationRule<AggregationType> | undefined {
    return this.aggregationRules?.find((value: AggregationRule<AggregationType>, index: number) => {
      return indicatorKey === value.indicatorKey;
    });
  }
  /**
   * 根据行列的维度key 获取聚合对象
   * @param rowKey
   * @param colKey
   * @param indicator
   * @returns
   */
  getAggregator(
    rowKey: string[] | string = [],
    colKey: string[] | string = [],
    indicator: string,
    considerChangedValue: boolean = true,
    indicatorPosition?: { position: 'col' | 'row'; index?: number }
  ): IAggregator {
    const indicatorIndex = this.indicatorKeys.indexOf(indicator);
    // let agg;
    let flatRowKey;
    let flatColKey;
    if (typeof rowKey === 'string') {
      flatRowKey = rowKey;
    } else {
      //考虑 指标key有可能在数组中间位置或者前面的可能 将其删除再添加到尾部
      if (!indicatorPosition || indicatorPosition.position === 'row') {
        rowKey.map((key, i) => {
          if (key === indicator && (!isValid(indicatorPosition?.index) || i === indicatorPosition.index)) {
            rowKey.splice(i, 1);
          }
        });
      }
      if (rowKey.length < this.rows.length && this.rowHierarchyType === 'grid-tree') {
        // 如果是平铺树结构 小计需要处理补充到rowKey中
        if (rowKey[0] === this.rowGrandTotalLabel) {
        } else if (
          this.totals?.row?.subTotalsDimensions &&
          this.totals?.row?.subTotalsDimensions?.length >= 1 &&
          rowKey[rowKey.length - 1] !== this.rowSubTotalLabel
        ) {
          rowKey.push(this.rowSubTotalLabel);
        }
      }
      // flatRowKey = rowKey.join(this.stringJoinChar);
      flatRowKey = join(rowKey, this.stringJoinChar);
    }

    if (typeof colKey === 'string') {
      flatColKey = colKey;
    } else {
      //考虑 指标key有可能在数组中间位置或者前面的可能 将其删除再添加到尾部
      if (!indicatorPosition || indicatorPosition.position === 'col') {
        colKey.map((key, i) => {
          if (key === indicator && (!isValid(indicatorPosition?.index) || i === indicatorPosition.index)) {
            colKey.splice(i, 1);
          }
        });
      }
      if (colKey.length < this.columns.length && this.columnHierarchyType === 'grid-tree') {
        if (colKey[0] === this.colGrandTotalLabel) {
        } else if (
          this.totals?.column?.subTotalsDimensions &&
          this.totals?.column?.subTotalsDimensions?.length >= 1 &&
          colKey[colKey.length - 1] !== this.colSubTotalLabel
        ) {
          colKey.push(this.colSubTotalLabel);
        }
      }
      // flatColKey = colKey.join(this.stringJoinChar);
      flatColKey = join(colKey, this.stringJoinChar);
    }
    //TODO 原有逻辑 但这里先强制跳过
    // if ( rowKey.length === 0 && colKey.length === 0) {
    // agg = this.allTotal;
    // } else if (rowKey.length === 0) {
    //   // agg = this.tree.total[flatColKey]?.[sortByIndicatorIndex];
    //   agg = this.colTotals[flatColKey]?.[sortByIndicatorIndex];
    // } else if (colKey.length === 0) {
    //   // agg = this.tree[flatRowKey].total?.[sortByIndicatorIndex];
    //   agg = this.rowTotals[flatRowKey]?.[sortByIndicatorIndex];
    // } else {
    const agg = this.tree[flatRowKey]?.[flatColKey]?.[indicatorIndex];
    if (considerChangedValue && isValid(this.changedTree[flatRowKey]?.[flatColKey]?.[indicatorIndex])) {
      const changeValue = this.changedTree[flatRowKey][flatColKey][indicatorIndex];
      if (agg) {
        return {
          value: () => {
            return changeValue;
          },
          formatValue: agg.formatValue,
          formatFun: agg.formatFun,
          records: agg.records,
          recalculate() {
            // do nothing
          },
          push() {
            // do nothing
          },
          deleteRecord() {
            // do nothing
          },
          updateRecord() {
            // do nothing
          },
          clearCacheValue() {
            // do nothing
          },
          reset() {
            // do nothing
          }
        };
        // agg.clearCacheValue();
        // agg.value = () => { // 你们直接在原来的agg上赋值 会影响获取原始值的获取
        //   return changeValue;
        // };
      }
      return {
        records: [],
        value() {
          return changeValue;
        },
        push() {
          // do nothing
        },
        deleteRecord() {
          // do nothing
        },
        updateRecord() {
          // do nothing
        },
        recalculate() {
          // do nothing
        },
        formatValue() {
          return changeValue;
        },
        clearCacheValue() {
          // do nothing
        },
        reset() {
          // do nothing
        }
      };
    }

    // }
    return agg
      ? agg
      : {
          records: [],
          push() {
            // do nothing
          },
          deleteRecord() {
            // do nothing
          },
          updateRecord() {
            // do nothing
          },
          recalculate() {
            // do nothing
          },
          value(): any {
            return null;
          },
          clearCacheValue() {
            // do nothing
          },
          reset() {
            // do nothing
          }
        };
  }
  /**
   * 根据排序规则 对维度keys排序
   */
  sortKeys() {
    this.colKeys = this.colKeys_normal.slice();
    this.rowKeys = this.rowKeys_normal.slice();
    const that = this;
    if (!this.sorted) {
      this.sorted = true;
      // const getValue = function (rowKey: any, colKey: any) {
      //   return that.getAggregator(rowKey, colKey, '').value();
      // };

      // switch (this.rowOrder) {
      //   case 'value_a_to_z':
      //     this.rowKeys.sort(function (a, b) {
      //       return naturalSort(getValue(a, []), getValue(b, []));
      //     });
      //     break;
      //   case 'value_z_to_a':
      //     this.rowKeys.sort(function (a, b) {
      //       return -naturalSort(getValue(a, []), getValue(b, []));
      //     });
      //     break;
      //   default:
      this.rowKeys.sort(this.arrSort(this.rows, true));
      // }
      // switch (this.colOrder) {
      //   case 'value_a_to_z':
      //     this.colKeys.sort(function (a, b) {
      //       return naturalSort(getValue([], a), getValue([], b));
      //     });
      //     break;
      //   case 'value_z_to_a':
      //     this.colKeys.sort(function (a, b) {
      //       return -naturalSort(getValue([], a), getValue([], b));
      //     });
      //     break;
      //   default:
      const sortfun = this.arrSort(this.columns, false);
      this.colKeys.sort(sortfun);
      // }
    }
  }
  /**
   * 生成排序函数 综合配置的多条排序规则
   * @param fieldArr 排序维度名称 如行rows 列columns
   * @returns
   */
  arrSort(fieldArr: string[], isRow: boolean) {
    let field;
    const that = this;
    const sortersArr: any[] = function (_this: any) {
      const results: any = [];
      for (let l = 0, len1 = fieldArr.length; l < len1; l++) {
        field = fieldArr[l];
        let isHasSortRule = false;
        if (that.sortRules) {
          for (let m = 0, len2 = that.sortRules.length; m < len2; m++) {
            if (that.sortRules[m].sortField === field) {
              isHasSortRule = true;
              results.push({
                field,
                fieldIndex: l,
                sortRule: that.sortRules[m],
                func: that.getSort(that.sortRules[m], isRow)
              });

              // if (that.sortRules[m].sortByIndicator) {
              //   isHasSortRule = true;
              //   results.push({
              //     field,
              //     fieldIndex: l,
              //     sortRule: that.sortRules[m],
              //     func: that.getSort(that.sortRules[m], field),
              //   });
              // }
            }
          }
        }
        // 去掉内部默认排序
        // if (!isHasSortRule) {
        //   results.push({ field, fieldIndex: l, func: naturalSort });
        // }
      }
      return results;
    }.call(this);
    return function (a: string[], b: string[]) {
      let comparison;
      let sorter;
      for (let i = 0; i < sortersArr.length; i++) {
        sorter = sortersArr[i];
        // if (!(sorter.sortRule?.sortType === SortType.NORMAL || sorter.sortRule?.sortType === SortType.normal)) {
        if (sorter.sortRule?.sortByIndicator) {
          let aChanged = a;
          let bChanged = b;
          if (sorter.fieldIndex < fieldArr.length - 1) {
            aChanged = a.slice(0, sorter.fieldIndex + 1);
            if (that.rowHierarchyType === 'grid' && isRow) {
              aChanged.push(that.rowSubTotalLabel);
            } else if (!isRow) {
              aChanged.push(that.colSubTotalLabel);
            }
            bChanged = b.slice(0, sorter.fieldIndex + 1);
            if (that.rowHierarchyType === 'grid' && isRow) {
              bChanged.push(that.rowSubTotalLabel);
            } else if (!isRow) {
              bChanged.push(that.colSubTotalLabel);
            }
          }
          comparison = sorter.func(aChanged, bChanged, sorter.sortRule?.sortType);
        } else {
          comparison = sorter.func?.(a[sorter.fieldIndex], b[sorter.fieldIndex], sorter.sortRule?.sortType);
        }
        if (comparison !== 0) {
          return comparison;
          // return (
          //   comparison *
          //   (sorter.sortRule?.sortType === SortType.DESC || sorter.sortRule?.sortType === SortType.desc ? -1 : 1)
          // );
        }
      }
      return 0;
    };
  }
  /**
   * 根据具体排序 获取不同的排序函数
   * @param sortRule
   * @returns
   */
  getSort(sortRule: SortRule, isSortRow: boolean) {
    const that = this;

    if ((<SortByIndicatorRule>sortRule).sortByIndicator) {
      return (a: string[], b: string[], sortType?: SortType) => {
        /**
         * 根据rowKey和colKey获取tree上对应的聚合值
         * @param rowKey
         * @param colKey
         * @returns
         */
        const getValue = function (rowKey: any, colKey: any) {
          //如果rowKey提供的不全 如 [地区,省,城市] 只提供了如[华东,山东] 会补全为[华东,山东,小计]
          if (
            that.rowHierarchyType === 'grid' &&
            rowKey.length < that.rows.length &&
            rowKey[rowKey.length - 1] !== that.rowSubTotalLabel &&
            rowKey[rowKey.length - 1] !== that.rowGrandTotalLabel
          ) {
            rowKey.push(that.rowSubTotalLabel);
          }
          if (
            colKey.length < that.columns.length &&
            colKey[colKey.length - 1] !== that.colSubTotalLabel &&
            colKey[colKey.length - 1] !== that.colGrandTotalLabel
          ) {
            colKey.push(that.colSubTotalLabel);
          }
          return that.getAggregator(rowKey, colKey, (<SortByIndicatorRule>sortRule).sortByIndicator!).value();
        };
        if (isSortRow) {
          return naturalSort(
            getValue(a, (<SortByIndicatorRule>sortRule).query),
            getValue(b, (<SortByIndicatorRule>sortRule).query),
            sortType
          );
        }
        return naturalSort(
          getValue((<SortByIndicatorRule>sortRule).query, a),
          getValue((<SortByIndicatorRule>sortRule).query, b),
          sortType
        );
      };
    } else if ((<SortByRule>sortRule).sortBy) {
      return sortBy((<SortByRule>sortRule).sortBy);
    }

    if ((<SortFuncRule>sortRule).sortFunc) {
      return (<SortFuncRule>sortRule).sortFunc;
    }
    if ((<SortTypeRule>sortRule).sortType) {
      return typeSort;
    }
    return naturalSort;
  }
  /**
   * 汇总小计
   */
  totalStatistics() {
    const that = this;
    /**
     * 计算每一行的所有列的汇总值
     * @param flatRowKey
     * @param flatColKey
     */
    const colCompute = (flatRowKey: string, flatColKey: string) => {
      if (this.totalRecordsTree?.[flatRowKey]?.[flatColKey]) {
        // 利用汇总数据替换
        if (!this.tree[flatRowKey]) {
          this.tree[flatRowKey] = {};
        }
        this.tree[flatRowKey][flatColKey] = this.totalRecordsTree?.[flatRowKey]?.[flatColKey];
        return;
      }
      const colKey = flatColKey.split(this.stringJoinChar);
      if (
        that.totals?.column?.subTotalsDimensions &&
        that.totals?.column?.subTotalsDimensions?.length > 0 &&
        that.totals.column.showSubTotals !== false
      ) {
        for (let i = 0, len = that.totals?.column?.subTotalsDimensions?.length; i < len; i++) {
          const dimension = that.totals.column.subTotalsDimensions[i];
          const dimensionIndex = that.columns.indexOf(dimension);
          if (dimensionIndex >= 0) {
            const colTotalKey = colKey.slice(0, dimensionIndex + 1);
            // if (this.columnHierarchyType === 'grid') {
            colTotalKey.push(that.colSubTotalLabel);
            // }
            const flatColTotalKey = colTotalKey.join(this.stringJoinChar);
            if (this.totalRecordsTree?.[flatRowKey]?.[flatColTotalKey]) {
              // 利用汇总数据替换
              this.tree[flatRowKey][flatColTotalKey] = this.totalRecordsTree?.[flatRowKey]?.[flatColTotalKey];
              return;
            }
            if (!this.tree[flatRowKey][flatColTotalKey]) {
              this.tree[flatRowKey][flatColTotalKey] = [];
            }
            const toComputeIndicatorKeys = this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys;

            for (let i = 0; i < toComputeIndicatorKeys.length; i++) {
              if (this.calculatedFiledKeys.indexOf(toComputeIndicatorKeys[i]) >= 0) {
                const calculatedFieldRule = this.calculatedFieldRules?.find(
                  rule => rule.key === toComputeIndicatorKeys[i]
                );
                if (!this.tree[flatRowKey]?.[flatColTotalKey]?.[i]) {
                  this.tree[flatRowKey][flatColTotalKey][i] = new registeredAggregators[AggregationType.RECALCULATE]({
                    key: toComputeIndicatorKeys[i],
                    field: toComputeIndicatorKeys[i],
                    isRecord: true,
                    formatFun: (
                      this.indicators?.find((indicator: string | IIndicator) => {
                        if (typeof indicator !== 'string') {
                          return indicator.indicatorKey === toComputeIndicatorKeys[i];
                        }
                        return false;
                      }) as IIndicator
                    )?.format,
                    calculateFun: calculatedFieldRule?.calculateFun,
                    dependAggregators: this.tree[flatRowKey][flatColTotalKey],
                    dependIndicatorKeys: calculatedFieldRule?.dependIndicatorKeys
                  });
                }
                if (flatColTotalKey !== flatColKey) {
                  this.tree[flatRowKey][flatColTotalKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
                }
              } else {
                if (!this.tree[flatRowKey][flatColTotalKey][i]) {
                  const aggRule = this.getAggregatorRule(toComputeIndicatorKeys[i]);
                  this.tree[flatRowKey][flatColTotalKey][i] = new registeredAggregators[
                    aggRule?.aggregationType ?? AggregationType.SUM
                  ]({
                    key: toComputeIndicatorKeys[i],
                    field: aggRule?.field ?? toComputeIndicatorKeys[i],
                    aggregationFun: aggRule?.aggregationFun,
                    formatFun:
                      aggRule?.formatFun ??
                      (
                        this.indicators?.find((indicator: string | IIndicator) => {
                          if (typeof indicator !== 'string') {
                            return indicator.indicatorKey === toComputeIndicatorKeys[i];
                          }
                          return false;
                        }) as IIndicator
                      )?.format
                  });
                }
                if (flatColTotalKey !== flatColKey) {
                  this.tree[flatRowKey][flatColTotalKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
                }
              }
            }
          }
        }
      }
      if (that.totals?.column?.showGrandTotals || this.rows.length === 0) {
        const flatColTotalKey = that.colGrandTotalLabel;
        if (this.totalRecordsTree?.[flatRowKey]?.[flatColTotalKey]) {
          // 利用汇总数据替换
          this.tree[flatRowKey][flatColTotalKey] = this.totalRecordsTree?.[flatRowKey]?.[flatColTotalKey];
          return;
        }
        if (!this.tree[flatRowKey][flatColTotalKey]) {
          this.tree[flatRowKey][flatColTotalKey] = [];
        }
        const toComputeIndicatorKeys = this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys;
        for (let i = 0; i < toComputeIndicatorKeys.length; i++) {
          if (this.calculatedFiledKeys.indexOf(toComputeIndicatorKeys[i]) >= 0) {
            const calculatedFieldRule = this.calculatedFieldRules?.find(rule => rule.key === toComputeIndicatorKeys[i]);
            if (!this.tree[flatRowKey]?.[flatColTotalKey]?.[i]) {
              this.tree[flatRowKey][flatColTotalKey][i] = new registeredAggregators[AggregationType.RECALCULATE]({
                key: toComputeIndicatorKeys[i],
                field: toComputeIndicatorKeys[i],
                isRecord: true,
                formatFun: (
                  this.indicators?.find((indicator: string | IIndicator) => {
                    if (typeof indicator !== 'string') {
                      return indicator.indicatorKey === toComputeIndicatorKeys[i];
                    }
                    return false;
                  }) as IIndicator
                )?.format,
                calculateFun: calculatedFieldRule?.calculateFun,
                dependAggregators: this.tree[flatRowKey][flatColTotalKey],
                dependIndicatorKeys: calculatedFieldRule?.dependIndicatorKeys
              });
            }
            if (flatColTotalKey !== flatColKey) {
              this.tree[flatRowKey][flatColTotalKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
            }
          } else {
            if (!this.tree[flatRowKey][flatColTotalKey][i]) {
              const aggRule = this.getAggregatorRule(toComputeIndicatorKeys[i]);
              this.tree[flatRowKey][flatColTotalKey][i] = new registeredAggregators[
                aggRule?.aggregationType ?? AggregationType.SUM
              ]({
                key: toComputeIndicatorKeys[i],
                field: aggRule?.field ?? toComputeIndicatorKeys[i],
                formatFun:
                  aggRule?.formatFun ??
                  (
                    this.indicators?.find((indicator: string | IIndicator) => {
                      if (typeof indicator !== 'string') {
                        return indicator.indicatorKey === toComputeIndicatorKeys[i];
                      }
                      return false;
                    }) as IIndicator
                  )?.format
              });
            }
            if (flatColTotalKey !== flatColKey) {
              this.tree[flatRowKey][flatColTotalKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
            }
          }
        }
      }
    };

    if (
      (that?.totals?.column?.subTotalsDimensions && that?.totals?.column?.subTotalsDimensions?.length >= 1) ||
      (that?.totals?.row?.subTotalsDimensions && that?.totals?.row?.subTotalsDimensions?.length >= 1) ||
      that?.totals?.column?.showGrandTotals ||
      that?.totals?.row?.showGrandTotals
      // ||
      // that.rows.length === 0 || //todo  这里原有逻辑暂时注释掉
      // that.columns.length === 0
    ) {
      const rowTotalKeys: string[] = [];

      Object.keys(that.tree).forEach(flatRowKey => {
        const rowKey = flatRowKey.split(this.stringJoinChar);
        Object.keys(that.tree[flatRowKey]).forEach(flatColKey => {
          if (
            that.totals?.row?.subTotalsDimensions &&
            that.totals?.row?.subTotalsDimensions?.length > 0 &&
            that.totals.row.showSubTotals !== false
          ) {
            for (let i = 0, len = that.totals?.row?.subTotalsDimensions?.length; i < len; i++) {
              const dimension = that.totals.row.subTotalsDimensions[i];
              const dimensionIndex = that.rows.indexOf(dimension);
              if (dimensionIndex >= 0 && dimensionIndex < that.rows.length - 1) {
                const rowTotalKey = rowKey.slice(0, dimensionIndex + 1);
                if (this.rowHierarchyType !== 'tree') {
                  // 如果是tree的情况则不追加小计单元格值
                  rowTotalKey.push(that.rowSubTotalLabel);
                }
                const flatRowTotalKey = rowTotalKey.join(this.stringJoinChar);
                if (!this.tree[flatRowTotalKey]) {
                  this.tree[flatRowTotalKey] = {};
                  rowTotalKeys.push(flatRowTotalKey);
                }
                if (!this.tree[flatRowTotalKey][flatColKey]) {
                  this.tree[flatRowTotalKey][flatColKey] = [];
                }
                const toComputeIndicatorKeys = this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys;
                for (let i = 0; i < toComputeIndicatorKeys.length; i++) {
                  if (!this.tree[flatRowTotalKey][flatColKey][i]) {
                    if (this.calculatedFiledKeys.indexOf(toComputeIndicatorKeys[i]) >= 0) {
                      const calculatedFieldRule = this.calculatedFieldRules?.find(
                        rule => rule.key === toComputeIndicatorKeys[i]
                      );
                      this.tree[flatRowTotalKey][flatColKey][i] = new registeredAggregators[
                        AggregationType.RECALCULATE
                      ]({
                        key: toComputeIndicatorKeys[i],
                        field: toComputeIndicatorKeys[i],
                        isRecord: true,
                        formatFun: (
                          this.indicators?.find((indicator: string | IIndicator) => {
                            if (typeof indicator !== 'string') {
                              return indicator.indicatorKey === toComputeIndicatorKeys[i];
                            }
                            return false;
                          }) as IIndicator
                        )?.format,
                        calculateFun: calculatedFieldRule?.calculateFun,
                        dependAggregators: this.tree[flatRowTotalKey][flatColKey],
                        dependIndicatorKeys: calculatedFieldRule?.dependIndicatorKeys
                      });
                    } else {
                      const aggRule = this.getAggregatorRule(toComputeIndicatorKeys[i]);
                      this.tree[flatRowTotalKey][flatColKey][i] = new registeredAggregators[
                        aggRule?.aggregationType ?? AggregationType.SUM
                      ]({
                        key: toComputeIndicatorKeys[i],
                        field: aggRule?.field ?? toComputeIndicatorKeys[i],
                        formatFun:
                          aggRule?.formatFun ??
                          (
                            this.indicators?.find((indicator: string | IIndicator) => {
                              if (typeof indicator !== 'string') {
                                return indicator.indicatorKey === toComputeIndicatorKeys[i];
                              }
                              return false;
                            }) as IIndicator
                          )?.format
                      });
                    }
                  }
                  if (flatRowTotalKey !== flatRowKey) {
                    this.tree[flatRowTotalKey][flatColKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
                  }
                }
              }
            }
          }

          if (that.totals?.row?.showGrandTotals || this.columns.length === 0) {
            const flatRowTotalKey = that.rowGrandTotalLabel;
            if (!this.tree[flatRowTotalKey]) {
              this.tree[flatRowTotalKey] = {};
              rowTotalKeys.push(flatRowTotalKey);
            }
            if (!this.tree[flatRowTotalKey][flatColKey]) {
              this.tree[flatRowTotalKey][flatColKey] = [];
            }
            const toComputeIndicatorKeys = this.indicatorKeysIncludeCalculatedFieldDependIndicatorKeys;
            for (let i = 0; i < toComputeIndicatorKeys.length; i++) {
              if (!this.tree[flatRowTotalKey][flatColKey][i]) {
                if (this.calculatedFiledKeys.indexOf(toComputeIndicatorKeys[i]) >= 0) {
                  const calculatedFieldRule = this.calculatedFieldRules?.find(
                    rule => rule.key === toComputeIndicatorKeys[i]
                  );
                  this.tree[flatRowTotalKey][flatColKey][i] = new registeredAggregators[AggregationType.RECALCULATE]({
                    key: toComputeIndicatorKeys[i],
                    field: toComputeIndicatorKeys[i],
                    isRecord: true,
                    formatFun: (
                      this.indicators?.find((indicator: string | IIndicator) => {
                        if (typeof indicator !== 'string') {
                          return indicator.indicatorKey === toComputeIndicatorKeys[i];
                        }
                        return false;
                      }) as IIndicator
                    )?.format,
                    calculateFun: calculatedFieldRule?.calculateFun,
                    dependAggregators: this.tree[flatRowTotalKey][flatColKey],
                    dependIndicatorKeys: calculatedFieldRule?.dependIndicatorKeys
                  });
                } else {
                  const aggRule = this.getAggregatorRule(toComputeIndicatorKeys[i]);
                  this.tree[flatRowTotalKey][flatColKey][i] = new registeredAggregators[
                    aggRule?.aggregationType ?? AggregationType.SUM
                  ]({
                    key: toComputeIndicatorKeys[i],
                    field: aggRule?.field ?? toComputeIndicatorKeys[i],
                    formatFun:
                      aggRule?.formatFun ??
                      (
                        this.indicators?.find((indicator: string | IIndicator) => {
                          if (typeof indicator !== 'string') {
                            return indicator.indicatorKey === toComputeIndicatorKeys[i];
                          }
                          return false;
                        }) as IIndicator
                      )?.format
                  });
                }
              }
              if (flatRowTotalKey !== flatRowKey) {
                this.tree[flatRowTotalKey][flatColKey][i].push(that.tree[flatRowKey]?.[flatColKey]?.[i]);
              }
            }
          }
          colCompute(flatRowKey, flatColKey);
        });
      });
      //增加出来的rowTotalKeys 再遍历一次 汇总小计的小计 如 东北小计（row）-办公用品小计（col）所指单元格的值
      rowTotalKeys.forEach(flatRowKey => {
        Object.keys(that.tree[flatRowKey]).forEach(flatColKey => {
          colCompute(flatRowKey, flatColKey);

          // //处理 row-sub-total  中没有col-sub-total的情况
          // if (
          //   that.totals?.column?.subTotalsDimensions &&
          //   that.totals?.column?.subTotalsDimensions?.length > 0 &&
          //   that.totals.column.showSubTotals !== false
          // ) {
          //   const colKey = flatColKey.split(this.stringJoinChar);
          //   for (let i = 0, len = that.totals?.column?.subTotalsDimensions?.length; i < len; i++) {
          //     const dimension = that.totals.column.subTotalsDimensions[i];
          //     const dimensionIndex = that.columns.indexOf(dimension);
          //     if (dimensionIndex >= 0) {
          //       const colTotalKey = colKey.slice(0, dimensionIndex + 1);
          //       colTotalKey.push(that.colSubTotalLabel);
          //       const flatColTotalKey = colTotalKey.join(this.stringJoinChar);
          //       if (!this.tree[flatRowKey][flatColTotalKey]) {
          //         colCompute(flatRowKey, flatColTotalKey);
          //       }
          //     }
          //   }
          // }
        });
        // //处理 row-total  中没有col-total的情况
        // if (that.totals?.column?.showGrandTotals || this.rows.length === 0) {
        //   const flatColTotalKey = that.colGrandTotalLabel;
        //   if (!this.tree[flatRowKey][flatColTotalKey]) {
        //     colCompute(flatRowKey, flatColTotalKey);
        //   }
        // }
      });
    }
    // else if (that.rowHierarchyType === 'tree') {
    // for (const flatRowKey in that.totalRecordsTree) {
    //   for (const flatColKey in that.totalRecordsTree[flatRowKey]) {
    //     colCompute(flatRowKey, flatColKey);
    //   }
    // }
    // }
    for (const flatRowKey in that.totalRecordsTree) {
      for (const flatColKey in that.totalRecordsTree[flatRowKey]) {
        colCompute(flatRowKey, flatColKey);
      }
    }
  }
  /**
   * 将rowKeys和colKeys 转为树形结构
   * @param arr
   * @returns
   */
  private ArrToTree1(
    arr: string[][],
    rows: string[],
    indicators: (string | IIndicator)[] | undefined,
    isGrandTotal: boolean,
    grandTotalLabel: string,
    showGrandTotalsOnTop: boolean
  ) {
    /**
     *
     * @param {string} s 父级id
     * @param {number} n 需转换数字
     */
    // const getId = (pId: any, curId: any) => `${pId}$${curId}`;
    const result: any[] = []; // 结果
    const concatStr = this.stringJoinChar; // 连接符(随便写，保证key唯一性就OK)
    const map = new Map(); // 存储根节点 主要提升性能
    function addList(list: any, isGrandTotal: boolean) {
      const path: any[] = []; // 路径
      let node: any; // 当前节点
      list.forEach((value: any, index: number) => {
        path.push(value);
        const flatKey = path.join(concatStr);
        //id的值可以每次生成一个新的 这里用的path作为id 方便layout对象获取
        let item: { value: string; dimensionKey: string; children: any[] | undefined } = map.get(flatKey); // 当前节点
        if (!item) {
          item = {
            value,
            // id: flatKey, //getId(node?.id ?? '', (node?.children?.length ?? result.length) + 1),
            dimensionKey: rows[index],
            //树的叶子节点补充指标
            children:
              index === list.length - 1 && (indicators?.length ?? 0) >= 1
                ? indicators?.map(indicator => {
                    if (typeof indicator === 'string') {
                      return {
                        indicatorKey: indicator,
                        value: indicator
                      };
                    }
                    return {
                      indicatorKey: indicator.indicatorKey,
                      value: indicator.title
                    };
                  })
                : []
          };

          map.set(flatKey, item); // 存储路径对应的节点
          if (node) {
            node.children.push(item);
          } else {
            if (showGrandTotalsOnTop && isGrandTotal) {
              result.unshift(item);
            } else {
              result.push(item);
            }
          }
        }
        node = item; // 更新当前节点
      });
    }

    arr.forEach(item => addList(item, false));
    if (isGrandTotal) {
      addList([grandTotalLabel], isGrandTotal);
    }
    return result;
  }
  /**
   * 将rowKeys和colKeys 转为树形结构
   * @param arr
   * @param subTotalFlags 标志小计的维度
   * @returns
   */
  private ArrToTree(
    arr: string[][],
    rows: string[],
    indicators: (string | IIndicator)[] | undefined,
    subTotalFlags: boolean[],
    isGrandTotal: boolean,
    grandTotalLabel: string,
    subTotalLabel: string,
    showGrandTotalsOnTop: boolean,
    showSubTotalsOnTop: boolean
  ) {
    /**
     *
     * @param {string} s 父级id
     * @param {number} n 需转换数字
     */
    // const getId = (pId: any, curId: any) => `${pId}$${curId}`;
    let result: any[] = []; // 结果
    const concatStr = this.stringJoinChar; // 连接符(随便写，保证key唯一性就OK)
    const map = new Map(); // 存储根节点 主要提升性能
    function addList(list: any) {
      const path: any[] = []; // 路径
      let node: any; // 当前节点
      list.forEach((value: any, index: number) => {
        path.push(value);
        const flatKey = path.join(concatStr);
        //id的值可以每次生成一个新的 这里用的path作为id 方便layout对象获取
        let item: { value: string; dimensionKey: string; children: any[] | undefined } = map.get(flatKey); // 当前节点
        if (!item) {
          item = {
            value,
            dimensionKey: rows[index],
            // id: flatKey, //getId(node?.id ?? '', (node?.children?.length ?? result.length) + 1),
            //树的叶子节点补充指标
            children:
              index === list.length - 1 && (indicators?.length ?? 0) >= 1
                ? indicators?.map(indicator => {
                    if (typeof indicator === 'string') {
                      return {
                        indicatorKey: indicator,
                        value: indicator
                      };
                    }
                    return {
                      indicatorKey: indicator.indicatorKey,
                      value: indicator.title
                    };
                  })
                : []
          };
          if (subTotalFlags[index]) {
            let curChild = item.children ?? [];
            // for (let i = index; i < list.length - 1; i++) {
            const totalChild: { value: string; dimensionKey: string; children: any[] | undefined; levelSpan: number } =
              {
                value: subTotalLabel,
                dimensionKey: rows[index + 1],
                levelSpan: subTotalFlags.length - index - 1,
                // id: `${flatKey}${concatStr}${subTotalLabel}`, // getId(item?.id, 1),
                //树的叶子节点补充指标
                children:
                  // i + 1 === list.length - 1 &&
                  (indicators?.length ?? 0) >= 1
                    ? indicators?.map(indicator => {
                        if (typeof indicator === 'string') {
                          return {
                            indicatorKey: indicator,
                            value: indicator
                          };
                        }
                        return {
                          indicatorKey: indicator.indicatorKey,
                          value: indicator.title
                        };
                      })
                    : []
              };

            curChild.push(totalChild);

            curChild = totalChild.children ?? [];

            // }
          }
          map.set(flatKey, item); // 存储路径对应的节点
          if (node) {
            //为了确保汇总小计放到最后 使用splice插入到倒数第二个位置。如果小计放前面 直接push就行
            if (subTotalFlags[index - 1] && !showSubTotalsOnTop) {
              node.children.splice(node.children.length - 1, 0, item);
            } else {
              node.children.push(item);
            }
          } else {
            result.push(item);
          }
        }
        node = item; // 更新当前节点
      });
    }
    if (arr?.length) {
      arr.forEach(item => addList(item));
    } else if (indicators) {
      result = indicators?.map((indicator: IIndicator | string): { indicatorKey: string; value: string } => {
        if (typeof indicator === 'string') {
          return { indicatorKey: indicator, value: indicator };
        }
        return { indicatorKey: indicator.indicatorKey, value: indicator.title ?? indicator.indicatorKey };
      });
    }
    //最后将总计的节点加上
    if (isGrandTotal && arr?.length) {
      const node: { value: string; dimensionKey: string; children: any[]; levelSpan: number } = {
        value: grandTotalLabel, // getId(item?.id, 1),
        dimensionKey: rows[0],
        levelSpan: subTotalFlags.length,
        children:
          indicators?.map(indicator => {
            if (typeof indicator === 'string') {
              return {
                indicatorKey: indicator,
                value: indicator
              };
            }
            return {
              indicatorKey: indicator.indicatorKey,
              value: indicator.title
            };
          }) ?? []
      };
      if (showGrandTotalsOnTop) {
        result.unshift(node);
      } else {
        result.push(node);
      }
    }
    return result;
  }

  private cacheDeminsionCollectedValues() {
    for (const key in this.collectValuesBy) {
      if (this.collectValuesBy[key].type === 'xField' || this.collectValuesBy[key].type === 'yField') {
        if ((this.dataConfig as IPivotChartDataConfig).dimensionSortArray) {
          this.cacheCollectedValues[key] = arraySortByAnotherArray(
            this.collectedValues[key] as unknown as string[],
            (this.dataConfig as IPivotChartDataConfig).dimensionSortArray!
          ) as unknown as Record<string, CollectedValue>;
        } else {
          this.cacheCollectedValues[key] = this.collectedValues[key];
        }
      }
    }
  }

  changeTreeNodeValue(
    rowKey: string[] | string = [],
    colKey: string[] | string = [],
    indicator: string,
    newValue: string | number
  ) {
    const indicatorIndex = this.indicatorKeys.indexOf(indicator);

    let flatRowKey;
    let flatColKey;
    if (typeof rowKey === 'string') {
      flatRowKey = rowKey;
    } else {
      flatRowKey = rowKey.join(this.stringJoinChar);
    }

    if (typeof colKey === 'string') {
      flatColKey = colKey;
    } else {
      flatColKey = colKey.join(this.stringJoinChar);
    }

    if (this.changedTree[flatRowKey]?.[flatColKey]) {
      this.changedTree[flatRowKey][flatColKey][indicatorIndex] = newValue;
    } else if (this.changedTree[flatRowKey]) {
      this.changedTree[flatRowKey][flatColKey] = [];
      this.changedTree[flatRowKey][flatColKey][indicatorIndex] = newValue;
    } else {
      this.changedTree[flatRowKey] = {};
      this.changedTree[flatRowKey][flatColKey] = [];
      this.changedTree[flatRowKey][flatColKey][indicatorIndex] = newValue;
    }
    const cellAggregator = this.tree[flatRowKey]?.[flatColKey]?.[indicatorIndex];
    if (cellAggregator?.records.length === 1) {
      cellAggregator.records[0][this.indicatorKeys[indicatorIndex]] = newValue;
    }
  }

  changeRecordFieldValue(fieldName: string, oldValue: string | number, value: string | number) {
    let isIndicatorName = false;

    for (let i = 0; i < this.indicatorKeys.length; i++) {
      if (this.indicatorKeys[i] === fieldName) {
        isIndicatorName = true;
      }
    }

    if (!isIndicatorName) {
      //常规records是数组的情况
      if (Array.isArray(this.records)) {
        for (let i = 0, len = this.records.length; i < len; i++) {
          const record = this.records[i];
          if (record[fieldName] === oldValue) {
            record[fieldName] = value;
          }
        }
      } else {
        //records是用户传来的按指标分组后的数据
        for (const key in this.records) {
          for (let i = 0, len = this.records[key].length; i < len; i++) {
            const record = this.records[key][i];
            if (record[fieldName] === oldValue) {
              record[fieldName] = value;
            }
          }
        }
      }

      this.rowFlatKeys = {};
      this.colFlatKeys = {};
      this.tree = {};
      this.processRecords();
    }
  }
  /** 主要是树形结构懒加载使用 */
  _rowTreeHasChanged() {
    if (!this.hasExtensionRowTree) {
      this.customRowTreeDimensionPaths = this.customTreeToDimensionPathArr(this.customRowTree, 'row');
    }
  }
  changeDataConfig(dataConfig: {
    rows: string[]; //行维度字段数组；
    columns: string[]; //列维度字段数组；
  }) {
    this.rows = dataConfig.rows;
    this.columns = dataConfig.columns;
  }
  addRecords(records: any[]) {
    for (let i = 0, len = records.length; i < len; i++) {
      const record = records[i];
      this.processRecord(record);
    }
    if (Array.isArray(this.records)) {
      this.records.push(records);
    }
  }

  //将树形结构转为二维数组
  private customTreeToDimensionPathArr(tree: IHeaderTreeDefine[], type: 'col' | 'row') {
    const result: {
      dimensionKey?: string | number;
      value: string;
      indicatorKey?: string | number;
      isVirtual?: boolean;
    }[][] = []; // 结果
    const that = this;
    function getPath(
      node: IHeaderTreeDefine,
      arr: {
        dimensionKey?: string | number;
        value: string;
        indicatorKey?: string | number;
        virtual?: boolean;
        childKeys?: (string | number)[];
      }[]
    ) {
      if (!node.virtual) {
        if (
          arr[arr.length - 1]?.childKeys &&
          node.dimensionKey &&
          arr[arr.length - 1].childKeys.indexOf(node.dimensionKey) === -1 &&
          node.dimensionKey !== arr[arr.length - 1].dimensionKey
        ) {
          arr[arr.length - 1].childKeys.push(node.dimensionKey);
        }
        arr.push({
          dimensionKey: isValid(node.indicatorKey) ? undefined : node.dimensionKey,
          value: node.value,
          indicatorKey: node.indicatorKey,
          virtual: node.virtual
        });
      }
      if ((node.children as [])?.length > 0) {
        if (that.rowHierarchyType === 'tree' && type === 'row') {
          arr[arr.length - 1].childKeys = [];
          result.push([...arr]);
        }
        // 存在多个节点就递归
        (node.children as [])?.forEach((childItem: IHeaderTreeDefine) => getPath(childItem, [...arr]));
      } else {
        result.push(arr);
      }
    }
    tree?.forEach((treeNode: IHeaderTreeDefine) => getPath(treeNode, []));
    return result;
  }

  private getFieldMatchColDimensionPaths(record: any) {
    const fieldMatchDimensionPaths = [];
    for (let i = 0; i < this.customColTreeDimensionPaths?.length ?? 0; i++) {
      const dimensionPath: {
        dimensionKey?: string | number;
        value: string;
        indicatorKey?: string | number;
        isVirtual?: boolean;
      }[] = this.customColTreeDimensionPaths[i];
      let isMatch = true;
      for (let j = 0; j < dimensionPath.length; j++) {
        const dimension = dimensionPath[j];
        if (
          (dimension.dimensionKey && record[dimension.dimensionKey] !== dimension.value) ||
          (dimension.indicatorKey && record[dimension.indicatorKey] === undefined)
        ) {
          isMatch = false;
          break;
        }
      }
      if (isMatch) {
        fieldMatchDimensionPaths.push(dimensionPath);
      }
    }
    return fieldMatchDimensionPaths;
  }

  private getFieldMatchRowDimensionPaths(record: any) {
    const fieldMatchDimensionPaths = [];
    for (let i = 0; i < this.customRowTreeDimensionPaths?.length ?? 0; i++) {
      const dimensionPath: {
        dimensionKey?: string | number;
        value: string;
        indicatorKey?: string | number;
        isVirtual?: boolean;
        childKeys?: (string | number)[];
      }[] = this.customRowTreeDimensionPaths[i];
      let isMatch = true;
      for (let j = 0; j < dimensionPath.length; j++) {
        const dimension = dimensionPath[j];
        if (
          (dimension.dimensionKey && record[dimension.dimensionKey] !== dimension.value) ||
          (dimension.indicatorKey && record[dimension.indicatorKey] === undefined)
        ) {
          isMatch = false;
          break;
        }
        if (dimension.childKeys && j === dimensionPath.length - 1) {
          if (dimension.childKeys.length > 0 && dimension.childKeys.find(key => isValid(record[key]))) {
            isMatch = false;
            break;
          }
        }
      }
      //上面条件符合 在进一步判断 如果有是指标在行的情况 且展示为树形结构，除了有指标的节点外 其他节点都不需要统计指标值
      if (isMatch) {
        if (!this.indicatorsAsCol && this.rowHierarchyType === 'tree') {
          if (
            !dimensionPath.find(path => {
              return path.indicatorKey;
            })
          ) {
            isMatch = false;
          }
        }
      }
      if (isMatch) {
        fieldMatchDimensionPaths.push(dimensionPath);
      }
    }
    return fieldMatchDimensionPaths;
  }
}

function arraySortByAnotherArray(array: string[], sortArray: string[]) {
  return array.sort((a, b) => {
    const aIndex = sortArray.indexOf(a);
    const bIndex = sortArray.indexOf(b);
    if (aIndex < bIndex) {
      return -1;
    }
    if (aIndex > bIndex) {
      return 1;
    }
    return 0;
  });
}
